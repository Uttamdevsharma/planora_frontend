'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UserPlus, ArrowLeft, Mail, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Query for suggested users (when not searching)
  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['suggestedUsers', eventId],
    queryFn: async () => {
      const response = await api.get(`/invitations/search-users?searchTerm=&eventId=${eventId}`);
      return response.data;
    },
  });

  // Query for search results
  const { data: searchData, isLoading: isLoadingSearch } = useQuery({
    queryKey: ['searchUsers', debouncedTerm, eventId],
    queryFn: async () => {
      if (!debouncedTerm || debouncedTerm.trim().length < 2) return { data: [] };
      const response = await api.get(`/invitations/search-users?searchTerm=${debouncedTerm}&eventId=${eventId}`);
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

  const suggestedUsers = suggestionsData?.data || [];
  const searchResults = searchData?.data || [];
  
  const isSearching = debouncedTerm.length >= 2;
  const displayUsers = isSearching ? searchResults : suggestedUsers;
  const isLoading = isSearching ? isLoadingSearch : isLoadingSuggestions;

  const handleInvite = (userId: string) => {
    sendInviteMutation.mutate(userId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-95">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invite Users</h1>
          <p className="text-zinc-500">Find and invite connections to your event.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-zinc-900 group-focus-within:dark:text-zinc-100 text-zinc-400">
            <Search className="h-5 w-5" />
          </div>
          <Input 
            className="pl-12 h-14 text-lg rounded-2xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-sm" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-sm text-zinc-500 ml-2">
          Suggested users are shown below. You can also search for specific users.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                {isSearching ? (
                   <>Search Results <span className="text-sm font-normal text-zinc-500">for &quot;{debouncedTerm}&quot;</span></>
                ) : (
                    <><Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Suggested Users</>
                )}
            </h2>
            {!isSearching && suggestedUsers.length > 0 && (
                <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Top Recommendations</span>
            )}
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent shadow-lg"></div>
              <p className="text-zinc-500 font-medium animate-pulse">Finding users...</p>
            </motion.div>
          ) : displayUsers.length === 0 ? (
            <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-24 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800"
            >
              <div className="bg-white dark:bg-zinc-900 w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-zinc-100 dark:border-zinc-800">
                <Search className="h-8 w-8 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">No users found</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                {isSearching 
                  ? `We couldn't find anyone matching "${debouncedTerm}". Try a different name or email.`
                  : "We don't have any suggestions right now. Try searching for a specific user."}
              </p>
            </motion.div>
          ) : (
            displayUsers.map((user: any, index: number) => (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="relative h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-zinc-400">{user.name.charAt(0)}</span>
                        </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {user.name}
                        {index < 3 && !isSearching && (
                            <span className="bg-zinc-900 dark:bg-zinc-100 text-[10px] text-white dark:text-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                        )}
                    </h3>
                    <div className="flex items-center text-sm text-zinc-500 gap-2 mt-1">
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <Mail className="h-3 w-3" />
                      </div>
                      <span className="truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                    </div>
                  </div>
                </div>
                <Button 
                    size="lg" 
                    variant={invitedUsers[user.id] ? "secondary" : "default"}
                    className={`gap-3 sm:w-auto w-full rounded-xl font-bold transition-all active:scale-95 ${
                        invitedUsers[user.id] 
                        ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                        : 'shadow-lg shadow-zinc-200 dark:shadow-none'
                    }`} 
                    onClick={() => handleInvite(user.id)}
                    disabled={sendInviteMutation.isPending || invitedUsers[user.id]}
                >
                  {invitedUsers[user.id] ? (
                    <>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        Invited
                    </>
                  ) : (
                    <>
                        <UserPlus className="h-5 w-5" /> 
                        Invite
                    </>
                  )}
                </Button>
              </motion.div>
            ))
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

