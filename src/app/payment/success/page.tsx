'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Payment Successful!</h1>
          <p className="text-zinc-500 text-lg">
            Thank you for your purchase. Your registration request has been submitted and is now pending approval from the organizer.
          </p>
          
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-left">
             <div className="flex items-center gap-3 text-sm text-zinc-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span>What happens next?</span>
             </div>
             <p className="text-sm font-medium">The organizer will review your request. You&apos;ll be notified once you are approved to join the event.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full gap-2" onClick={() => router.push('/dashboard/participations')}>
              View My Participations <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
