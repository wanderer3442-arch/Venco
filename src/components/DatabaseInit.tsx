'use client';

import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/database';

export default function DatabaseInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setReady(true))
      .catch((err) => {
        console.warn('[DB] Init failed, falling back to localStorage:', err);
        setError(String(err));
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">Loading database...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
