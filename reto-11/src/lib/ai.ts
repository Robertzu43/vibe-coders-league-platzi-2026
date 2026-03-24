import type { ChatMessage, Env } from '../types.js';

export async function chat(ai: Ai, messages: ChatMessage[]): Promise<string> {
  const response = await ai.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
    messages,
    max_tokens: 1024,
  }) as { response?: string };

  return response.response ?? 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
}
