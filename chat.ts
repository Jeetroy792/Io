export type ChatGroup = 'today' | 'yesterday' | 'previous7days';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  group: ChatGroup;
  isActive?: boolean;
}

export interface SidebarState {
  isOpen: boolean;
  activeConversationId: string | null;
}

export type ModelId = 'chatgpt-v5' | 'image-model-2';

export interface ModelOption {
  id: ModelId;
  name: string;
  description: string;
  icon: 'reasoning' | 'image';
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'chatgpt-v5',
    name: 'ChatGPT v5',
    description: 'Reasoning',
    icon: 'reasoning',
  },
  {
    id: 'image-model-2',
    name: 'Image Model 2.0',
    description: 'Image generation',
    icon: 'image',
  },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  liked?: boolean | null;
  disliked?: boolean | null;
}
