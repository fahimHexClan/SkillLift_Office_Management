import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserRoleProvider>
      <ToastProvider>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TopNavbar />
            <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
          </div>
        </div>
      </ToastProvider>
    </UserRoleProvider>
  );
}
