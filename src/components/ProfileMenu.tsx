"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user ?? { name: "Demo User", email: "demo@venco.fit" } as { name?: string | null; email?: string | null };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white text-primary pl-1 pr-3 py-1 text-sm font-medium hover:bg-white/90"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white text-xs font-bold">
          {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{status === "authenticated" ? (user.name ?? user.email) : "Demo User"}</span>
        <span className="text-xs">▼</span>
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-label="close" />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border bg-white p-1.5 shadow-xl">
            <div className="px-3 py-2">
              <div className="text-sm font-semibold text-primary-dark">{(user.name ?? "Guest") as string}</div>
              <div className="text-xs text-foreground/60">{(user.email ?? "Not signed in") as string}</div>
              {status === "authenticated" && <div className="text-[10px] mt-1 text-primary">{(session?.user as unknown as { tier?: string })?.tier ?? "free"} • VencoFit</div>}
            </div>
            <div className="my-1 border-t" />
            {status === "authenticated" ? (
              <>
                <Link href="/profile" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-paper">
                  Profile
                </Link>
                <Link href="/settings" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-paper">
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm text-accent hover:bg-accent/10"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm bg-primary text-white text-center">
                  Sign in / Gmail
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-paper text-center">
                  Create account
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
