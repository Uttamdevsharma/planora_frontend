'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Payment Cancelled</h1>
          <p className="text-zinc-500 text-lg">
            The payment process was cancelled. No charges were made to your account.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full gap-2" onClick={() => router.back()}>
              Try Again <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => router.push('/events')}>
              Browse Events
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
