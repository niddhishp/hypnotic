import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  context: string;
  
  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setIsOpen: (value: boolean) => void;
  setIsTyping: (value: boolean) => void;
  setContext: (context: string) => void;
}

// UI state - can be persisted
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      context: '',
      
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [] }),
      setIsOpen: (value) => set({ isOpen: value }),
      setIsTyping: (value) => set({ isTyping: value }),
      setContext: (context) => set({ context }),
    }),
    { name: 'hypnotic-chat-ui' }
  )
);
