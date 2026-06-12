'use client';

import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Calendar, Send, BarChart3, ArrowRight, CheckCircle2,
  Sparkles, Shield, Zap, Globe
} from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Sign up in seconds with your email or Google account. No credit card required to get started. Your profile is your organizer identity on Planora.',
    highlights: ['Free to join', 'Google OAuth supported', 'Instant access'],
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Create Your Event',
    description:
      'Use our intuitive event builder to set up everything — title, date, location, capacity, ticket pricing, and a stunning cover image. AI tools help you write the perfect description.',
    highlights: ['Drag-and-drop builder', 'AI description generator', 'Public or private events'],
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/10',
    border: 'border-indigo-100 dark:border-indigo-900/30',
  },
  {
    step: '03',
    icon: Send,
    title: 'Invite & Manage Attendees',
    description:
      'Share your event link or send personalized email invitations directly from the dashboard. Track RSVPs in real-time and manage your guest list with ease.',
    highlights: ['One-click invite links', 'RSVP tracking', 'Role-based permissions'],
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-900/10',
    border: 'border-violet-100 dark:border-violet-900/30',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Track Results & Earn',
    description:
      'After your event, dive into detailed analytics. See attendance rates, revenue earned from paid tickets, and engagement metrics to improve your next event.',
    highlights: ['Real-time analytics', 'Revenue dashboard', 'Post-event reports'],
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    border: 'border-purple-100 dark:border-purple-900/30',
  },
];

const benefits = [
  { icon: Zap, label: 'Launch in minutes', desc: 'Get your first event live in under 5 minutes.' },
  { icon: Shield, label: 'Secure & reliable', desc: '99.9% uptime with enterprise-grade security.' },
  { icon: Globe, label: 'Reach anyone, anywhere', desc: 'Public events are discoverable by all Planora users.' },
  { icon: CheckCircle2, label: 'No tech skills needed', desc: 'Our intuitive UI was built for everyone.' },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-16 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Simple by Design
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            How{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Planora
            </span>{' '}
            Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            From idea to a live event with real attendees — here's everything you need
            to know to get started on Planora.
          </motion.p>
        </section>

        {/* Steps */}
        <section className="pb-24 px-4">
          <div className="mx-auto max-w-5xl space-y-8">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isEven = i % 2 === 1;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center rounded-3xl border ${step.border} ${step.bg} p-8 md:p-12`}
                >
                  {/* Visual Side */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <StepIcon className="h-12 w-12 text-white" />
                    </div>
                    <span className="text-5xl font-black text-zinc-200 dark:text-zinc-800 select-none">
                      {step.step}
                    </span>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-4">
                      {step.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {step.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950/50 border-y border-zinc-100 dark:border-zinc-900 px-4">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-12"
            >
              Why organizers love Planora
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center"
                >
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{b.label}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">
              Ready to host your first event?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10">
              Join thousands of event organizers already using Planora. It's free to start.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-bold gap-2"
                onClick={() => router.push('/register')}
              >
                Start for Free <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-7 text-lg font-bold"
                onClick={() => router.push('/events')}
              >
                Browse Events
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
