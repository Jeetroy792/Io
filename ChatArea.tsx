'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Paperclip, Mic, Sparkles } from 'lucide-react';
import { ModelId, Message } from '@/types/chat';
import ChatHeader from './chat/ChatHeader';
import WelcomeScreen from './chat/WelcomeScreen';
import MessageBubble from './chat/MessageBubble';
import ThinkingIndicator from './chat/ThinkingIndicator';

interface ChatAreaProps {
  selectedModel: ModelId;
  onModelSelect: (id: ModelId) => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  onMobileMenuOpen: () => void;
  isMobile: boolean;
}

const MOCK_AI_RESPONSE = `Here's a breakdown of React Server Components:

**Key differences:**

- **Server Components** run only on the server, have direct access to backend resources, and cannot use hooks or browser APIs.
- **Client Components** (marked with \`'use client'\`) run in the browser, can use state, effects, and event listeners.

Here's a quick example of a Server Component:

\`\`\`tsx
// This runs on the server only
async function UserProfile({ id }: { id: string }) {
  const user = await db.users.findById(id);
  return <div>{user.name}</div>;
}
\`\`\`

And a Client Component:

\`\`\`tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

The mental model shift is that you now choose *where* each component lives, optimizing for both performance and interactivity.`;

export default function ChatArea({
  selectedModel,
  onModelSelect,
  onToggleSidebar,
  sidebarCollapsed,
  onMobileMenuOpen,
  isMobile,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simulateAIResponse = useCallback((userMsgId: string) => {
    setIsThinking(true);

    const aiMsgId = crypto.randomUUID();
    const fullText = MOCK_AI_RESPONSE;

    setTimeout(() => {
      setIsThinking(false);
      setStreamingId(aiMsgId);
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: 'assistant', content: '', isStreaming: true },
      ]);

      let charIndex = 0;
      const chunkSize = 3;
      const interval = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= fullText.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: fullText, isStreaming: false }
                : m
            )
          );
          setStreamingId(null);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: fullText.slice(0, charIndex) }
                : m
            )
          );
        }
      }, 15);
    }, 1500);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking || streamingId) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    simulateAIResponse(userMsg.id);
  };

  const handlePromptClick = (prompt: string) => {
    if (isThinking || streamingId) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    simulateAIResponse(userMsg.id);
  };

  const handleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, liked: m.liked ? null : true, disliked: null } : m
      )
    );
  };

  const handleDislike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, disliked: m.disliked ? null : true, liked: null } : m
      )
    );
  };

  const handleRegenerate = (id: string) => {
    if (isThinking || streamingId) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      simulateAIResponse(lastUserMsg.id);
    }
  };

  const handleSpeak = (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (msg && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.content.replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, ''));
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Header */}
      {isMobile ? (
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
          <button
            onClick={onMobileMenuOpen}
            className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5">
            <Sparkles size={18} strokeWidth={1.75} className="text-sky-400" />
            <span className="text-white font-semibold text-base tracking-tight">ChatGPT</span>
          </div>
          <div className="w-9" />
        </header>
      ) : (
        <ChatHeader
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onToggleSidebar={onToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}

      {/* Body */}
      {hasMessages || isThinking ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
          <div className="max-w-2xl mx-auto w-full pt-4 space-y-5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onLike={handleLike}
                onDislike={handleDislike}
                onRegenerate={handleRegenerate}
                onSpeak={handleSpeak}
              />
            ))}
            {isThinking && <ThinkingIndicator />}
            {streamingId && (
              <div className="flex items-center gap-1 pl-11">
                <span className="inline-block w-0.5 h-4 bg-[#8e8ea0] animate-pulse" />
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>
      ) : (
        <WelcomeScreen onPromptClick={handlePromptClick} />
      )}

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="max-w-2xl mx-auto">
          <InputBar
            input={input}
            textareaRef={textareaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
            disabled={isThinking || !!streamingId}
          />
          <p className="text-center text-xs text-[#8e8ea0] mt-3">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}

interface InputBarProps {
  input: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled: boolean;
}

function InputBar({ input, textareaRef, onInput, onKeyDown, onSend, disabled }: InputBarProps) {
  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl shadow-xl shadow-black/20 focus-within:border-white/20 focus-within:shadow-white/[0.03] transition-all duration-300">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInput}
        onKeyDown={onKeyDown}
        placeholder="Ask anything"
        rows={1}
        disabled={disabled}
        className="w-full bg-transparent px-4 pt-3.5 pb-12 text-sm text-white placeholder:text-[#8e8ea0] resize-none outline-none leading-relaxed disabled:opacity-50"
        style={{ minHeight: 56, maxHeight: 200 }}
      />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all duration-150">
            <Paperclip size={16} strokeWidth={1.75} />
          </button>
          <button className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all duration-150">
            <Mic size={16} strokeWidth={1.75} />
          </button>
        </div>
        <button
          onClick={onSend}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            canSend
              ? 'bg-white text-[#0d0d0d] hover:bg-white/90 shadow-md'
              : 'bg-white/10 text-[#8e8ea0] cursor-not-allowed'
          }`}
          disabled={!canSend}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
