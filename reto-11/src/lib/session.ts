import type { ChatMessage } from '../types.js';

const sessions = new Map<number, ChatMessage[]>();
const MAX_HISTORY = 20;

export function getHistory(chatId: number): ChatMessage[] {
  return sessions.get(chatId) ?? [];
}

export function addMessage(chatId: number, role: 'user' | 'assistant', content: string): void {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, []);
  }
  const history = sessions.get(chatId)!;
  history.push({ role, content });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

export function clearSession(chatId: number): void {
  sessions.delete(chatId);
}
