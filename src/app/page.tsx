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
import { Calendar, ArrowRight, Star, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// New Section Components
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CoreFeatures } from '@/components/sections/CoreFeatures';
import { PlatformStats } from '@/components/sections/PlatformStats';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';

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
        const { scrollLeft } = sliderRef.current;
        const firstChild = sliderRef.current.firstElementChild as HTMLElement;
        if (firstChild) {
            const cardWidth = firstChild.offsetWidth;
            const gap = 24;
            const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
            sliderRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
        }
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
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
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                  <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 uppercase tracking-wider">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Featured Event
                  </motion.div>
                  <motion.h1 
                    variants={itemVariants} 
                    className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl"
                  >
                    {featuredEvent.title}
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants} 
                    className="max-w-xl text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
                  >
                    {featuredEvent.description}
                  </motion.p>
                  <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="gap-2 px-10 py-7 text-lg rounded-full shadow-lg shadow-black/20 dark:shadow-white/5 transition-transform hover:scale-105 active:scale-95" 
                      onClick={() => router.push(`/events/${featuredEvent.id}`)}
                    >
                      Join Event <ArrowRight className="h-6 w-6" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-10 py-7 text-lg rounded-full border-2 transition-transform hover:scale-105 active:scale-95" 
                      onClick={() => router.push('/events')}
                    >
                      Browse More
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className="relative aspect-video overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
                >
                  {featuredEvent.imageUrl ? (
                    <Image
                      src={featuredEvent.imageUrl}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
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
              <div className="text-center py-20">
                <h1 className="text-5xl font-black mb-6">No events found</h1>
                <p className="text-zinc-500 text-xl mb-10 max-w-2xl mx-auto">Be the first to create an amazing event and start growing your community today!</p>
                <Button size="lg" className="gap-2 px-12 py-8 rounded-full" onClick={() => router.push('/dashboard/my-events')}>
                  <Plus className="h-6 w-6" /> Create My First Event
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* 2. Upcoming Events Slider SECTION */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-24 bg-zinc-50 dark:bg-zinc-950/50 overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">Upcoming Events</h2>
                <p className="text-xl text-zinc-500 max-w-2xl">The hottest events happening on Planora right now. Don't miss out on these trending experiences.</p>
              </div>
              <div className="flex gap-4">
                  <button 
                      onClick={() => scrollSlider('left')}
                      className="p-4 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all active:scale-95"
                  >
                      <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                      onClick={() => scrollSlider('right')}
                      className="p-4 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all active:scale-95"
                  >
                      <ChevronRight className="h-6 w-6" />
                  </button>
              </div>
            </div>

            <div className="relative">
              <div 
                  ref={sliderRef}
                  className="flex gap-8 items-stretch overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {isUpcomingLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="min-w-[340px] sm:min-w-[420px] snap-start">
                      <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
                      <Skeleton className="mt-6 h-8 w-3/4" />
                      <Skeleton className="mt-3 h-5 w-1/2" />
                    </div>
                  ))
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <motion.div 
                        key={event.id} 
                        whileHover={{ y: -8 }}
                        className="w-[340px] sm:w-[420px] flex-shrink-0 snap-start h-full"
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold text-xl">
                      New public events will appear here soon. Stay tuned!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3. Categories Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                 <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-10">Discover by Category</h2>
               </motion.div>
               
               <div className="flex flex-wrap gap-3">
                 {categories.map((cat) => (
                   <button
                     key={cat.id}
                     onClick={() => setFilter(cat.id)}
                     className={`rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
                       filter === cat.id
                         ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/10'
                         : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                     }`}
                   >
                     {cat.name}
                   </button>
                 ))}
               </div>
            </div>

            {isCategoryLoading ? (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-5">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-7 w-3/4 rounded-lg" />
                    <Skeleton className="h-5 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : categoryEvents && categoryEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {categoryEvents.map((event: any, index: number) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <Search className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
                  <h3 className="text-2xl font-black mb-3">No matching events</h3>
                  <p className="text-zinc-500 text-lg">Check back later or explore one of our other popular categories!</p>
              </div>
            )}
            
            <div className="mt-20 text-center">
                 <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-12 py-8 rounded-full font-black border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 transition-all hover:scale-105"
                    onClick={() => router.push('/events')}
                 >
                    View All Platform Events
                 </Button>
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Core Features */}
        <CoreFeatures />

        {/* 6. Platform Statistics */}
        <PlatformStats />

        {/* 7. Testimonials */}
        <Testimonials />

        {/* 8. FAQ */}
        <FAQ />

        {/* 9. CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="pb-24 pt-12 px-4 sm:px-6 flex justify-center"
        >
            <div className="w-full max-w-5xl rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-16 sm:py-20 text-center relative overflow-hidden shadow-sm dark:shadow-none">
                {/* Subtle Glow Effects for Premium Feel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] pointer-events-none rounded-full" />
                
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                  <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]">
                    Ready to host your own <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      Masterpiece?
                    </span>
                  </h2>
                  <p className="mx-auto max-w-xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Join thousands of organizers using Planora to create unforgettable experiences. 
                      From private gatherings to global conferences, we provide the tools you need to succeed.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto px-10 py-7 rounded-full text-lg font-bold shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100" 
                        onClick={() => router.push('/dashboard/my-events')}
                      >
                          Start Creating Free
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:w-auto px-10 py-7 rounded-full text-lg font-bold border-2 border-zinc-200 dark:border-zinc-800 transition-transform hover:scale-105 active:scale-95 bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:text-white" 
                        onClick={() => router.push('/events')}
                      >
                          Explore Events
                      </Button>
                  </div>
                </div>
            </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
