'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Image as ImageIcon, Check } from 'lucide-react';
import { ModelId, MODEL_OPTIONS } from '@/types/chat';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelect: (id: ModelId) => void;
}

export default function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selected = MODEL_OPTIONS.find((m) => m.id === selectedModel)!;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-sm text-[#c5c5d2] hover:bg-white/[0.07] hover:text-white hover:border-white/20 transition-all duration-200"
      >
        {selected.icon === 'reasoning' ? (
          <Zap size={13} strokeWidth={2} className="text-sky-400" />
        ) : (
          <ImageIcon size={13} strokeWidth={2} className="text-emerald-400" />
        )}
        <span className="font-medium">{selected.name}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={13} strokeWidth={2} className="text-[#8e8ea0]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            <div className="p-1.5">
              {MODEL_OPTIONS.map((model) => {
                const isSelected = model.id === selectedModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelect(model.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      isSelected
                        ? 'bg-white/[0.1] text-white'
                        : 'text-[#c5c5d2] hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        model.icon === 'reasoning'
                          ? 'bg-sky-500/15 text-sky-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      {model.icon === 'reasoning' ? (
                        <Zap size={15} strokeWidth={2} />
                      ) : (
                        <ImageIcon size={15} strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium leading-tight">{model.name}</p>
                      <p className="text-xs text-[#8e8ea0] leading-tight mt-0.5">{model.description}</p>
                    </div>
                    {isSelected && (
                      <Check size={15} strokeWidth={2.5} className="text-sky-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
