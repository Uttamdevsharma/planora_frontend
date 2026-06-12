'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';

type FAQ = { q: string; a: string };
type Category = { id: string; label: string; faqs: FAQ[] };

const categories: Category[] = [
  {
    id: 'general',
    label: 'General',
    faqs: [
      { q: 'What is Planora?', a: 'Planora is a modern event management platform that helps organizers create, manage, and promote events of any size — from intimate private gatherings to large public conferences.' },
      { q: 'Is Planora free to use?', a: 'Yes! Planora offers a free tier that lets you create up to 3 active events with up to 50 attendees each. Paid plans unlock more features and higher limits.' },
      { q: 'Do I need technical skills to use Planora?', a: 'Absolutely not. Planora is designed for everyone. Our intuitive dashboard lets you go from sign-up to a live event in under 5 minutes.' },
      { q: 'What types of events can I host?', a: 'Anything! Conferences, workshops, meetups, concerts, private dinners, sports events, webinars — Planora supports virtually any event format, in-person or online.' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    faqs: [
      { q: 'Can I make my event private?', a: 'Yes. When creating an event, you can set it to Private, meaning it won\'t appear in the public events listing. Attendees can only join via a direct invite link.' },
      { q: 'How do I invite people to my event?', a: 'From your event dashboard, you can share a public link, send email invitations directly to specific addresses, or generate a QR code for in-person sharing.' },
      { q: 'Can I edit my event after publishing?', a: 'Yes, you can update event details like the title, description, date, and location at any time from your dashboard. Attendees will be notified of major changes.' },
      { q: 'Is there a limit on the number of events I can create?', a: 'Free plan users can create up to 3 active events simultaneously. Pro and Enterprise plans offer unlimited active events.' },
      { q: "What happens if I cancel an event?", a: "You can cancel an event from your dashboard at any time. Registered attendees will receive an automatic notification. If tickets were sold, refunds must be processed manually." },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    faqs: [
      { q: 'How do paid tickets work?', a: 'On Pro and Enterprise plans, you can set a ticket price for your event. Attendees pay securely at registration, and earnings are deposited to your linked account minus a small platform fee.' },
      { q: 'What are the platform fees?', a: 'Pro plan: 2% per paid ticket. Enterprise plan: 0.5% per paid ticket. Free plan: paid tickets are not supported.' },
      { q: 'When do I receive my earnings?', a: 'Earnings are typically processed and transferred within 3–5 business days after the event concludes, depending on your region and payment provider.' },
      { q: 'What payment methods do attendees accept?', a: 'Attendees can pay via credit/debit card, PayPal, and in some regions, local payment methods. All transactions are secured by SSL encryption.' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    faqs: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within a few minutes. Check your spam folder if it doesn\'t arrive.' },
      { q: 'Can I change my email address?', a: 'Yes. Go to Dashboard → Settings → Account to update your email. You\'ll need to verify the new address before the change takes effect.' },
      { q: 'Can I delete my account?', a: 'Yes, you can permanently delete your account from Settings → Account → Danger Zone. This action is irreversible and removes all your events, data, and history.' },
      { q: 'Is my personal data safe?', a: 'Planora takes data privacy seriously. We never sell your data to third parties. All data is stored securely and processed in accordance with GDPR guidelines.' },
    ],
  },
];

function AccordionItem({ faq, idx }: { faq: FAQ; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-zinc-900 dark:text-white text-base">{faq.q}</span>
        <ChevronDown
          className={`h-5 w-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return categories.flatMap((c) =>
        c.faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
      );
    }
    return categories.find((c) => c.id === activeCategory)?.faqs ?? [];
  }, [activeCategory, searchQuery]);

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
            Help Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Questions
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Can't find what you're looking for?{' '}
            <a href="/contact" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4">
              Contact our support team
            </a>
            .
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-12 pr-4 py-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </motion.div>
        </section>

        {/* Content */}
        <section className="pb-24 px-4">
          <div className="mx-auto max-w-4xl">
            {/* Category Tabs */}
            {!searchQuery.trim() && (
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {searchQuery.trim() && (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
            )}

            {filteredFAQs.length > 0 ? (
              <div className="space-y-3">
                {filteredFAQs.map((faq, i) => (
                  <AccordionItem key={`${faq.q}-${i}`} faq={faq} idx={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <HelpCircle className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No results found</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Try a different search term, or{' '}
                  <a href="/contact" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4">
                    contact support
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
