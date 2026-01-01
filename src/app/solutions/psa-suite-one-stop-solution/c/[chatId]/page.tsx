'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useState } from 'react';
import { resetLightningSession } from '../../../../lib/lightningSession';

// Dynamically load Main component without SSR
const Main = dynamic(() => import('../../page'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400">Let me work my magic…</p>
      </div>
    </div>
  )
});

export default function ChatPage() {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    // If a pending message exists, a fresh session was just initialized upstream.
    // Avoid clearing it; otherwise start a clean session before rendering.
    const hasPending = (() => {
      try {
        return !!localStorage.getItem('pendingLightningMessage');
      } catch {
        return false;
      }
    })();

    if (!hasPending) {
      resetLightningSession();
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Preparing a fresh session…</p>
        </div>
      </div>
    );
  }

  return <Main />;
}
