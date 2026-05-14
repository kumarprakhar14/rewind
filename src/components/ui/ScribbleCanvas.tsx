"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Scribble {
  id: string;
  text: string;
  color: string;
  posX: number;
  posY: number;
  rotation: number;
  authorName?: string;
  isAnonymous: boolean;
}

export function ScribbleCanvas({
  scribbles: initialScribbles,
  recipientId,
}: {
  scribbles: Scribble[];
  recipientId: string;
}) {
  const [scribbles, setScribbles] = useState(initialScribbles);
  const [isWriting, setIsWriting] = useState(false);
  const [newText, setNewText] = useState("");
  const [color, setColor] = useState("black");

  const colors = [
    { name: "black", class: "text-ink" },
    { name: "blue", class: "text-memory-blue" },
    { name: "red", class: "text-accent" },
    { name: "green", class: "text-memory-green" },
  ];

  const handleAddScribble = async () => {
    if (!newText.trim()) return;

    const posX = Math.random() * 80; // 0 to 80%
    const posY = Math.random() * 80; // 0 to 80%
    const rotation = Math.random() * 20 - 10; // -10 to 10 degrees

    // In a real implementation, you'd POST this to your API.
    const newScribble = {
      id: Date.now().toString(),
      text: newText,
      color,
      posX,
      posY,
      rotation,
      isAnonymous: false,
      authorName: "You",
    };

    setScribbles([...scribbles, newScribble]);
    setNewText("");
    setIsWriting(false);
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] bg-paper rounded-lg paper-shadow overflow-hidden border border-ink/10">
      {/* Background Texture inside canvas */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply grain-overlay pointer-events-none"></div>

      {/* Render Scribbles */}
      {scribbles.map((s) => {
        const colorClass =
          colors.find((c) => c.name === s.color)?.class || "text-ink";
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`absolute font-caveat text-2xl md:text-3xl max-w-[200px] leading-tight ${colorClass} drop-shadow-sm cursor-pointer hover:z-10`}
            style={{
              left: `${s.posX}%`,
              top: `${s.posY}%`,
              transform: `rotate(${s.rotation}deg)`,
            }}
            whileHover={{ scale: 1.1, rotate: 0 }}
            drag
            dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }} // Simple constraints
          >
            {s.text}
            {!s.isAnonymous && s.authorName && (
              <div className="text-sm opacity-70 text-right mt-1 font-sans">
                - {s.authorName}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Write Button */}
      <div className="absolute bottom-4 right-4 z-20">
        {isWriting ? (
          <div className="bg-paper-dark p-4 rounded-lg shadow-lg border border-ink/10 w-72">
            <textarea
              className="w-full h-24 bg-transparent resize-none font-caveat text-2xl focus:outline-none placeholder-ink/30"
              placeholder="Leave a memory..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={`w-5 h-5 rounded-full ${
                      c.name === "black"
                        ? "bg-ink"
                        : c.name === "blue"
                        ? "bg-memory-blue"
                        : c.name === "red"
                        ? "bg-accent"
                        : "bg-memory-green"
                    } ${
                      color === c.name
                        ? "ring-2 ring-offset-2 ring-offset-paper ring-ink"
                        : ""
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsWriting(false)}
                  className="text-xs font-sans text-ink-light hover:text-ink px-2 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddScribble}
                  className="bg-ink text-paper text-xs font-sans px-3 py-1 rounded hover:bg-ink-light transition-colors"
                >
                  Sign
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-full shadow hover:bg-ink-light transition-colors font-sans text-sm"
          >
            <Plus className="w-4 h-4" />
            Write on Wall
          </button>
        )}
      </div>
    </div>
  );
}
