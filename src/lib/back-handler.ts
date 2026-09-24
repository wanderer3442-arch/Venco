'use client';

import { useEffect, useRef } from 'react';

type BackHandler = () => boolean;

let handlers: BackHandler[] = [];

export function registerBackHandler(handler: BackHandler): () => void {
  handlers.push(handler);
  return () => {
    handlers = handlers.filter((h) => h !== handler);
  };
}

export function runBackHandlers(): boolean {
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]()) return true;
  }
  return false;
}

export function useBackHandler(enabled: boolean, handler: () => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    return registerBackHandler(() => {
      handlerRef.current();
      return true;
    });
  }, [enabled]);
}
