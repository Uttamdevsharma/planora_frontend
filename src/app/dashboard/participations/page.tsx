'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Calendar, MapPin, CheckCircle2, 
    Clock, AlertCircle, ExternalLink, Ban
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function ParticipationsPage() {
  const router = useRouter();
  const { data: participations, isLoading } = useQuery({
    queryKey: ['myParticipations'],
    queryFn: async () => {
      const response = await api.get('/participations/my-participations');
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Participations</h1>
        <p className="text-zinc-500">Events you&apos;ve joined or requested to join.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : participations && participations.length > 0 ? (
            participations.map((p: any) => (
                <Card key={p.id} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    <Calendar className="h-6 w-6 text-zinc-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{p.event.title}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(p.event.date), 'PP')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {p.event.venue}
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1">Organized by {p.event.creator.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
                                <div className="flex items-center gap-1.5">
                                    {p.status === 'APPROVED' ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                                            <CheckCircle2 className="h-3 w-3" /> Approved
                                        </span>
                                    ) : p.status === 'PENDING' ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase">
                                            <Clock className="h-3 w-3" /> Pending
                                        </span>
                                    ) : p.status === 'REJECTED' ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase">
                                            <AlertCircle className="h-3 w-3" /> Rejected
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full uppercase">
                                            <Ban className="h-3 w-3" /> Banned
                                        </span>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push(`/events/${p.event.id}`)}>
                                    View Event <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Calendar className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No participations yet</h3>
                <p className="text-zinc-500 mt-2 mb-6">Explore amazing events and join them!</p>
                <Button onClick={() => router.push('/events')}>Explore Events</Button>
            </div>
        )}
      </div>
    </div>
  );
}
