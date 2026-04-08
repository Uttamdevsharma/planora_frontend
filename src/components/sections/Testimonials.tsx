'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    content: 'Planora transformed how we manage our annual tech conference. The automation saved us hours of manual work every day.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Workshop Host',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    content: 'The ticketing process is seamless. My attendees often compliment how easy it is to join my photography workshops.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Community Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    content: 'Social features and networking opportunities are top-notch. It really helps build a loyal community around our events.',
    rating: 4,
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-6 uppercase tracking-widest"
          >
            Success Stories
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black text-zinc-900 dark:text-white sm:text-6xl"
          >
            What People Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto"
          >
            Join the community of organizers and attendees who are already experiencing the future of events.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative min-h-[480px] md:min-h-[400px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 },
                }}
                className="w-full bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-10 md:gap-16"
              >
                <div className="relative shrink-0">
                  <div className="relative h-32 w-32 md:h-48 md:w-48 rounded-[2.5rem] overflow-hidden rotate-3 shadow-2xl transition-transform hover:rotate-0 duration-500">
                    <Image 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl">
                    <Quote className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-6 w-6 ${i < testimonials[currentIndex].rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200 dark:text-zinc-700'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-xl md:text-3xl font-medium text-zinc-800 dark:text-zinc-100 leading-relaxed mb-8">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div>
                    <h4 className="text-2xl font-black text-zinc-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls - Hidden on very small screens, visible on md+ */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 md:-px-12 lg:-mx-20 z-20 pointer-events-none">
              <button
                onClick={prev}
                className="p-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white pointer-events-auto hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110 shadow-xl"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="p-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white pointer-events-auto hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110 shadow-xl"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-3 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-blue-600' : 'w-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
