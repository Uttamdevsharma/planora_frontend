'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, animate } from 'framer-motion';
import { Calendar, Users, Heart, Award } from 'lucide-react';

const stats = [
  {
    label: 'Total Events',
    value: 1200,
    suffix: '+',
    icon: Calendar,
    color: 'text-blue-500',
  },
  {
    label: 'Active Users',
    value: 50000,
    suffix: '+',
    icon: Users,
    color: 'text-emerald-500',
  },
  {
    label: 'Happy Participants',
    value: 85000,
    suffix: '+',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    label: 'Verified Organizers',
    value: 450,
    suffix: '+',
    icon: Award,
    color: 'text-amber-500',
  },
];

const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue >= 1000 ? formatNumber(displayValue) : displayValue}
      {suffix}
    </span>
  );
};

export const PlatformStats = () => {
  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm ${stat.color} transition-transform hover:scale-110 duration-300`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
