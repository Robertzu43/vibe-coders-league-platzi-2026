import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { systemPrompt } from '../../lib/system-prompt';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = (env as any).AI;

    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: aiMessages,
      max_tokens: 500,
    });

    return new Response(JSON.stringify({ response: response.response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Chat API error:', errMsg);
    return new Response(
      JSON.stringify({
        error: 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
