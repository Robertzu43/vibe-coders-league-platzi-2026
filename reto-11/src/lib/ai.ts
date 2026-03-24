import type { ChatMessage, Env } from '../types.js';

export async function chat(ai: Ai, messages: ChatMessage[]): Promise<string> {
  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      max_tokens: 1024,
    }) as { response?: string };

    return response.response ?? 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
  } catch (error) {
    console.error('AI error:', error);
    return 'Hubo un error al procesar tu mensaje. Intenta de nuevo en unos segundos.';
  }
}
