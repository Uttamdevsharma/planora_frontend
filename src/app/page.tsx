'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { EventCard, Event } from '@/components/ui/EventCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Star, Plus, Search, ChevronLeft, ChevronRight, Video, MapPin, Tag, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState('PUBLIC_FREE');
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const { data: featuredEvent, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredEvent'],
    queryFn: async () => {
      const response = await api.get('/events?isFeatured=true&limit=1');
      if (response.data.data?.data && response.data.data.data.length > 0) {
          return response.data.data.data[0] as Event;
      }
      
      const latestResponse = await api.get('/events?limit=1&isPublic=true');
      return (latestResponse.data.data?.data?.[0] || null) as Event | null;
    },
  });

  const { data: upcomingEvents, isLoading: isUpcomingLoading } = useQuery({
    queryKey: ['upcomingEventsSlider'],
    queryFn: async () => {
      const response = await api.get('/events?limit=9&isPublic=true');
      return response.data?.data?.data || [];
    },
  });

  const { data: categoryEventsData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categoryEvents', filter],
    queryFn: async () => {
      let url = '/events?limit=8';
      
      if (filter === 'PUBLIC_FREE') {
          url += '&isPublic=true&feeType=free';
      } else if (filter === 'PUBLIC_PAID') {
          url += '&isPublic=true&feeType=paid';
      } else if (filter === 'PRIVATE_FREE') {
          url += '&isPublic=false&feeType=free';
      } else if (filter === 'PRIVATE_PAID') {
          url += '&isPublic=false&feeType=paid';
      }
      
      const response = await api.get(url);
      return response.data;
    },
  });

  const categoryEvents = categoryEventsData?.data?.data || [];

  const categories = [
    { id: 'PUBLIC_FREE', name: 'Public Free' },
    { id: 'PUBLIC_PAID', name: 'Public Paid' },
    { id: 'PRIVATE_FREE', name: 'Private Free' },
    { id: 'PRIVATE_PAID', name: 'Private Paid' },
  ];

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
        const { scrollLeft, clientWidth } = sliderRef.current;
        const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
        sliderRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isFeaturedLoading ? (
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                  </div>
                </div>
                <Skeleton className="aspect-video w-full rounded-2xl" />
              </div>
            ) : featuredEvent ? (
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Featured Event
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
                    {featuredEvent.title}
                  </h1>
                  <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                    {featuredEvent.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="gap-2" onClick={() => router.push(`/events/${featuredEvent.id}`)}>
                      Join Event <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => router.push('/events')}>
                      Browse More
                    </Button>
                  </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl"
                >
                  {featuredEvent.imageUrl ? (
                    <Image
                      src={featuredEvent.imageUrl}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Calendar className="h-20 w-20 text-zinc-300 dark:text-zinc-700" />
                    </div>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold mb-4">No events found</h1>
                <p className="text-zinc-500 mb-8">Be the first to create an amazing event!</p>
                <Button size="lg" className="gap-2" onClick={() => router.push('/dashboard/my-events')}>
                  <Plus className="h-5 w-5" /> Create Event
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Events Slider SECTION */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">Upcoming Events</h2>
              <p className="mt-4 text-lg text-zinc-500">The hottest events happening on Planora right now.</p>
            </div>

            <div className="relative group px-4 sm:px-0">
              <button 
                  onClick={() => scrollSlider('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md shadow-xl hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 transition-all hover:scale-110 hidden sm:flex items-center justify-center -ml-4 lg:-ml-6"
              >
                  <ChevronLeft className="h-6 w-6" />
              </button>

              <div 
                  ref={sliderRef}
                  className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {isUpcomingLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="min-w-[320px] sm:min-w-[400px] snap-start">
                      <Skeleton className="aspect-video w-full rounded-3xl" />
                      <Skeleton className="mt-4 h-6 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-1/2" />
                    </div>
                  ))
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <div key={event.id} className="min-w-[320px] sm:min-w-[400px] snap-start h-full">
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-20 text-zinc-400 font-medium">
                      New public events will appear here soon.
                  </div>
                )}
              </div>

              <button 
                  onClick={() => scrollSlider('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md shadow-xl hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 transition-all hover:scale-110 hidden sm:flex items-center justify-center -mr-4 lg:-mr-6"
              >
                  <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
               <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-8">Discover by Category</h2>
               <div className="flex flex-wrap gap-2">
                 {categories.map((cat) => (
                   <button
                     key={cat.id}
                     onClick={() => setFilter(cat.id)}
                     className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                       filter === cat.id
                         ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                         : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                     }`}
                   >
                     {cat.name}
                   </button>
                 ))}
               </div>
            </div>

            {isCategoryLoading ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : categoryEvents && categoryEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {categoryEvents.map((event: any) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <Search className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results matching this category</h3>
                  <p className="text-zinc-500">Check back later or explore one of our other categories!</p>
              </div>
            )}
            
            <div className="mt-16 text-center">
                 <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-10 py-6 rounded-full font-bold border-2"
                    onClick={() => router.push('/events')}
                 >
                    View All Platform Events
                 </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
            <div className="mx-auto max-w-5xl rounded-3xl bg-black px-8 py-16 text-center text-white dark:bg-white dark:text-black overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                     <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white dark:bg-black rounded-full blur-[100px]" />
                     <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white dark:bg-black rounded-full blur-[100px]" />
                </div>
                <h2 className="relative text-3xl font-bold sm:text-5xl">Ready to host your own event?</h2>
                <p className="relative mx-auto mt-6 max-w-2xl text-lg opacity-80">
                    Join thousands of organizers using Planora to create unforgettable experiences. 
                    From private gatherings to public conferences, we have you covered.
                </p>
                <div className="relative mt-10 flex flex-wrap justify-center gap-4">
                    <Button size="lg" variant="secondary" className="px-10" onClick={() => router.push('/dashboard/my-events')}>
                        Create Event
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-black dark:text-black dark:hover:bg-black/10 px-10" onClick={() => router.push('/events')}>
                        Join Events
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
