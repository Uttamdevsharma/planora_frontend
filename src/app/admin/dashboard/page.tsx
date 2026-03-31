'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.data;
    },
  });

  const stats = [
    {
      name: 'Total Users',
      value: statsData?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Total Events',
      value: statsData?.totalEvents || 0,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      name: 'Platform Revenue',
      value: `$${statsData?.platformRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      name: 'Growth rate',
      value: '+12%',
      icon: TrendingUp,
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
              <h3 className="text-lg font-bold">Recent System Activity</h3>
              <div className="mt-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 border-b border-zinc-100 pb-3 last:border-0 dark:border-zinc-800">
                          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                          <div className="flex-1">
                              <p className="text-sm font-medium">New user registered</p>
                              <p className="text-xs text-zinc-500">2 hours ago</p>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
          
          <Card className="p-6">
              <h3 className="text-lg font-bold">Platform Announcements</h3>
              <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm font-medium text-indigo-900 dark:text-indigo-400">System maintenance scheduled</p>
                  <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-500">Scheduled for tonight at 2:00 AM UTC. Expect minimal downtime.</p>
              </div>
          </Card>
      </div>
    </div>
  );
}
