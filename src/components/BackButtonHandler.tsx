'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { runBackHandlers } from '@/lib/back-handler';

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => Promise<void> } | undefined;

    const onBack = async ({ canGoBack }: { canGoBack: boolean }) => {
      if (runBackHandlers()) return;

      if (canGoBack) {
        sessionStorage.setItem('came_from_back', '1');
        window.history.back();
        return;
      }

      const current = pathnameRef.current;
      if (current !== '/login') {
        sessionStorage.setItem('came_from_back', '1');
        router.push('/login');
        return;
      }

      await App.minimizeApp();
    };

    App.addListener('backButton', onBack).then((l) => {
      handle = l;
    });

    return () => {
      handle?.remove();
    };
  }, [router]);

  useEffect(() => {
    sessionStorage.removeItem('came_from_back');
  }, [pathname]);

  return null;
}
