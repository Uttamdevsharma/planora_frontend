'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, Trash2, Search, MapPin, 
  Video, Globe, DollarSign, User
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/Skeleton';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: async () => {
      const response = await api.get('/admin/events');
      return response.data.data;
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => api.delete(`/admin/events/${eventId}`),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    },
  });

  const handleDelete = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This will also remove all associated participants and data.')) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const events = eventsData || [];
  const filteredEvents = events.filter((e: any) => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-zinc-500">Monitor and moderate all platform events.</p>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm transition-focus focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-black"
            placeholder="Search events or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Event</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Creator</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Type</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Fee</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No events found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((e: any) => (
                  <tr key={e.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Link 
                          href={`/events/${e.id}`}
                          className="font-semibold text-zinc-900 dark:text-zinc-100 text-base hover:text-indigo-600 hover:underline transition-colors"
                        >
                          {e.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                           <Calendar className="h-3 w-3" />
                           {format(new Date(e.date), 'PP')} at {e.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                           <User className="h-3 w-3 text-zinc-500" />
                        </div>
                        <div className="text-zinc-900 dark:text-zinc-100">
                           <p className="font-medium">{e.creator.name}</p>
                           <p className="text-xs text-zinc-500">{e.creator.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        e.type === 'ONLINE' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      }`}>
                         {e.type === 'ONLINE' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                         {e.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-bold">
                         {e.fee > 0 ? (
                            <><DollarSign className="h-3.5 w-3.5 text-emerald-600" /> {e.fee.toFixed(2)}</>
                         ) : (
                            <span className="text-emerald-600 uppercase text-xs tracking-wider">Free</span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 border-red-100 hover:bg-red-50 dark:hover:bg-red-950/30 group"
                        onClick={() => handleDelete(e.id)}
                        disabled={deleteEventMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-between items-center text-sm text-zinc-500">
         <p>Showing <span className="font-semibold">{filteredEvents.length}</span> of <span className="font-semibold">{events.length}</span> platform events</p>
         <div className="flex gap-2 text-xs font-semibold uppercase tracking-tight text-zinc-400">
             Moderation power enabled
         </div>
      </div>
    </div>
  );
}
