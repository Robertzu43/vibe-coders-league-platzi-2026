import { webhookCallback } from 'grammy';
import type { Env } from './types.js';
import { createBot, handleMessage } from './bot.js';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }

    if (request.method !== 'POST' || url.pathname !== '/webhook') {
      return new Response('Not Found', { status: 404 });
    }

    const bot = createBot(env.TELEGRAM_BOT_TOKEN);

    bot.on('message:text', async (ctx) => {
      try {
        await handleMessage(ctx, env);
      } catch (error) {
        console.error('Message handler error:', error);
      }
    });

    bot.catch((err) => {
      console.error('Bot error:', err);
    });

    const handleWebhook = webhookCallback(bot, 'cloudflare-mod', {
      onTimeout: 'return',
      timeoutMilliseconds: 55000,
    });

    try {
      return await handleWebhook(request);
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('OK', { status: 200 });
    }
  },
};
