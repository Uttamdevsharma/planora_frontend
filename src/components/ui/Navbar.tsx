'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { Menu, X, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white cursor-pointer"
            >
              <Calendar className="h-6 w-6 text-black dark:text-white" />
              <span>Planora</span>
            </button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => router.push(link.href)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive(link.href)
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center gap-4 md:ml-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')}
                    className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
                  </button>
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {user.image ? (
                        <Image src={user.image} alt={user.name} width={32} height={32} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1.5">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => router.push('/register')}>
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:hover:bg-zinc-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                    router.push(link.href);
                    setIsOpen(false);
                }}
                className={`block w-full text-left rounded-md px-3 py-2 text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
            {user && (
                  <button
                  onClick={() => {
                      router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
                      setIsOpen(false);
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
                </button>
            )}
          </div>
          <div className="border-t border-zinc-200 pb-3 pt-4 dark:border-zinc-800">
            {user ? (
              <div className="px-5 flex flex-col gap-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                     {user.image ? (
                        <Image src={user.image} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-500">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-zinc-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-zinc-500 mt-1">
                      {user.email}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
                   <LogOut className="h-4 w-4" />
                   Logout
                </Button>
              </div>
            ) : (
              <div className="px-5 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => {
                    router.push('/login');
                    setIsOpen(false);
                }}>
                  Login
                </Button>
                <Button className="w-full" onClick={() => {
                    router.push('/register');
                    setIsOpen(false);
                }}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
