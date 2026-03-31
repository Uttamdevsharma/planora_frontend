'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, Users, 
  Wallet, Mail, Settings, ChevronRight,
  LogOut, Plus, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent dark:border-white"></div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/dashboard/my-events', icon: Calendar },
    { name: 'Participations', href: '/dashboard/participations', icon: Users },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
    { name: 'Invitations', href: '/dashboard/invitations', icon: Mail },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black overflow-hidden">
      <Navbar isDashboard onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black lg:block">
          <div className="flex h-full flex-col p-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Menu</p>
              <nav className="mt-4 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <button
                      key={link.name}
                      onClick={() => router.push(link.href)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
                    <LogOut className="h-4 w-4" /> Sign out
                </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay & Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm lg:hidden mt-16"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-[60] w-72 bg-white dark:bg-black lg:hidden shadow-2xl mt-16"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="font-bold">Dashboard Menu</span>
                    <button 
                       onClick={() => setIsSidebarOpen(false)}
                       className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <nav className="space-y-1">
                      {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                          <button
                            key={link.name}
                            onClick={() => {
                                router.push(link.href);
                                setIsSidebarOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              {link.name}
                            </div>
                            {isActive && <ChevronRight className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </nav>
                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
                            <LogOut className="h-4 w-4" /> Sign out
                        </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-h-[calc(100vh-64px)] relative">
           <div className="mx-auto max-w-5xl">
            {children}
           </div>
        </main>
      </div>
    </div>
  );
}
