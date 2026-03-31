'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Wallet, TrendingUp, Calendar, 
    ArrowUpRight, DollarSign, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

export default function EarningsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user?.role === 'USER') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const { data: earnings, isLoading } = useQuery({
    queryKey: ['myEarnings'],
    queryFn: async () => {
      const response = await api.get('/payments/earnings');
      return response.data.data;
    },
  });

  const totalEarnings = earnings?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;

  if (loading || user?.role === 'USER') {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
          <p className="text-zinc-500">Track and manage your event revenue.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="bg-black text-white dark:bg-zinc-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-white/10 p-2">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium opacity-70">Total Revenue</p>
              <h3 className="text-3xl font-bold">${totalEarnings.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">Available to Withdraw</p>
              <h3 className="text-3xl font-bold">${totalEarnings.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">Last 30 Days</p>
              <h3 className="text-3xl font-bold">$0.00</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings per Event</CardTitle>
          <CardDescription>Detailed breakdown of your event income</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : earnings && earnings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-4 text-sm font-semibold text-zinc-500">Event</th>
                    <th className="pb-4 text-sm font-semibold text-zinc-500">Date</th>
                    <th className="pb-4 text-sm font-semibold text-zinc-500">Amount</th>
                    <th className="pb-4 text-sm font-semibold text-zinc-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {earnings.map((e: any) => (
                    <tr key={e.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-zinc-400" />
                          </div>
                          <span className="text-sm font-bold">{e.event.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-zinc-500">
                        {format(new Date(e.createdAt), 'PP')}
                      </td>
                      <td className="py-4 text-sm font-bold">
                        ${e.amount.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-zinc-200 mx-auto mb-2" />
              <p className="text-zinc-500">No earnings data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
