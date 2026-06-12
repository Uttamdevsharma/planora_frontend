'use client';

import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Calendar, Users, BarChart3, Send, Shield, Zap, Globe, Brain,
  DollarSign, Bell, ArrowRight, CheckCircle2, Sparkles, Star,
  TrendingUp, Lock, ImagePlus, Clock
} from 'lucide-react';

const organiserFeatures = [
  {
    icon: Calendar,
    title: 'Effortless Event Creation',
    description:
      'Launch a fully-featured event page in minutes. Set date, location, capacity, cover image, ticket type (free or paid), and visibility — all from a clean, intuitive dashboard.',
    tags: ['Public & Private', 'Free & Paid Tickets', 'Custom Cover Image'],
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  {
    icon: Send,
    title: 'Smart Invite Management',
    description:
      'Invite specific attendees by email or generate a shareable link. Track who has accepted, pending, or declined — and send reminders in one click.',
    tags: ['Email Invitations', 'RSVP Tracking', 'Shareable Links'],
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/10',
    border: 'border-indigo-100 dark:border-indigo-900/30',
  },
  {
    icon: Brain,
    title: 'AI-Powered Tools',
    description:
      'Stuck on a description? Let Planora\'s AI assistant generate a compelling event description for you. Also use the "Plai" chat assistant to guide attendees and answer questions.',
    tags: ['AI Description Generator', 'Plai Chat Assistant', 'Smart Suggestions'],
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-900/10',
    border: 'border-violet-100 dark:border-violet-900/30',
  },
  {
    icon: DollarSign,
    title: 'Built-in Earnings Tracking',
    description:
      'Accept payments for paid-ticket events and track your earnings directly from your organizer dashboard. Know exactly how much revenue every event generates.',
    tags: ['Paid Events', 'Revenue Dashboard', 'Per-Event Breakdown'],
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-100 dark:border-green-900/30',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Monitor registrations, attendance rates, and engagement metrics as they happen. Make data-driven decisions before and after every event.',
    tags: ['Live Registration Data', 'Attendance Rates', 'Post-Event Reports'],
    gradient: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-orange-100 dark:border-orange-900/30',
  },
  {
    icon: Lock,
    title: 'Full Privacy Control',
    description:
      'Choose who can see and join your event. Public events appear on the Planora listings. Private events are invite-only — perfect for corporate gatherings and exclusive meetups.',
    tags: ['Public or Private', 'Invite-Only Mode', 'You\'re in Control'],
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-900/10',
    border: 'border-rose-100 dark:border-rose-900/30',
  },
];

const quickStats = [
  { label: 'Events Created', value: '10,000+', icon: Calendar },
  { label: 'Active Organizers', value: '2,400+', icon: Users },
  { label: 'Tickets Sold', value: '85,000+', icon: TrendingUp },
  { label: 'Countries Reached', value: '40+', icon: Globe },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Community Lead, TechBD',
    text: 'Planora made organizing our monthly meetups ridiculously easy. The invite management alone saved us hours every month.',
    avatar: 'S',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  },
  {
    name: 'Marcus Osei',
    role: 'Event Director, CreativeCon',
    text: 'The AI description generator was a game-changer. What used to take an hour now takes 30 seconds. Our event pages look incredible.',
    avatar: 'M',
    color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  },
  {
    name: 'Aisha Rauf',
    role: 'Founder, NomadSummit',
    text: "We ran a paid conference for 300 people using Planora. The earnings dashboard and real-time registration data made everything so transparent.",
    avatar: 'A',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
];

const steps = [
  { icon: Users, title: 'Create your account', desc: 'Sign up free with email or Google in under 30 seconds.' },
  { icon: ImagePlus, title: 'Build your event', desc: 'Fill in the details and go live from your dashboard.' },
  { icon: Bell, title: 'Invite & manage', desc: 'Send invites, track RSVPs, and manage your guest list.' },
  { icon: BarChart3, title: 'Track & earn', desc: 'Monitor analytics and collect earnings from paid tickets.' },
];

export default function ForOrganizersPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-20 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Built for Event Organizers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 max-w-4xl mx-auto leading-[1.1]"
          >
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              host great events
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Planora gives organizers the tools to create, manage, and grow their events — from
            intimate private gatherings to large public conferences. No complexity. Just results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold gap-2 shadow-lg shadow-indigo-500/20"
              onClick={() => router.push('/register')}
            >
              Start Hosting Free <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-7 text-lg font-bold"
              onClick={() => router.push('/how-it-works')}
            >
              See How It Works
            </Button>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-950/60 border-y border-zinc-100 dark:border-zinc-900">
          <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-1">
                  <stat.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black text-zinc-900 dark:text-white mb-4"
              >
                Organizer tools that make an impact
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto"
              >
                From first idea to post-event report, Planora covers every stage of your event journey.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organiserFeatures.map((feature, i) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-3xl border ${feature.border} ${feature.bg} p-7 flex flex-col gap-5 transition-shadow hover:shadow-lg`}
                  >
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md`}>
                      <FeatureIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {feature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-700/50 rounded-full px-3 py-1 text-zinc-600 dark:text-zinc-400"
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Start Steps */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950/60 border-y border-zinc-100 dark:border-zinc-900 px-4">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-14"
            >
              Go from idea to live event in 4 steps
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center">
                        <StepIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{step.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                    {i < steps.length - 1 && (
                      <div className="hidden lg:flex absolute" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-12"
            >
              Organizers love Planora
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-7 flex flex-col gap-5"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed flex-1">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-600 p-1 shadow-2xl shadow-indigo-500/20"
          >
            <div className="rounded-[2.75rem] bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none" />
              <div className="relative">
                <Zap className="h-12 w-12 text-indigo-200 mx-auto mb-6" />
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  Ready to host your <br className="hidden sm:block" /> first event?
                </h2>
                <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
                  Join thousands of organizers already using Planora. It&apos;s completely free to start — no credit card, no catch.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full px-10 py-7 text-lg font-bold bg-white text-indigo-600 hover:bg-indigo-50 gap-2 shadow-lg"
                    onClick={() => router.push('/register')}
                  >
                    Create My First Event <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-10 py-7 text-lg font-bold text-white hover:bg-white/10 border border-white/30"
                    onClick={() => router.push('/events')}
                  >
                    Explore Events
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
