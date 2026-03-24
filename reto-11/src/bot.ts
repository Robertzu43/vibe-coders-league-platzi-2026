import { Bot, Context } from 'grammy';
import type { Env, ChatMessage } from './types.js';
import { buildSystemPrompt } from './lib/system-prompt.js';
import { chat } from './lib/ai.js';
import { getHistory, addMessage, clearSession } from './lib/session.js';

export function createBot(token: string) {
  const bot = new Bot(token);

  bot.command('start', async (ctx) => {
    const greeting = `¡Hola! Soy *Dorada* ☕, tu asistente interna de Sierra Dorada Coffee Exports.\n\nPuedo ayudarte con:\n\n• *Procesos de exportación* — documentos, tiempos, certificaciones\n• *Políticas internas* — horarios, beneficios, vacaciones, contactos\n• *Onboarding* — todo lo que necesitas en tu primer día\n• *Calidad y catación* — protocolos SCA, perfiles de taza, defectos\n\n¿En qué te puedo ayudar?`;
    await ctx.reply(greeting, { parse_mode: 'Markdown' });
  });

  bot.command('reset', async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply('Conversación reiniciada. ¿En qué te puedo ayudar?');
  });

  bot.command('help', async (ctx) => {
    const help = `*Comandos disponibles:*\n\n/start — Saludo e introducción\n/reset — Reiniciar conversación\n/help — Este mensaje de ayuda\n\nO simplemente escríbeme tu pregunta sobre Sierra Dorada.`;
    await ctx.reply(help, { parse_mode: 'Markdown' });
  });

  return bot;
}

export async function handleMessage(ctx: Context, env: Env): Promise<void> {
  const text = ctx.message?.text;
  if (!text || !ctx.chat) return;

  const chatId = ctx.chat.id;

  addMessage(chatId, 'user', text);

  const systemMessage: ChatMessage = {
    role: 'system',
    content: buildSystemPrompt(),
  };

  const messages: ChatMessage[] = [
    systemMessage,
    ...getHistory(chatId),
  ];

  const response = await chat(env.AI, messages);

  addMessage(chatId, 'assistant', response);

  await ctx.reply(response, { parse_mode: 'Markdown' });
}
