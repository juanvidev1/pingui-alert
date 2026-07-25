import { Bot, Composer, Keyboard } from 'grammy';
import type { BotContext } from './context.js';
import config from '../config/index.js';
import { IntegrationService, MetricsService, InviteService } from '../services/index.js';
import { validateIntegrationOwner, setIntegrationIdInCtx } from '../middlewares/index.js';
import { Logger } from '../logger/index.js';

const bot = new Bot<BotContext>(config.botToken || '');
const maxAlerts = config.maxAlerts || 10;

const protectedComposer = new Composer<BotContext>();

protectedComposer.use(setIntegrationIdInCtx);

bot.use(protectedComposer);

bot.command('start', async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    const integration = await IntegrationService.getIntegration(chatId);

    if (integration) {
      await ctx.reply('You are already registered');
      return;
    }

    const firstIntegration = await IntegrationService.registerUserIntegration(chatId);

    if (!firstIntegration) {
      await ctx.reply('Error registering integration');
      return;
    }

    await ctx.reply('You are now able to create an integration using your temporal token');
  } catch (error) {
    console.error(error);
    await ctx.reply('Error registering integration');
  }
});

bot.command('help', async (ctx) => {
  await ctx.reply('You can see the documentation at https://pingui-alert.dev/docs');
});

bot.command('temporal_token', async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    const tempTokenData = await IntegrationService.createTemporalToken(chatId);

    await ctx.reply(`This is your temporal token, it will expire in 5 minutes: ${tempTokenData}`);
  } catch (error) {
    console.error(error);
    await MetricsService.incrementErrorsCount();
    await ctx.reply('Error creating temporal token');
  }
});

bot.command('get_me', async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    await ctx.reply(`Your user id is: ${chatId}`);
  } catch (error) {
    console.error(error);
    await MetricsService.incrementErrorsCount();
    await ctx.reply('Error getting user id');
  }
});

bot.command('join', async (ctx) => {
  const chatId = ctx?.chat?.id;
  const integrationId = ctx?.auth?.integration?.id || null;
  const code = ctx?.message?.text?.split(' ')[1];

  if (!code) {
    throw new Error('Please provide a code');
  }
  try {
    Logger.infoLog({ chatId: chatId, message: `Codigo a validar ${code}` });
    const validateCode = await InviteService.validateInvite(code, chatId);

    if (!validateCode?.valid) {
      throw new Error(validateCode?.message);
    }

    const addMemberRes = await IntegrationService.addMemberToIntegration(integrationId, chatId);

    if (addMemberRes?.error) {
      throw new Error(addMemberRes.error);
    }

    ctx.reply(`Joined successfully`);
  } catch (error) {
    if (error instanceof Error) {
      Logger.errorLog({ chatId: chatId, message: error.message });
      await MetricsService.incrementErrorsCount(chatId);
      await ctx.reply(error.message);
    }
  }
});

protectedComposer.command('join_owner', validateIntegrationOwner, async (ctx) => {
  const chatId = ctx.chat.id;
  const integrationId = ctx?.auth?.integration?.id || null;
  try {
    const addMemberRes = await IntegrationService.addMemberToIntegration(integrationId, chatId, chatId);

    if (addMemberRes?.error) {
      throw new Error(addMemberRes.error);
    }
    await ctx.reply('Workin on it');
  } catch (error: any) {
    if (error instanceof Error) {
      Logger.errorLog({ chatId: chatId, message: error.message + ' - ' + chatId });
    }
    console.error(error);
    await MetricsService.incrementErrorsCount(chatId);
    await ctx.reply(error || 'Error joining integration');
  }
});

bot.command('context_test', async (ctx) => {
  const chatId = ctx.chat.id;
  const integration = ctx?.auth?.integration;
  const isOwner = ctx?.auth?.isOwner;
  const role = ctx?.auth?.role;
  console.log('Data', {
    chatId,
    integration,
    isOwner,
    role
  });
  ctx.reply(`Chat id: ${chatId} - Integration: ${integration?.id} - Is owner: ${isOwner} - Role: ${role}`);
});

protectedComposer.command('get_members', validateIntegrationOwner, async (ctx) => {
  const chatId = ctx.chat.id;
  const keyboard = (data: unknown) => {
    return new Keyboard()
      .webApp('Administrar miembros', `https://502f-181-32-23-39.ngrok-free.app/members?data=${data}&chatId=${chatId}`)
      .resized();
  };

  if (!(await IntegrationService.validateIntegrationOwner(chatId))) {
    await ctx.reply('You are not allowed to do this');
    return;
  }

  const members = await IntegrationService.getIntegrationMembers(undefined, Number(chatId));

  if (!members) {
    await ctx.reply('No members found');
    return;
  }

  const data = Buffer.from(JSON.stringify(members), 'utf-8').toString('base64');

  await ctx.reply('Administra los miembros de la integración:', {
    reply_markup: keyboard(data)
  });
});

protectedComposer.command('create_invite', validateIntegrationOwner, async (ctx) => {
  const chatId = ctx.chat.id;

  try {
    const invite = await InviteService.createInvite(chatId, 3);

    if (!invite) {
      throw new Error('Error creating invite');
    }

    const invitationCode = invite.code;
    await ctx.reply(`The code for joining the integration alerts is ${invitationCode}`);
  } catch (error) {
    if (error instanceof Error) {
      await ctx.reply(error.message);
    }
  }
});

protectedComposer.command('verify_invite', validateIntegrationOwner, async (ctx) => {
  const chatId = ctx.chat.id;
  const code = ctx?.message?.text.split(' ')[1] || '';
  const isOwner = ctx?.auth?.isOwner;

  if (!code) {
    await ctx.reply('Please provide a code');
    return;
  }

  try {
    const invite = await InviteService.validateInvite(code, chatId, isOwner);
    if (!invite) {
      throw new Error('Invalid code');
    }

    ctx.reply(`${invite.message}`);
  } catch (error: any) {
    ctx.reply(error.message || 'Error verifying invite');
  }
});

bot.on('message:web_app_data', async (ctx) => {
  const payload = JSON.parse(ctx.message.web_app_data.data);
  // Oculta el teclado del usuario
  await ctx.reply('Procesando...', {
    reply_markup: { remove_keyboard: true }
  });

  if (payload.action === 'close') {
    await ctx.reply(payload?.message);
  }
});

protectedComposer.on('message:web_app_data', validateIntegrationOwner, async (ctx) => {
  const payload = JSON.parse(ctx.message.web_app_data.data);
  // Oculta el teclado del usuario
  await ctx.reply('Procesando...', {
    reply_markup: { remove_keyboard: true }
  });

  console.log('Payload', payload);

  if (payload.action === 'revoke') {
    const memberStatusRes = await IntegrationService.changeMemberStatus(Number(payload?.chatIds), false);

    if (!memberStatusRes) {
      Logger.errorLog({ chatId: Number(payload?.chatId), message: 'Error revoking member' });
      ctx.reply('Error revoking member');
      return;
    }

    // Tu lógica...
    await ctx.reply('Miembros revocados correctamente.');
  }
});

export default bot;
