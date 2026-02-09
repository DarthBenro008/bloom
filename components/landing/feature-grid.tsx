"use client";

import { motion } from "framer-motion";
import { 
  Bot, 
  Scale, 
  Heart, 
  Eye, 
  Zap, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Breakdown",
    description: "Transform vague intentions into concrete, actionable steps. Our AI understands context and creates realistic task flows.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Scale,
    title: "Plausibility Over Proof",
    description: "We don't verify your work with screenshots. Instead, we evaluate whether your progress makes logical sense.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Heart,
    title: "Never Shame, Always Growth",
    description: "Consequences exist in your garden, but the tone remains supportive. We believe in growth, not guilt.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Eye,
    title: "Visual Accountability",
    description: "No streaks or reminders. Your garden becomes a living narrative of your discipline that you can see and feel.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Zap,
    title: "Effort-Based Rewards",
    description: "Light tasks grow quick flowers. Deep work grows majestic trees. Your garden reflects the depth of your effort.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Shield,
    title: "Honesty-First Design",
    description: "The system is designed to catch implausible claims while celebrating genuine progress. Truth grows the best gardens.",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function FeatureGrid() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="text-primary">Real</span> Productivity
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature designed around one belief: people need clarity and visible consequences, not more motivation
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative h-full bg-card border rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Text */}
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
