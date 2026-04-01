'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Plus, Search, Edit2, Trash2, 
    MoreVertical, ExternalLink, Calendar,
    MapPin, Users, Filter, X, Upload, Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const eventSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  date: z.string(),
  time: z.string(),
  venue: z.string().optional(),
  meetingLink: z.string().optional(),
  type: z.enum(['ONLINE', 'OFFLINE']),
  isPublic: z.boolean(),
  fee: z.coerce.number().min(0),
  imageUrl: z.string().optional(),
}).refine((data) => {
  if (data.type === 'OFFLINE' && (!data.venue || data.venue.length < 3)) {
    return false;
  }
  return true;
}, {
  message: "Venue is required for offline events",
  path: ["venue"]
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function MyEventsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['myEventsList', user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      const response = await api.get(`/events?creatorId=${user.id}`); 
      return response.data;
    },
    enabled: !!user,
  });

  const events = eventsData?.data?.data || [];

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
        type: 'OFFLINE',
        isPublic: true,
        fee: 0
    }
  });

  const eventType = watch('type');

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['myEventsList'] });
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create event'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => api.patch(`/events/${editingEvent.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['myEventsList'] });
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries({ queryKey: ['myEventsList'] });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingEvent(null);
      setBannerFile(null);
      setPreviewUrl(null);
      setIsPaid(false);
      reset();
  };

  const onSubmit = (data: EventFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('date', data.date);
    formData.append('time', data.time);
    formData.append('type', data.type);
    formData.append('isPublic', String(data.isPublic));
    formData.append('fee', String(isPaid ? data.fee : 0));
    
    if (data.type === 'OFFLINE') {
        formData.append('venue', data.venue || '');
    } else {
        formData.append('venue', 'Online');
        if (data.meetingLink) {
            formData.append('meetingLink', data.meetingLink);
        }
    }

    if (bannerFile) {
        formData.append('image', bannerFile);
    }

    if (editingEvent) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setIsPaid(event.fee > 0);
    setPreviewUrl(event.imageUrl);
    reset({
      title: event.title,
      description: event.description,
      date: format(new Date(event.date), 'yyyy-MM-dd'),
      time: event.time,
      venue: event.venue,
      meetingLink: event.meetingLink || '',
      type: event.type,
      isPublic: event.isPublic,
      fee: event.fee,
      imageUrl: event.imageUrl
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-zinc-500">Manage the events you&apos;ve organized.</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditingEvent(null); reset(); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
        ) : events && events.length > 0 ? (
            events.map((event: any) => (
                <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                        <div className="relative h-40 w-full sm:w-64 bg-zinc-100 dark:bg-zinc-800">
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Calendar className="h-10 w-10 text-zinc-300" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            event.isPublic ? 'bg-zinc-100 text-zinc-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {event.isPublic ? 'Public' : 'Private'}
                                        </span>
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                            {event.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">{event.title}</h3>
                                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {format(new Date(event.date), 'PP')} at {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {event.venue}
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                            <Users className="h-4 w-4" />
                                            <span className="font-medium">{event.joinedCount ?? 0}</span>
                                            <span>Joined</span>
                                        </div>
                                        {(event.pendingCount ?? 0) > 0 && (
                                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                </span>
                                                <span className="font-medium">{event.pendingCount}</span>
                                                <span>Pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(event.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.open(`/events/${event.id}`, '_blank')}>
                                    <ExternalLink className="h-4 w-4" /> View Public Page
                                </Button>
                                <Button variant="secondary" size="sm" className="gap-2" onClick={() => router.push('/dashboard/invite-users/' + event.id)}>
                                    <Mail className="h-4 w-4" /> Invite Users
                                </Button>
                                <Button size="sm" onClick={() => router.push('/dashboard/my-events/' + event.id)}>
                                    Manage Participants
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))
        ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Calendar className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No events created yet</h3>
                <p className="text-zinc-500 mt-2 mb-6">Create your first event to start building your community.</p>
                <Button onClick={() => setIsModalOpen(true)}>Create Event</Button>
            </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            >
                <div className="sticky top-0 bg-white dark:bg-zinc-900 p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                    <button onClick={handleCloseModal} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Input label="Event Title" placeholder="e.g. Summer Tech Conference" {...register('title')} error={errors.title?.message} />
                        
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Description</label>
                            <textarea 
                                className="w-full min-h-[120px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                placeholder="Tell us more about the event..."
                                {...register('description')}
                            />
                            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />
                            <Input label="Time" type="time" {...register('time')} error={errors.time?.message} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Type</label>
                                <select 
                                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950 cursor-pointer"
                                    {...register('type')}
                                >
                                    <option value="OFFLINE">Offline Event</option>
                                    <option value="ONLINE">Online Event</option>
                                </select>
                            </div>
                            {eventType === 'OFFLINE' ? (
                                <Input label="Venue / Location" placeholder="e.g. Central Park, NY" {...register('venue')} error={errors.venue?.message} />
                            ) : (
                                <Input label="Meeting Link" placeholder="https://zoom.us/j/..." {...register('meetingLink')} error={errors.meetingLink?.message} />
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pricing</label>
                                <div className="flex gap-4 items-center h-10">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={!isPaid} onChange={() => setIsPaid(false)} />
                                        <span className="text-sm">Free</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={isPaid} onChange={() => setIsPaid(true)} />
                                        <span className="text-sm">Paid</span>
                                    </label>
                                </div>
                            </div>
                            {isPaid && (
                                <Input label="Registration Fee ($)" type="number" step="0.01" {...register('fee')} error={errors.fee?.message} />
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visibility</label>
                                <div className="flex gap-4 items-center h-10">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="true" checked={watch('isPublic') === true} onChange={() => setValue('isPublic', true)} />
                                        <span className="text-sm">Public</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="false" checked={watch('isPublic') === false} onChange={() => setValue('isPublic', false)} />
                                        <span className="text-sm">Private</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Event Banner Image</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="relative h-32 w-full sm:w-56 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="text-zinc-400 text-center p-2">
                                            <Upload className="h-6 w-6 mx-auto mb-1" />
                                            <span className="text-[10px]">No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input 
                                        type="file" 
                                        id="image-upload" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full sm:w-auto gap-2" 
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                    >
                                        <Upload className="h-4 w-4" /> {previewUrl ? 'Change Image' : 'Choose Image'}
                                    </Button>
                                    <p className="text-[10px] text-zinc-500">Recommended size: 1200x600px. Max size: 5MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingEvent ? 'Update Event' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </div>
  );
}
