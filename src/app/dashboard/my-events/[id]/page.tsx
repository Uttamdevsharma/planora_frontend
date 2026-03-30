'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Check, X, Ban, User, Users,
    ArrowLeft, Mail, Clock, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';

export default function ManageParticipantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['eventDetail', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    },
  });

  const { data: participants, isLoading: isParticipantsLoading } = useQuery({
    queryKey: ['participants', id],
    queryFn: async () => {
      const response = await api.get(`/participations/event/${id}`);
      return response.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ participantId, status }: { participantId: string; status: string }) => 
      api.patch(`/participations/${participantId}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['participants', id] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  if (isEventLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{event?.title}</h1>
          <p className="text-zinc-500">Manage participant requests and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Participants</CardTitle>
                <p className="text-sm text-zinc-500 mt-1">Total: {participants?.length || 0}</p>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div> Approved
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-600"></div> Pending
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {isParticipantsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : participants && participants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <th className="pb-4 text-sm font-semibold text-zinc-500">User</th>
                      <th className="pb-4 text-sm font-semibold text-zinc-500">Status</th>
                      <th className="pb-4 text-sm font-semibold text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                    {participants.map((p: any) => (
                      <tr key={p.id}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                                {p.user.image ? (
                                    <Image src={p.user.image} alt={p.user.name} width={40} height={40} className="object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-zinc-400" />
                                )}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{p.user.name}</p>
                              <p className="text-xs text-zinc-500">{p.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                            p.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                            p.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                            p.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-zinc-800 text-white'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {p.status !== 'APPROVED' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 border-green-200 text-green-600 hover:bg-green-50"
                                onClick={() => updateStatusMutation.mutate({ participantId: p.id, status: 'APPROVED' })}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {p.status !== 'REJECTED' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => updateStatusMutation.mutate({ participantId: p.id, status: 'REJECTED' })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {p.status !== 'BANNED' && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 px-2 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                                    onClick={() => updateStatusMutation.mutate({ participantId: p.id, status: 'BANNED' })}
                                >
                                    <Ban className="h-4 w-4" />
                                </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-10 w-10 text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No participants yet for this event.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
