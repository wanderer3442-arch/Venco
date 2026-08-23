"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  // placeholder auth — replace with NextAuth session
  const user = { name: "Demo User", email: "demo@venco.fit" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white text-primary pl-1 pr-3 py-1 text-sm font-medium hover:bg-white/90"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white text-xs font-bold">
          {user.name.slice(0, 1)}
        </span>
        <span className="hidden sm:inline">{user.name}</span>
        <span className="text-xs">▼</span>
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-label="close" />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border bg-white p-1.5 shadow-xl">
            <div className="px-3 py-2">
              <div className="text-sm font-semibold text-primary-dark">{user.name}</div>
              <div className="text-xs text-foreground/60">{user.email}</div>
            </div>
            <div className="my-1 border-t" />
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-paper"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-paper"
            >
              Settings
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-accent hover:bg-accent/10"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
