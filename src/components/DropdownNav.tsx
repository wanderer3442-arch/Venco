"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/essentials", label: "Essentials", desc: "BMI • BMR • TDEE" },
  { href: "/exercises", label: "Exercises", desc: "Plans & templates" },
  { href: "/meal", label: "Meal", desc: "800 foods" },
  { href: "/logger", label: "Logger", desc: "Habits • Rings" },
  { href: "/health", label: "Health", desc: "Pro", locked: true },
  { href: "/download", label: "Download", desc: "Pro PDF", locked: true },
];

export default function DropdownNav({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="grid gap-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            onClick={onClose}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
              pathname === it.href ? "bg-white text-primary" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <span className="font-medium">{it.label}</span>
            <span className="text-xs opacity-80 flex items-center gap-1">
              {it.desc} {it.locked && <span className="text-accent">◆</span>}
            </span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div className="relative hidden lg:block">
      <details className="group">
        <summary className="list-none cursor-pointer flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/20">
          <span>Menu</span>
          <span className="text-xs group-open:rotate-180 transition">▼</span>
        </summary>
        <div className="absolute right-0 mt-2 w-[340px] rounded-xl border border-black/10 bg-white p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`rounded-lg border p-3 hover:border-primary/30 hover:bg-paper transition ${
                  pathname === it.href ? "border-primary bg-paper" : "border-black/5 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-sm text-primary-dark">
                  {it.label} {it.locked && <span className="text-[10px] leading-none rounded-full bg-accent text-white px-1.5 py-0.5">PRO</span>}
                </div>
                <div className="text-xs text-foreground/60">{it.desc}</div>
              </Link>
            ))}
          </div>
          <div className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-foreground/70">
            Free: limited AI + Health/Download locked. <Link href="/pricing" className="text-primary underline">Unlock ₹500/mo</Link>
          </div>
        </div>
      </details>
    </div>
  );
}
