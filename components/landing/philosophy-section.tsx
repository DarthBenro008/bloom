"use client";

import { motion } from "framer-motion";
import { Lightbulb, Scale, Flower2, HeartHandshake } from "lucide-react";

const principles = [
  {
    icon: Lightbulb,
    title: "Clarity Before Motivation",
    description: "Motivation fails when tasks are vague. Bloom prioritizes breaking down overwhelming goals into clear, actionable steps first.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Scale,
    title: "Plausibility Over Proof",
    description: "We don't demand screenshots or invasive tracking. We simply evaluate whether your claimed progress makes logical sense.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Flower2,
    title: "Visual Consequence",
    description: "No streak counters or reminder notifications. Your garden naturally reflects your behavior – thriving with honest work, withering without it.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: HeartHandshake,
    title: "Never Shame",
    description: "Consequences exist, but the language and tone remain supportive. We believe in honest accountability, not guilt-driven motivation.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

export function PhilosophySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Built on a Simple Belief
              </h2>
              <div className="text-2xl md:text-3xl font-medium text-muted-foreground mb-8">
                People don&apos;t need more motivation.
                <br />
                <span className="text-primary">They need clearer action and visible consequences.</span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Traditional productivity apps focus on making you feel good about planning. 
                Bloom focuses on making you honest about doing. The garden doesn&apos;t lie – 
                it simply reflects the truth of your effort over time.
              </p>
            </motion.div>

            {/* Right: Principles Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group bg-card border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 rounded-lg ${principle.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <principle.icon className={`w-5 h-5 ${principle.color}`} />
                  </div>
                  <h3 className="font-bold mb-2 text-sm">{principle.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
