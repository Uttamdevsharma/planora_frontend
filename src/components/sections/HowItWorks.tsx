'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Find Event',
    description: 'Browse through thousands of events across categories and locations that match your interests.',
    icon: Search,
    color: 'bg-blue-500',
  },
  {
    title: 'Join / Pay',
    description: 'Secure your spot instantly. We support multiple payment methods for a seamless experience.',
    icon: CreditCard,
    color: 'bg-indigo-500',
  },
  {
    title: 'Experience',
    description: 'Show up, connect with people, and create unforgettable memories at your favorite events.',
    icon: Sparkles,
    color: 'bg-purple-500',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-zinc-500 dark:text-zinc-400"
          >
            Your journey from discovery to experience in three simple steps.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className="h-10 w-10" />
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-sm shadow-md border border-zinc-100 dark:border-zinc-800">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
