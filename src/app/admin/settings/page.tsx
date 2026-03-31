'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Shield, Lock, User as UserIcon } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsProfileLoading(true);
    try {
      const response = await api.patch('/users/me', data);
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      await api.post('/users/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-zinc-500">Manage your administrative profile and security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public-facing name.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Input 
                label="Full Name" 
                {...profileForm.register('name')} 
                error={profileForm.formState.errors.name?.message} 
              />
              <Input 
                label="Email Address" 
                value={user?.email || ''} 
                disabled 
                description="Email cannot be changed."
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isProfileLoading}>Update Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Password Security</CardTitle>
                <CardDescription>Update your administrative password.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input 
                label="Old Password" 
                type="password" 
                placeholder="••••••••"
                {...passwordForm.register('oldPassword')} 
                error={passwordForm.formState.errors.oldPassword?.message} 
              />
              <Input 
                label="New Password" 
                type="password" 
                placeholder="••••••••"
                {...passwordForm.register('newPassword')} 
                error={passwordForm.formState.errors.newPassword?.message} 
              />
              <Input 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••"
                {...passwordForm.register('confirmPassword')} 
                error={passwordForm.formState.errors.confirmPassword?.message} 
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isPasswordLoading} variant="secondary">Change Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/20 dark:bg-indigo-900/5">
        <CardContent className="flex items-center gap-4 py-4">
          <Shield className="h-6 w-6 text-indigo-600" />
          <div className="text-sm">
             <p className="font-bold text-indigo-900 dark:text-indigo-400">Administrative Account</p>
             <p className="text-indigo-700 dark:text-indigo-500">You are logged in with higher privileges. Always keep your password secure.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
