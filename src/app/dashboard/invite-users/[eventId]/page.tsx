'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UserPlus, ArrowLeft, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';

export default function InviteUsersPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<Record<string, boolean>>({});

  // Debounce the search term to avoid spamming the API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['searchUsers', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm || debouncedTerm.trim().length < 2) return { data: [] };
      const response = await api.get(`/invitations/search-users?searchTerm=${debouncedTerm}`);
      return response.data;
    },
    enabled: debouncedTerm.trim().length >= 2,
  });

  const sendInviteMutation = useMutation({
    mutationFn: (receiverId: string) => api.post('/invitations', { eventId, receiverId }),
    onSuccess: (_, variables) => {
      toast.success('Invitation sent successfully!');
      setInvitedUsers(prev => ({ ...prev, [variables]: true }));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    },
  });

  const users = usersData?.data || [];
  
  const handleInvite = (userId: string) => {
    sendInviteMutation.mutate(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Invite Users</h1>
          <p className="text-zinc-500">Search and invite people to your event.</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input 
            className="pl-10" 
            placeholder="Search users by name or email (e.g., John Doe)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-black dark:border-white border-t-transparent"></div>
            </div>
          ) : debouncedTerm.length < 2 ? (
            <div className="text-center py-12 text-zinc-500">
              <Search className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
              <p>Type at least 2 characters to search for users.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <User className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
              <p>No users found matching &quot;{debouncedTerm}&quot;.</p>
            </div>
          ) : (
            users.map((user: any) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-6 w-6 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</h3>
                    <div className="flex items-center text-sm text-zinc-500 gap-1 mt-0.5">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <Button 
                    size="sm" 
                    variant={invitedUsers[user.id] ? "secondary" : "default"}
                    className="gap-2 sm:w-auto w-full" 
                    onClick={() => handleInvite(user.id)}
                    disabled={sendInviteMutation.isPending || invitedUsers[user.id]}
                >
                  <UserPlus className="h-4 w-4" /> 
                  {invitedUsers[user.id] ? 'Invited' : 'Invite'}
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
