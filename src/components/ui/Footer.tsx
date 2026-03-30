import React from 'react';
import { Calendar, Globe, Share2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <Calendar className="h-6 w-6" />
              <span>Planora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
              The all-in-one platform for creating, managing, and joining amazing events.
              Experience seamless event management today.
            </p>
            <div className="mt-6 flex space-x-4">
               <Globe className="h-5 w-5 text-zinc-400 hover:text-zinc-900 cursor-pointer" />
               <Share2 className="h-5 w-5 text-zinc-400 hover:text-zinc-900 cursor-pointer" />
               <MessageSquare className="h-5 w-5 text-zinc-400 hover:text-zinc-900 cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/events" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">All Events</Link></li>
              <li><Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Dashboard</Link></li>
              <li><Link href="/create-event" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Create Event</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} Planora Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
