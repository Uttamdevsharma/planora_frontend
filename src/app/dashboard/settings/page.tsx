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
import { User as UserIcon, Lock, Shield, Mail } from 'lucide-react';

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

export default function SettingsPage() {
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
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-zinc-500">Manage your account and profile preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <UserIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                 </div>
                 <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input 
                    label="Full Name" 
                    {...profileForm.register('name')} 
                    error={profileForm.formState.errors.name?.message} 
                  />
                  <Input 
                    label="Email Address" 
                    value={user?.email || ''} 
                    disabled 
                    description="Email address is used for secure logins."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button type="submit" isLoading={isProfileLoading}>Save Profile Updates</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                 <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <Lock className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle>Security & Password</CardTitle>
                    <CardDescription>Keep your account safe by updating your password regularly.</CardDescription>
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
                    <Button type="submit" isLoading={isPasswordLoading} variant="secondary">Update Security Password</Button>
                  </div>
               </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-zinc-900 text-white border-none shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Shield className="h-16 w-16" />
                </div>
                <CardHeader>
                    <CardTitle className="text-lg">Acccount Security</CardTitle>
                    <CardDescription className="text-zinc-400">Your account is protected by industry standard encryption.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span>Password Protection Active</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-100 dark:border-red-900/30">
                <CardHeader>
                    <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Permanent account deletion cannot be reversed. Proceed with extreme caution.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="danger" className="w-full">Delete My Account</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
