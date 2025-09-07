export enum AppPhase {
  INITIAL = 'INITIAL',
  CHATTING = 'CHATTING',
  FINAL = 'FINAL',
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export type Language = 'en-US' | 'de-DE';
