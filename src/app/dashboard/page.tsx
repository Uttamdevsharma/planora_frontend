'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { 
  Plus, Calendar, Users, 
  Wallet, Mail, ArrowUpRight,
  TrendingUp, Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function DashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await api.get('/users/stats');
      return response.data.data;
    },
  });

  const { data: myEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['myEvents', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/events?creatorId=${user.id}&limit=3`);
      return response.data.data?.data || [];
    },
    enabled: !!user?.id,
  });

  const statCards = [
    { name: 'Total Events', value: stats?.totalEvents || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Participants', value: stats?.totalParticipants || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Total Earnings', value: `$${stats?.totalEarnings || 0}`, icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Pending Invitations', value: stats?.pendingInvitations || 0, icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-zinc-500">Here&apos;s what&apos;s happening with your events.</p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/dashboard/my-events')}>
          <Plus className="h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isStatsLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : (
            statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.name} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-zinc-300" />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                )
            })
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Events */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>My Recent Events</CardTitle>
                <CardDescription>Quick access to your latest creations</CardDescription>
            </CardHeader>
            <CardContent>
                {isEventsLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : myEvents && myEvents.length > 0 ? (
                    <div className="space-y-4">
                        {myEvents.map((event: any) => (
                            <div key={event.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">{event.title}</h4>
                                        <p className="text-xs text-zinc-500">{format(new Date(event.date), 'PP')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/my-events/${event.id}`)}>
                                    Manage
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="h-10 w-10 text-zinc-200 mb-4" />
                        <p className="text-sm text-zinc-500">No events found. Start by creating your first event!</p>
                        <Button variant="link" onClick={() => router.push('/dashboard/my-events')}>Create now</Button>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Activity/Notifications placeholder */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Stay updated with latest actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <div>
                            <p className="text-sm">New registration for <strong>Tech Summit</strong></p>
                            <p className="text-xs text-zinc-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-green-500"></div>
                        <div>
                            <p className="text-sm">Payment received for <strong>Design Workshop</strong></p>
                            <p className="text-xs text-zinc-500">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-zinc-300"></div>
                        <div>
                            <p className="text-sm">Profile updated successfully</p>
                            <p className="text-xs text-zinc-500">Yesterday</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
