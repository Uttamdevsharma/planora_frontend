'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I join an event on Planora?',
    answer: 'Simply browse the events, click on the one you like, and hit the "Join Event" button. If it is a paid event, you will be redirected to our secure checkout page.',
    category: 'Joining',
  },
  {
    question: 'Are my payments secure?',
    answer: 'Absolutely. We use Stripe, a world-class payment processor, to handle all transactions. Your sensitive payment information never touches our servers.',
    category: 'Payments',
  },
  {
    question: 'Can I invite friends to an event?',
    answer: 'Yes! Once you have joined an event, you can use the "Invite" feature to send email invitations or share a unique link with your friends and colleagues.',
    category: 'Invitations',
  },
  {
    question: 'How do I create my own event?',
    answer: 'From your dashboard, click on "Create Event". You will be guided through a simple form to add details, set ticket prices, and choose your target audience.',
    category: 'Organizing',
  },
  {
    question: 'What is the platform fee?',
    answer: 'Planora is free to use for free events. For paid events, we charge a small platform fee (typically 5%) to cover processing and operational costs.',
    category: 'Payments',
  },
  {
    question: 'How do I manage my guest list?',
    answer: 'Event organizers have access to a robust management dashboard where they can see all participants, approve pending requests, and send updates.',
    category: 'Organizing',
  },
];

const FAQItem = ({ faq, isOpen, toggle }: { faq: typeof faqs[0], isOpen: boolean, toggle: () => void }) => {
  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'}`}>
            <HelpCircle className="h-5 w-5" />
          </div>
          <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'}`}>
            {faq.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className={`h-6 w-6 ${isOpen ? 'text-blue-500' : 'text-zinc-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pb-8 pl-14 pr-4">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-zinc-500 dark:text-zinc-400"
          >
            Everything you need to know about joining and hosting events.
          </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-4 md:p-8 border border-zinc-100 dark:border-zinc-800"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              toggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
            <p className="text-zinc-500">
                Still have questions? <a href="mailto:support@planora.com" className="font-bold text-blue-500 hover:underline">Contact our support team</a>
            </p>
        </div>
      </div>
    </section>
  );
};
