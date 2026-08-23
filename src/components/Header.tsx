"use client";

import Link from "next/link";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import DropdownNav from "./DropdownNav";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: logo + name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-primary-dark font-bold text-lg tracking-tight">
            V
          </div>
          <span className="font-display text-xl font-bold tracking-tight">VencoFit</span>
          <span className="hidden sm:inline text-xs bg-foreground/15 px-2 py-0.5 rounded-full">Health OS</span>
        </Link>

        {/* Right: nav + profile */}
        <div className="flex items-center gap-2">
          <DropdownNav mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-paper/10"
            aria-label="Menu"
          >
            ☰
          </button>
          <ProfileMenu />
        </div>
      </div>
      {/* mobile dropdown extra row */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-primary px-4 py-3">
          <DropdownNav mobile />
        </div>
      )}
    </header>
  );
}
