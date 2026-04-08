'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, PlusCircle, Users, Zap, Globe, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'Secure Payments',
    description: 'Industry-standard encryption and secure payment gateways like Stripe for all transitions.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Easy Event Creation',
    description: 'Launch your event in minutes with our intuitive dashboard and step-by-step guidance.',
    icon: PlusCircle,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Networking Opportunities',
    description: 'Connect with like-minded individuals and grow your community with our social features.',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Real-time Analytics',
    description: 'Track your event growth, ticket sales, and participant engagement in real-time.',
    icon: BarChart3,
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    title: 'Global Reach',
    description: 'Promote your events to a global audience or keep them local - the choice is yours.',
    icon: Globe,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Instant Notifications',
    description: 'Keep your participants updated with automated email and push notifications.',
    icon: Zap,
    gradient: 'from-rose-500 to-orange-500',
  },
];

export const CoreFeatures = () => {
  return (
    <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl"
          >
            Why Choose Planora?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-zinc-500 dark:text-zinc-400"
          >
            Powerful tools designed to help you create, manage, and scale your events effortlessly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group p-8 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm transition-all hover:shadow-2xl hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
              
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                <feature.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-sm font-bold text-zinc-900 dark:text-white opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
