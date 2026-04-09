'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const token = searchParams.get('token');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const authenticate = async () => {
      if (!token) {
        toast.error('Authentication failed: Missing token');
        router.push('/login');
        return;
      }

      hasFetched.current = true;

      try {
        // Fetch user profile using the new token
        const response = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = response.data.data;
        
        // Log the user into Context
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
        
        // Push user to appropriate dashboard
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast.error('Failed to authenticate your session.');
        router.push('/login');
      }
    };

    authenticate();
  }, [token, login, router]);

  return null;
}
