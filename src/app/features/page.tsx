'use client';

import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CoreFeatures } from '@/components/sections/CoreFeatures';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero-like intro for the Features page */}
        <section className="pt-24 pb-12 bg-white dark:bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mb-6"
              >
                <Sparkles className="h-4 w-4" />
                Platform Capabilities
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl"
              >
                Features built for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Modern Event Management
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed"
              >
                Planora provides a comprehensive suite of tools designed to help organizers and attendees 
                connect effortlessly. From secure ticketing to real-time insights, everything you need is right here.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Existing Core Features Component */}
        <CoreFeatures />
      </main>

      <Footer />
    </div>
  );
}
