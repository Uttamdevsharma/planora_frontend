'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Users, Calendar, TrendingUp, DollarSign, UsersRound, Settings, ChevronRight, LayoutDashboard, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.data;
    },
  });

  const router = useRouter();
  const statsDataRaw = statsData || {};

  const stats = [
    {
      name: 'Total Users',
      value: statsDataRaw.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Total Events',
      value: statsDataRaw.totalEvents || 0,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      name: 'Total Participants',
      value: statsDataRaw.totalParticipants || 0,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      name: 'Platform Revenue',
      value: `$${statsDataRaw.platformRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500">Welcome back, Admin. Here is what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Quick Administration</h3>
                    <p className="text-sm text-zinc-500">Shortcut links to core modules</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/admin/users')}
                        className="flex flex-col items-start p-5 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all dark:border-zinc-800 dark:hover:border-indigo-900 group"
                      >
                         <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                            <UsersRound className="h-6 w-6" />
                         </div>
                         <h4 className="mt-4 font-bold text-lg">Member Directory</h4>
                         <p className="text-sm text-zinc-500 mt-1">Manage global user accounts, roles, and permissions.</p>
                      </button>

                      <button 
                         onClick={() => router.push('/admin/events')}
                         className="flex flex-col items-start p-5 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all dark:border-zinc-800 dark:hover:border-indigo-900 group"
                      >
                         <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="h-6 w-6" />
                         </div>
                         <h4 className="mt-4 font-bold text-lg">Content Moderation</h4>
                         <p className="text-sm text-zinc-500 mt-1">Monitor, feature, or delete any event across the platform.</p>
                      </button>
                  </div>
              </Card>

              <Card className="p-6">
                  <h3 className="text-lg font-bold">Recent System Activity</h3>
                  <div className="mt-4 space-y-4">
                      {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center gap-4 border-b border-zinc-100 pb-3 last:border-0 dark:border-zinc-800">
                              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                              <div className="flex-1 text-sm">
                                  <span className="font-medium">System Health Check:</span> All services are running optimally.
                                  <p className="text-xs text-zinc-500">Just now</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </Card>
          </div>

          <div className="space-y-6">
              <Card className="p-6 bg-zinc-900 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Settings className="h-24 w-24 rotate-12" />
                   </div>
                   <h3 className="text-lg font-bold">System Status</h3>
                   <div className="mt-6 space-y-4 relative z-10">
                       <div className="flex items-center justify-between">
                           <span className="text-sm text-zinc-400">Database</span>
                           <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Online</span>
                       </div>
                       <div className="flex items-center justify-between">
                           <span className="text-sm text-zinc-400">Auth Service</span>
                           <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Online</span>
                       </div>
                       <div className="flex items-center justify-between">
                           <span className="text-sm text-zinc-400">Stripe Sync</span>
                           <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Online</span>
                       </div>
                   </div>
                   <Button variant="secondary" className="w-full mt-8" onClick={() => router.push('/admin/settings')}>
                      Update System Config
                   </Button>
              </Card>

              <Card className="p-6">
                  <div className="flex items-center gap-2 text-indigo-600 mb-4">
                     <TrendingUp className="h-5 w-5" />
                     <h3 className="text-lg font-bold">Announcements</h3>
                  </div>
                  <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                          <p className="text-xs font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider">Maintenance</p>
                          <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-500">Scheduled cluster reboot tonight at 2 AM UTC.</p>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
