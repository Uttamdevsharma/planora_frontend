'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
          setIsVerifying(false);
          return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.get(`/payments/verify-payment?session_id=${sessionId}`);
        toast.success('Payment verified successfully!');
      } catch (error: any) {
        console.error('Payment verification failed:', error);
        toast.error(error.response?.data?.message || 'Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isVerifying) {
    return (
        <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-zinc-400 mx-auto" />
            <p className="text-zinc-500 font-medium">Verifying your payment...</p>
        </div>
    );
  }

  return (
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
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-zinc-400 mx-auto" />
                <p className="text-zinc-500 font-medium">Loading...</p>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
