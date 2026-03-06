import Sidebar from '@/components/layout/Sidebar';
import { UserRoleProvider } from '@/contexts/UserRoleContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserRoleProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </UserRoleProvider>
  );
}
