'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  User as UserIcon, Mail, Trash2, 
  Shield, UserCheck, Search, MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    },
  });

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) {
       toast.error("You cannot delete your own admin account!");
       return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone and will remove all their data.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const users = usersData || [];
  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500">Monitor and manage all platform accounts.</p>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm transition-focus focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-black"
            placeholder="Search by name or email..."
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
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">User</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Email</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Role</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-xs">Joined</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          {u.image ? (
                             /* eslint-disable-next-line @next/next/no-img-element */
                             <img src={u.image} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                             <UserIcon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 text-zinc-500">
                       <Mail className="h-3 w-3" />
                       {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'ADMIN' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' 
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                         {u.role === 'ADMIN' ? <Shield className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                         {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600 border-red-100 hover:bg-red-50 dark:hover:bg-red-950/30 group"
                          onClick={() => handleDelete(u.id)}
                          disabled={deleteUserMutation.isPending || u.id === currentUser?.id}
                        >
                          <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-between items-center text-sm text-zinc-500">
         <p>Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> platform users</p>
         <div className="flex gap-2">
             <Button variant="outline" size="sm" disabled>Previous</Button>
             <Button variant="outline" size="sm" disabled>Next</Button>
         </div>
      </div>
    </div>
  );
}
