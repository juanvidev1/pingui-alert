import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export const verifyToken = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return c.json({ message: "No token provided" }, 401);
    }

    try {
        const secret = Deno.env.get("JWT_SECRET") || "";
        const decoded = jwt.verify(token, secret);
        c.set("user", decoded);
        await next();
    } catch (_err) {
        return c.json({ message: "Failed to authenticate token" }, 401);
    }
};
