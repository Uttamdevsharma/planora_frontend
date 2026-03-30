# Planora Frontend

The frontend for Planora is built with Next.js 15, React 19, Tailwind CSS 4, and TanStack Query.

## Features

- **Authentication**: Secure Login/Register with JWT (stored in cookies).
- **Home**: Hero section for featured events and a grid of upcoming events.
- **Events**: Search and filter events by visibility, fee, and type.
- **Event Details**: Full event info, dynamic participation logic, and review system.
- **Dashboard**:
  - My Events (CRUD management)
  - My Participations (Join status)
  - My Earnings (Revenue tracking)
  - Invitations (Manage invites)
  - Settings (Profile & Image update)
- **Payment**: Stripe integration for paid events.
- **Image Upload**: Cloudinary integration for profile and event banners.
- **Loading States**: Skeleton loaders for a better user experience.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Set up environment variables**:
    Create a `.env.local` file in the `client` directory with the following:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Go to [http://localhost:3000](http://localhost:3000) to see the result.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: Axios, TanStack Query
- **Forms**: React Hook Form, Zod
- **Auth**: js-cookie
- **Notifications**: Sonner
