'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, MapPin, CreditCard, CheckCircle, XCircle, Mail, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function InvitationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const { data: invitationsData, isLoading } = useQuery({
    queryKey: ['invitationsList'],
    queryFn: async () => {
      const response = await api.get('/invitations');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) => 
      api.patch(`/invitations/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Invitation updated successfully');
      queryClient.invalidateQueries({ queryKey: ['invitationsList'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update invitation'),
  });

  const payAndAcceptMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/invitations/${id}/pay-accept`),
    onSuccess: (res) => {
      const { url } = res.data.data;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Failed to get payment URL');
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to process payment'),
  });

  const handleAccept = (invitation: any) => {
    if (invitation.event.fee > 0) {
      payAndAcceptMutation.mutate(invitation.id);
    } else {
      updateStatusMutation.mutate({ id: invitation.id, status: 'ACCEPTED' });
    }
  };

  const handleDecline = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'DECLINED' });
  };

  const allInvitations = invitationsData?.data || [];
  
  const receivedInvitations = allInvitations.filter((inv: any) => inv.receiverId === user?.id && inv.status === 'PENDING');
  const sentInvitations = allInvitations.filter((inv: any) => inv.senderId === user?.id && inv.status === 'PENDING');
  
  const displayedInvitations = activeTab === 'received' ? receivedInvitations : sentInvitations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invitations</h1>
        <p className="text-zinc-500">Manage your event invitations.</p>
      </div>

      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800">
        <button 
          className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'received' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          onClick={() => setActiveTab('received')}
        >
          Received
          {activeTab === 'received' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-t-full"></span>
          )}
        </button>
        <button 
          className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'sent' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent
          {activeTab === 'sent' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : displayedInvitations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">
            <Mail className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
            <p>No {activeTab} invitations found.</p>
          </div>
        ) : (
          displayedInvitations.map((invitation: any) => (
            <Card key={invitation.id} className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      invitation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      invitation.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {invitation.status}
                    </span>
                    {invitation.event.fee > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> Paid (${invitation.event.fee})
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{invitation.event.title}</h3>
                  <p className="text-sm text-zinc-500">
                    {activeTab === 'received' ? (
                        <>Invited by <strong className="text-zinc-900 dark:text-zinc-100">{invitation.sender.name}</strong> ({invitation.sender.email})</>
                    ) : (
                        <>Sent to <strong className="text-zinc-900 dark:text-zinc-100">{invitation.receiver.name}</strong> ({invitation.receiver.email})</>
                    )}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(invitation.event.date), 'PP')} at {invitation.event.time}
                      </div>
                      {invitation.event.venue && (
                          <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {invitation.event.venue}
                          </div>
                      )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => router.push('/events/' + invitation.event.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View Event
                  </Button>

                  {activeTab === 'received' && invitation.status === 'PENDING' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200"
                        onClick={() => handleDecline(invitation.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Decline
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 sm:flex-none bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        onClick={() => handleAccept(invitation)}
                        disabled={updateStatusMutation.isPending || payAndAcceptMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> 
                        {invitation.event.fee > 0 ? 'Pay & Accept' : 'Accept'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
