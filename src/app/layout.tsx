import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";
import { SubscriptionProvider } from "@/lib/subscription-context";
import { SidebarProvider } from "@/lib/sidebar-context";
import DatabaseInit from "@/components/DatabaseInit";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym at Home - Health & Fitness Dashboard",
  description: "Your at-home gym companion. Track meals, exercises, and body metrics with AI-powered insights.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-surface text-on-surface antialiased">
        <DatabaseInit>
          <AuthProvider>
            <SubscriptionProvider>
              <StoreProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </StoreProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </DatabaseInit>
      </body>
    </html>
  );
}
