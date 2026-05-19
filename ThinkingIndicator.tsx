'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ThinkingIndicator() {
  return (
    <div className="flex gap-4 py-2">
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
        <Sparkles size={14} strokeWidth={2} className="text-[#0d0d0d]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#ececf1] mb-2 leading-tight">ChatGPT</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#8e8ea0]"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <span className="text-sm text-[#8e8ea0]">Thinking</span>
        </div>
      </div>
    </div>
  );
}
