'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  Calendar, MapPin, User, Tag, Clock, Globe, 
  Lock, CheckCircle2, AlertCircle, Share2, 
  MessageSquare, Star, Trash2, Edit2, ShieldCheck, MapPinned
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isEditingReview, setIsEditingReview] = useState<string | null>(null);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    },
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      return api.post('/participations/join', { eventId: id });
    },
    onSuccess: (res) => {
      toast.success(res.data.message || 'Participation request sent!');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to join event');
    },
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/payments/checkout', { eventId: id });
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      if (isEditingReview) {
        return api.patch(`/reviews/${isEditingReview}`, reviewData);
      }
      return api.post('/reviews', { ...reviewData, eventId: id });
    },
    onSuccess: () => {
      toast.success(isEditingReview ? 'Review updated!' : 'Review added!');
      setReviewText('');
      setRating(5);
      setIsEditingReview(null);
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-4 py-12 space-y-8">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event not found</h2>
        <Button onClick={() => router.push('/events')}>Back to Events</Button>
    </div>
  );

  const isOwner = user?.id === event.creatorId;
  const isApproved = event.participationStatus === 'APPROVED';
  const isPending = event.participationStatus === 'PENDING';
  const isRejected = event.participationStatus === 'REJECTED';
  const isBanned = event.participationStatus === 'BANNED';

  const renderJoinButton = () => {
    if (!user) return <Button size="lg" className="w-full" onClick={() => router.push('/login')}>Login to Join</Button>;
    if (isOwner) return <Button size="lg" className="w-full" onClick={() => router.push('/dashboard/my-events')}>Manage Event</Button>;
    
    if (isApproved) return (
      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-3 border border-green-100 dark:border-green-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="font-medium text-sm">You are an approved participant!</span>
      </div>
    );

    if (isPending) return (
      <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-4 rounded-xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-700">
        <Clock className="h-5 w-5 shrink-0" />
        <span className="font-medium text-sm">Approval pending...</span>
      </div>
    );

    if (isRejected) return (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium text-sm">Your request was rejected.</span>
        </div>
    );

    if (isBanned) return (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium text-sm">You are banned from this event.</span>
        </div>
    );

    if (event.fee > 0) {
        return (
            <Button size="lg" className="w-full gap-2" isLoading={payMutation.isPending} onClick={() => payMutation.mutate()}>
               Pay ${event.fee} & Join
            </Button>
        );
    }

    return (
        <Button size="lg" className="w-full" isLoading={joinMutation.isPending} onClick={() => joinMutation.mutate()}>
            {event.isPublic ? 'Join Now' : 'Request to Join'}
        </Button>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           {/* Banner */}
           <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
             {event.imageUrl ? (
               <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
             ) : (
               <div className="flex h-full w-full flex-col items-center justify-center">
                 <Calendar className="h-20 w-20 text-zinc-300 dark:text-zinc-700 mb-4" />
                 <span className="text-zinc-400 font-medium">Event Preview Image</span>
               </div>
             )}
             <div className="absolute bottom-6 right-6">
                <Button variant="secondary" size="sm" className="gap-2 backdrop-blur-md bg-white/70">
                    <Share2 className="h-4 w-4" /> Share
                </Button>
             </div>
           </div>

           <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
             {/* Main Info */}
             <div className="lg:col-span-2 space-y-10">
                <div>
                   <div className="flex flex-wrap gap-2 mb-4">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                            {event.type}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            event.isPublic ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                            {event.isPublic ? 'Public Event' : 'Private Event'}
                        </span>
                   </div>
                   <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">{event.title}</h1>
                   <div className="mt-6 flex flex-wrap gap-6 text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                         <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                            {event.creator.image ? (
                                <Image src={event.creator.image} alt={event.creator.name} width={40} height={40} className="rounded-full h-full w-full object-cover" />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                         </div>
                         <div>
                            <p className="text-xs font-medium text-zinc-500">Organized by</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{event.creator.name}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <Calendar className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-xs font-medium text-zinc-500">Date & Time</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{format(new Date(event.date), 'PPP')} at {event.time}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <h2 className="text-2xl font-bold mb-4">Description</h2>
                   <div className="prose prose-zinc dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {event.description}
                      </p>
                   </div>
                </div>

                {/* Meeting Link / Location */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    {event.type === 'ONLINE' ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Online Meeting</h3>
                                    <p className="text-sm text-zinc-500">Join via the exclusive link below</p>
                                </div>
                            </div>
                            {event.meetingLink ? (
                                <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
                                    <Button className="gap-2">Join Meeting <Globe className="h-4 w-4" /></Button>
                                </a>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                    <Lock className="h-4 w-4" /> Link will be available after approval
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                    <MapPinned className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">In-Person Event</h3>
                                    <p className="text-sm text-zinc-500">{event.venue}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="gap-2" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`, '_blank')}>
                                Open in Maps <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                           <MessageSquare className="h-6 w-6" /> Reviews 
                           <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full ml-2">
                             {event.reviews?.length || 0}
                           </span>
                        </h2>
                    </div>

                    {user && !isOwner && (isApproved || isOwner) && (
                        <div className="space-y-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                            <h3 className="font-bold">{isEditingReview ? 'Edit your review' : 'Share your experience'}</h3>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button 
                                        key={s} 
                                        onClick={() => setRating(s)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star className={`h-6 w-6 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full min-h-[100px] rounded-xl border border-zinc-200 bg-transparent p-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800"
                                placeholder="What did you think about the event?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                {isEditingReview && <Button variant="ghost" onClick={() => { setIsEditingReview(null); setReviewText(''); setRating(5); }}>Cancel</Button>}
                                <Button 
                                    onClick={() => addReviewMutation.mutate({ rating, comment: reviewText })}
                                    isLoading={addReviewMutation.isPending}
                                    disabled={!reviewText.trim()}
                                >
                                    {isEditingReview ? 'Update Review' : 'Post Review'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {event.reviews?.length > 0 ? (
                            event.reviews.map((review: any) => (
                                <div key={review.id} className="flex gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {review.user.image ? (
                                            <Image src={review.user.image} alt={review.user.name} width={40} height={40} className="object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold">{review.user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold">{review.user.name}</h4>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs font-bold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-zinc-500 mb-2">{format(new Date(review.createdAt), 'PP')}</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{review.comment}</p>
                                        
                                        {user?.id === review.userId && (
                                            <div className="flex gap-3 pt-2">
                                                <button 
                                                    onClick={() => {
                                                        setIsEditingReview(review.id);
                                                        setReviewText(review.comment);
                                                        setRating(review.rating);
                                                    }}
                                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-black dark:hover:text-white"
                                                >
                                                    <Edit2 className="h-3 w-3" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => deleteReviewMutation.mutate(review.id)}
                                                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                <MessageSquare className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                                <p className="text-sm text-zinc-500">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>

             {/* Sidebar Actions */}
             <div className="space-y-6">
                <Card className="sticky top-24 overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-xl">
                    <CardHeader className="bg-zinc-50 dark:bg-zinc-950 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl">Event Ticket</CardTitle>
                            <Tag className="h-5 w-5 text-zinc-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-end justify-between">
                            <span className="text-zinc-500 text-sm font-medium">Price</span>
                            <span className="text-3xl font-black text-zinc-900 dark:text-white">
                                {event.fee === 0 ? 'FREE' : `$${event.fee}`}
                            </span>
                        </div>

                        <div className="space-y-4 py-4 border-y border-zinc-100 dark:border-zinc-800">
                             <div className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Access to all sessions</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Networking opportunities</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-zinc-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>Participants: {event._count?.participants || 0}</span>
                             </div>
                        </div>

                        {renderJoinButton()}
                    </CardContent>
                </Card>

                {isOwner && (
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-2">
                             <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Creator Controls
                             </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push(`/dashboard/my-events/${event.id}`)}>
                                <User className="h-4 w-4" /> Manage Participants
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Edit2 className="h-4 w-4" /> Edit Event
                            </Button>
                        </CardContent>
                    </Card>
                )}
             </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
