'use client';

import { motion } from 'framer-motion';
import { Sparkles, Code, Palette, Lightbulb, Cog } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: Code,
    label: 'Help me debug a Python bot script',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    icon: Palette,
    label: 'Design a premium UI template with Tailwind',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Lightbulb,
    label: 'Brainstorm content creation strategies',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Cog,
    label: 'Explain mechanical engine braking principles',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

interface WelcomeScreenProps {
  onPromptClick?: (prompt: string) => void;
}

export default function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pb-8 pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center mb-10"
      >
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-lg shadow-white/10">
          <Sparkles size={26} strokeWidth={1.75} className="text-[#0d0d0d]" />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          What can I help with?
        </h1>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl"
      >
        {SUGGESTIONS.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.label}
              variants={item}
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onPromptClick?.(suggestion.label)}
              className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.14] text-left transition-colors duration-200 group"
            >
              <div
                className={`w-8 h-8 rounded-lg ${suggestion.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <Icon size={15} strokeWidth={1.75} className={suggestion.color} />
              </div>
              <span className="text-sm text-[#c5c5d2] group-hover:text-white leading-relaxed transition-colors duration-200">
                {suggestion.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
