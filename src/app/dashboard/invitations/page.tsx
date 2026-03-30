'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Mail, Calendar, User, 
    Check, X, DollarSign, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function InvitationsPage() {
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['myInvitations'],
    queryFn: async () => {
      const response = await api.get('/invitations/my-invitations');
      return response.data.data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: ({ invitationId, status }: { invitationId: string; status: string }) => 
      api.patch(`/invitations/${invitationId}/respond`, { status }),
    onSuccess: (res) => {
      toast.success(res.data.message || 'Response sent');
      queryClient.invalidateQueries({ queryKey: ['myInvitations'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to respond'),
  });

  const payAndAcceptMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post('/payments/checkout', { eventId });
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Payment initiation failed'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invitations</h1>
        <p className="text-zinc-500">Invitations sent to you for private events.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : invitations && invitations.length > 0 ? (
            invitations.map((inv: any) => (
                <Card key={inv.id} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                                    <Mail className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{inv.event.title}</h3>
                                    <p className="text-sm text-zinc-500">From {inv.sender.name}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(inv.event.date), 'PP')}
                                        </div>
                                        {inv.event.fee > 0 && (
                                            <div className="flex items-center gap-1 text-blue-600 font-bold">
                                                <DollarSign className="h-3 w-3" />
                                                Fee: ${inv.event.fee}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {inv.status === 'PENDING' ? (
                                    <>
                                        {inv.event.fee > 0 ? (
                                            <Button 
                                                size="sm" 
                                                className="gap-2" 
                                                isLoading={payAndAcceptMutation.isPending}
                                                onClick={() => payAndAcceptMutation.mutate(inv.event.id)}
                                            >
                                                Pay & Accept
                                            </Button>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                className="gap-2" 
                                                isLoading={respondMutation.isPending}
                                                onClick={() => respondMutation.mutate({ invitationId: inv.id, status: 'ACCEPTED' })}
                                            >
                                                <Check className="h-4 w-4" /> Accept
                                            </Button>
                                        )}
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-500"
                                            isLoading={respondMutation.isPending}
                                            onClick={() => respondMutation.mutate({ invitationId: inv.id, status: 'DECLINED' })}
                                        >
                                            <X className="h-4 w-4" /> Decline
                                        </Button>
                                    </>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        inv.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {inv.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Mail className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No invitations yet</h3>
                <p className="text-zinc-500 mt-2">When someone invites you to an event, it will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
