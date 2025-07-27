# IELTS Course Product Page

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features Implemented

• **Responsive Design**: Fully responsive layout that works seamlessly across all device sizes (mobile, tablet, desktop)

• **Interactive Media Gallery**: Advanced media gallery with support for both images and videos
  - Device-specific video playback (separate state management for mobile and desktop)
  - Thumbnail navigation with visual indicators
  - Navigation arrows with custom styling
  - Auto-play functionality for YouTube videos

• **Dynamic Content Integration**: 
  - Course data fetched from API endpoints
  - Dynamic HTML content rendering with dangerouslySetInnerHTML
  - Real-time data binding for course features, pricing, and descriptions

• **Advanced Navigation System**:
  - Tab-based navigation with scroll-to-section functionality
  - Active tab detection based on scroll position
  - Smooth scrolling animations between sections

• **Accordion Components**: 
  - Collapsible course details sections
  - Smooth expand/collapse animations
  - First item auto-expanded by default
  - Gray-200 borders and right-aligned arrows

• **Sticky Sidebar**: Course features and pricing information stays visible during scroll

• **Course Exclusive Features Section**: Special highlighted section with:
  - Gray-200 borders throughout
  - Full-width responsive images
  - Feature lists with checkmark icons

• **State Management**: React hooks for managing:
  - Media playback states
  - Active navigation tabs
  - Scroll position detection
  - UI interactions

• **Performance Optimizations**:
  - Next.js Image component for optimized image loading
  - useMemo for preventing unnecessary re-renders
  - Efficient scroll event handling

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
NEXT_PUBLIC_BASE_URL=your_api_base_url_here
```

**Required Environment Variables:**

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_BASE_URL` | Base URL for the API endpoints | `https://api.10minuteschool.com` |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
