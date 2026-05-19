'use client';

import { PanelLeft, Share } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { ModelId } from '@/types/chat';

interface ChatHeaderProps {
  selectedModel: ModelId;
  onModelSelect: (id: ModelId) => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function ChatHeader({
  selectedModel,
  onModelSelect,
  onToggleSidebar,
  sidebarCollapsed,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Open sidebar"
          >
            <PanelLeft size={18} strokeWidth={1.75} />
          </button>
        )}
      </div>

      <ModelSelector selectedModel={selectedModel} onSelect={onModelSelect} />

      <button
        className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Share"
      >
        <Share size={16} strokeWidth={1.75} />
      </button>
    </header>
  );
}
