'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UserRoleProvider>
      <ToastProvider>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>

          {/* Mobile overlay — only rendered when sidebar is open */}
          {sidebarOpen && (
            <div
              className="mobile-sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <TopNavbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
            <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
          </div>

        </div>
      </ToastProvider>
    </UserRoleProvider>
  );
}
