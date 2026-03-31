'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black overflow-hidden">
      <Navbar isDashboard onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-[calc(100vh-64px)] overflow-y-auto w-64">
           <AdminSidebar />
        </div>

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
                    <span className="font-bold">Navigation</span>
                    <button 
                       onClick={() => setIsSidebarOpen(false)}
                       className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <AdminSidebar onLinkClick={() => setIsSidebarOpen(false)} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-h-[calc(100vh-64px)] relative">
           <div className="mx-auto max-w-7xl">
            {children}
           </div>
        </main>
      </div>
    </div>
  );
}
