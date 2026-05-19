'use client';

import { useState } from 'react';
import { RefreshCw, Volume2, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AIActionButtonsProps {
  messageId: string;
  liked: boolean | null;
  disliked: boolean | null;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onRegenerate: (id: string) => void;
  onSpeak: (id: string) => void;
}

export default function AIActionButtons({
  messageId,
  liked,
  disliked,
  onLike,
  onDislike,
  onRegenerate,
  onSpeak,
}: AIActionButtonsProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    onSpeak(messageId);
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 3000);
  };

  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={() => onRegenerate(messageId)}
        className="p-1.5 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/10 transition-all duration-150"
        aria-label="Regenerate"
        title="Regenerate response"
      >
        <RefreshCw size={14} strokeWidth={1.75} />
      </button>
      <button
        onClick={handleSpeak}
        className={`p-1.5 rounded-lg transition-all duration-150 ${
          speaking
            ? 'text-sky-400 bg-sky-500/10'
            : 'text-[#8e8ea0] hover:text-white hover:bg-white/10'
        }`}
        aria-label="Text to speech"
        title="Read aloud"
      >
        <Volume2 size={14} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => onLike(messageId)}
        className={`p-1.5 rounded-lg transition-all duration-150 ${
          liked
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-[#8e8ea0] hover:text-white hover:bg-white/10'
        }`}
        aria-label="Like"
        title="Good response"
      >
        <ThumbsUp size={14} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => onDislike(messageId)}
        className={`p-1.5 rounded-lg transition-all duration-150 ${
          disliked
            ? 'text-red-400 bg-red-500/10'
            : 'text-[#8e8ea0] hover:text-white hover:bg-white/10'
        }`}
        aria-label="Dislike"
        title="Bad response"
      >
        <ThumbsDown size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
