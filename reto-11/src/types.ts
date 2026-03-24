export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Env {
  AI: Ai;
  TELEGRAM_BOT_TOKEN: string;
  BOT_NAME: string;
}
