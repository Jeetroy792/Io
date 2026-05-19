'use client';

import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { Message } from '@/types/chat';
import CodeBlock from './CodeBlock';
import AIActionButtons from './AIActionButtons';

interface MessageBubbleProps {
  message: Message;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onRegenerate: (id: string) => void;
  onSpeak: (id: string) => void;
}

function parseContent(content: string): { type: 'code' | 'text'; content: string; language?: string }[] {
  const parts: { type: 'code' | 'text'; content: string; language?: string }[] = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] || undefined });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text', content }];
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-[#e4e4e7] text-xs font-mono">$1</code>');
}

function renderTextBlock(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-1 my-2 ml-1">
          {listItems.map((li, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#d1d5db] leading-relaxed">
              <span className="text-[#8e8ea0] mt-0.5 flex-shrink-0">-</span>
              <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(li.replace(/^\s*-\s*/, '')) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (/^\s*-\s/.test(line)) {
      listItems.push(line);
    } else {
      flushList();
      if (!line.trim()) {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p
            key={i}
            className="text-sm text-[#d1d5db] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }}
          />
        );
      }
    }
  });
  flushList();

  return elements;
}

export default function MessageBubble({
  message,
  onLike,
  onDislike,
  onRegenerate,
  onSpeak,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const parts = parseContent(message.content);

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="px-4 py-3 rounded-2xl rounded-br-md bg-[#2a2a2a] border border-white/[0.06]">
            <p className="text-sm text-[#ececf1] leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex gap-4 group"
    >
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
        <Sparkles size={14} strokeWidth={2} className="text-[#0d0d0d]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#ececf1] mb-1.5 leading-tight">ChatGPT</p>
        <div>
          {parts.map((part, i) =>
            part.type === 'code' ? (
              <CodeBlock key={i} code={part.content} language={part.language} />
            ) : (
              <div key={i}>{renderTextBlock(part.content)}</div>
            )
          )}
        </div>
        {!message.isStreaming && (
          <AIActionButtons
            messageId={message.id}
            liked={message.liked ?? null}
            disliked={message.disliked ?? null}
            onLike={onLike}
            onDislike={onDislike}
            onRegenerate={onRegenerate}
            onSpeak={onSpeak}
          />
        )}
      </div>
    </motion.div>
  );
}
