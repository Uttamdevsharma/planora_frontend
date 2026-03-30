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
import { User as UserIcon, Camera, Mail, Shield } from 'lucide-react';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.image || null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await api.patch('/users/me', formData);

      const updatedUserData = response.data.data;
      updateUser(updatedUserData);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
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
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and how others see you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Profile" width={96} height={96} className="object-cover h-full w-full" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-zinc-400" />
                        )}
                    </div>
                    <label 
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                    >
                        <Camera className="h-6 w-6" />
                    </label>
                    <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{user?.name}</h4>
                    <p className="text-sm text-zinc-500">{user?.role} Account</p>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                        Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Full Name" {...register('name')} error={errors.name?.message} />
                  <Input label="Email Address" {...register('email')} error={errors.email?.message} disabled />
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button type="submit" isLoading={isLoading}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-zinc-400" />
                        <div>
                            <p className="text-sm font-bold">Password</p>
                            <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-zinc-400" />
                        <div>
                            <p className="text-sm font-bold">Email Notifications</p>
                            <p className="text-xs text-zinc-500">Receive updates about your events</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-zinc-900 text-white">
                <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                    <CardDescription className="text-zinc-400">Our support team is available 24/7 to help you with any issues.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" className="w-full">Contact Support</Button>
                </CardContent>
            </Card>

            <Card className="border-red-100 dark:border-red-900/30">
                <CardHeader>
                    <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Once you delete your account, there is no going back. Please be certain.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="danger" className="w-full">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
