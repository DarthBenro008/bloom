"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  opacity: number;
}

const EMOJIS = ["🌸", "🌿", "🍃", "🌱", "✨", "🌻", "🌷", "🌼"];

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-emerald-950/30 via-slate-950 to-emerald-950/20" 
            : "bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30"
        }`}
      />
      
      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute w-[800px] h-[800px] rounded-full blur-3xl ${
          isDark ? "bg-emerald-500/10" : "bg-emerald-300/20"
        }`}
        animate={{
          x: ["-20%", "10%", "-20%"],
          y: ["-20%", "20%", "-20%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-3xl ${
          isDark ? "bg-teal-500/10" : "bg-teal-200/20"
        }`}
        animate={{
          x: ["10%", "-10%", "10%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "-10%", right: "-10%" }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div 
        className={`absolute inset-0 opacity-[0.03] ${
          isDark ? "opacity-[0.05]" : ""
        }`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? "#10b981" : "#059669"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#10b981" : "#059669"} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
