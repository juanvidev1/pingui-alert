import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middelware/verifyToken.ts";
import { Bot } from "grammy";
import { config } from "dotenv";
import { UserService } from "./db/services.ts";



// Load environment variables
config();

const app = new Hono();
app.use('*', prettyJSON());

// Initialize Bot
const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

const generateSecret = (data: object) => {
  return jwt.sign(data, Deno.env.get("JWT_SECRET") || "", { expiresIn: "60 days" });
}

bot.command("start", async (ctx) => {
  const chatId = ctx.chat.id;
  const userName = ctx.from?.username || "";
  const secret = generateSecret({ chatId, userName });
  try {
    UserService.createUser(userName, chatId, secret);
    await ctx.reply("Hello! I'm Pingui Alert. You are now subscribed to alerts.") ;
    await ctx.reply(`Your API key is: ${secret}`);
  } catch (error) {
    console.log(error);
    await ctx.reply("There was an error subscribing you to alerts. Please try again later.");
  }
});

// Start the bot
bot.start();

app.get("/alert", verifyToken, (c) => {
  return c.json({ message: "Hello World" });
});

app.post("/alert", verifyToken, async (c) => {
  const body = await c.req.json();
  const alertMessage = body.alert;
  
  try {
    const users = UserService.getAllUsers();
    const results: { chatId: number | string; success: boolean; error?: string }[] = [];
    for (const user of users) {
      try {
        bot.api.sendMessage(user.chatId, alertMessage);
        results.push({ chatId: user.chatId, success: true });
      } catch (error) {
        console.error(`Failed to send to ${user.chatId}:`, error);
        results.push({ chatId: user.chatId, success: false, error: String(error) });
      }
    }
    return c.json({ 
      message: "Alert processing complete", 
      alert: alertMessage,
      results 
    });
  } catch (error) {
    console.error("Failed to process alert:", error);
    return c.json({ 
      message: "Failed to process alert", 
      error: String(error) 
    });
  }
});

Deno.serve(app.fetch);
