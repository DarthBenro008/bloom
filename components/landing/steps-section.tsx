"use client";

import { motion } from "framer-motion";
import { Sparkles, ListTodo, Brain, Flower2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter Your Task",
    description: "Tell Bloom what you want to work on, even if it's vague. \"Work on my startup\" or \"Study for exams\" is perfectly fine.",
    icon: ListTodo,
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
  },
  {
    number: "02",
    title: "AI Breaks It Down",
    description: "Our AI transforms your vague idea into 2-6 concrete, actionable steps with clear expected outputs.",
    icon: Sparkles,
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
  },
  {
    number: "03",
    title: "Do the Work",
    description: "Bloom doesn't track time or interrupt you. Do the work in the real world, then come back to reflect.",
    icon: Brain,
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
  },
  {
    number: "04",
    title: "Watch It Bloom",
    description: "Complete work honestly and your garden grows. Skip it, and watch the consequences unfold naturally.",
    icon: Flower2,
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function StepsSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
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
              How <span className="text-primary">Bloom</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your productivity into a thriving garden
            </p>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="group relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                
                <div className="relative bg-card border rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 z-10">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    {/* Number badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Visual timeline for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex justify-center lg:hidden"
          >
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
