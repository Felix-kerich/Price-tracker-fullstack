"use client"; // Add this to mark the component as a client component

import { Inter } from 'next/font/google';
import clsx from 'clsx';
import '@/styles/tailwind.css';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// API URL for starting the scheduler
const START_SCHEDULER_URL = '/api/start-scheduler';

export default function RootLayout({ children }) {
  useEffect(() => {
    const startScheduler = async () => {
      try {
        const response = await fetch(START_SCHEDULER_URL, { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to start the scheduler');
        }
        console.log('Scheduler started successfully');
      } catch (error) {
        console.error('Error starting the scheduler:', error);
      }
    };

    // Call the scheduler when the component mounts
    startScheduler();
  }, []);

  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
      )}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
