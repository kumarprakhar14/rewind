"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MemoryProps {
  memory: {
    id: string;
    title: string;
    story: string;
    date: string;
    event?: string;
    location?: string;
    mediaUrl?: string;
    author: { name: string; image?: string };
    reactionsCount: number;
    commentsCount: number;
  };
}

export function MemoryCard({ memory }: MemoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-paper-dark p-4 pb-6 rounded-sm paper-shadow transform rotate-1 hover:rotate-0 transition-transform duration-300 max-w-lg mx-auto w-full mb-8"
      style={{
        boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {memory.mediaUrl && (
        <div className="relative w-full aspect-[4/3] mb-4 bg-ink/5">
          <Image
            src={memory.mediaUrl}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      )}

      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-marker text-2xl text-ink leading-tight">
            {memory.title}
          </h3>
          <span className="text-xs font-mono text-ink-light bg-paper px-2 py-1 rotate-[-2deg]">
            {new Date(memory.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <p className="text-ink-light font-sans text-sm leading-relaxed mb-4">
          {memory.story}
        </p>

        <div className="flex items-center justify-between border-t border-ink/10 pt-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              {memory.author.name.charAt(0)}
            </div>
            <span className="text-xs text-ink font-medium">
              {memory.author.name}
            </span>
          </div>

          <div className="flex gap-4 text-ink-light">
            <button className="flex items-center gap-1 hover:text-accent transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{memory.reactionsCount}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-memory-blue transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{memory.commentsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
