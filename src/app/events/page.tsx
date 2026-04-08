'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EventCard, Event } from '@/components/ui/EventCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    isPublic: 'all',
    feeType: 'all',
    type: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', searchTerm, filters],
    queryFn: async () => {
      let url = `/events?searchTerm=${searchTerm}`;
      if (filters.isPublic !== 'all') url += `&isPublic=${filters.isPublic}`;
      if (filters.feeType !== 'all') url += `&feeType=${filters.feeType}`;
      if (filters.type !== 'all') url += `&type=${filters.type}`;
      
      const response = await api.get(url);
      return response.data;
    },
  });

  const events = eventsData?.data?.data || [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      isPublic: 'all',
      feeType: 'all',
      type: 'all',
    });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length + (searchTerm ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">Explore Events</h1>
            <p className="mt-4 text-lg text-zinc-500">Find the best events happening around you</p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by title, description or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant={showFilters ? 'primary' : 'outline'} 
                className="gap-2 shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Visibility</label>
                      <select
                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-800"
                        value={filters.isPublic}
                        onChange={(e) => handleFilterChange('isPublic', e.target.value)}
                      >
                        <option value="all">All Visibility</option>
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fee</label>
                      <select
                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-800"
                        value={filters.feeType}
                        onChange={(e) => handleFilterChange('feeType', e.target.value)}
                      >
                        <option value="all">All Fees</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <select
                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-800"
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                      >
                        <option value="all">All Formats</option>
                        <option value="ONLINE">Online</option>
                        <option value="OFFLINE">Offline</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-zinc-500 gap-1">
                            <X className="h-4 w-4" /> Clear All
                        </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4">
              {events.map((event: Event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">No events found</h3>
              <p className="mt-2 text-zinc-500 max-w-sm">We couldn&apos;t find any events matching your criteria. Try adjusting your filters or search term.</p>
              <Button className="mt-8" onClick={clearFilters}>View All Events</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
