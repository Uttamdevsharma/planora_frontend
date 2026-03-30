'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Calendar, MapPin, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  imageUrl?: string;
  fee: number;
  type: 'ONLINE' | 'OFFLINE';
  isPublic: boolean;
  creator: {
    name: string;
  };
}

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col group">
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Calendar className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-2">
           <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
             event.fee === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
           }`}>
             {event.fee === 0 ? 'Free' : `$${event.fee}`}
           </span>
           <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
             event.isPublic ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
           }`}>
             {event.isPublic ? 'Public' : 'Private'}
           </span>
        </div>
      </div>
      <CardContent className="p-5 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(event.date), 'PPP')}
        </div>
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-zinc-900 dark:text-white">
          {event.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {event.description}
        </p>
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <User className="h-4 w-4" />
                <span>{event.creator.name}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push(`/events/${event.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
