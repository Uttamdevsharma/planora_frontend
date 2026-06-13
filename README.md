# Planora 📅

> A modern, elegant event management and participation platform designed for seamless event organization and scalable engagement.

🟢 **Live Demo**: [https://planora-client-topaz.vercel.app](https://planora-client-topaz.vercel.app)

## 📖 Description

Planora is a robust web platform that bridges the gap between event organizers and participants. It provides an intuitive, high-performance interface for event discovery, secure registrations, dynamic user dashboards, and comprehensive administrative oversight. The frontend is built to deliver a premium user experience with responsive design, smooth animations, and robust forms.

## ✨ Features

- **Role-Based Workflows**: Tailored experiences with dedicated flows for both standard `User` and `Admin` roles.
- **Event Discovery & Participation**: Browse public events and seamlessly apply to join with status tracking (Pending/Approved/Rejected).
- **Stripe Integration**: Secure and reliable payment processing natively integrated within the event participation flow.
- **Dynamic Dashboards**: User-specific overviews to track `My Events`, earnings, platform invitations, and profile settings.
- **Admin Control Panel**: Advanced management tools for comprehensive oversight of events, users, and overall platform metrics.
- **Intuitive UX/UI**: Clean design powered by Tailwind CSS, with fluid transitions and micro-interactions powered by Framer Motion.
- **Form Validation & Error Handling**: Beautiful, intelligent forms equipped with Zod-based validation and instant toaster notifications.

## 🛠️ Technologies Used

- **Framework:** [Next.js v16](https://nextjs.org/) (App Router format)
- **Core:** [React v19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching & State:** [TanStack React Query](https://tanstack.com/query/latest) & Axios
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons & UI:** [Lucide React](https://lucide.dev/), Tailwind Merge, Classnames
- **Payments:** [Stripe React](https://stripe.com/docs/stripe-js/react)

## 🚀 Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v20+ recommended) and `npm` installed.

### 1. Clone & Install Dependencies

Navigate into the client directory and install the necessary npm packages:

```bash
cd client
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root of the `client` directory and populate it with the appropriate values. At a minimum, you will need to map your API base URL and your Stripe public publishable key:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```
*(Replace the values with your actual server URL and Stripe keys.)*

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

### 4. Build for Production

To create an optimized production build, run:

```bash
npm run build
npm run start
```
