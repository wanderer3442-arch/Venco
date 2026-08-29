'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import ChatBot from '@/components/chatbot/ChatBot';
import { useSidebar } from '@/lib/sidebar-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? '72px' : '260px' }}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
      <ChatBot mode="floating" />
    </div>
  );
}
