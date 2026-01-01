'use client';

import React from 'react';

type BookingsEmbedProps = {
  className?: string;
  heightPx?: number;
};

export default function BookingsEmbed({ className, heightPx = 420 }: BookingsEmbedProps) {
  const bookingUrl = process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled';

  return (
    <div className={className}>
      <div
        className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8 text-center"
        style={{ minHeight: heightPx }}
      >
        <h3 className="text-2xl font-bold text-white mb-3">Schedule your demo</h3>
        <p className="text-gray-300 mb-6">
          We use Microsoft Bookings for scheduling. It opens in a secure new tab.
        </p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
        >
          Open Microsoft Bookings
        </a>
        <div className="mt-4">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Having issues? Click here to open the scheduler
          </a>
        </div>
      </div>
    </div>
  );
}


