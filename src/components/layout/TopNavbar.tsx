'use client';

import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Search, ChevronRight } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useSession } from 'next-auth/react';
import { T } from '@/lib/theme';
import { getInitials } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';

const PAGE_META: Record<string, { title: string; crumbs: string[] }> = {
  '/dashboard':                      { title: 'Dashboard',          crumbs: ['Home', 'Dashboard'] },
  '/dashboard/student-search':       { title: 'Student Search',     crumbs: ['Home', 'Management', 'Student Search'] },
  '/dashboard/zoom-classes':         { title: 'Zoom Classes',        crumbs: ['Home', 'Management', 'Zoom Classes'] },
  '/dashboard/admin/students':       { title: 'Student Management',  crumbs: ['Home', 'Admin', 'Students'] },
  '/dashboard/admin/coordinators':   { title: 'Coordinator Mgmt',   crumbs: ['Home', 'Admin', 'Coordinators'] },
  '/dashboard/hall-bookings':        { title: 'Hall Bookings',       crumbs: ['Home', 'Management', 'Hall Bookings'] },
  '/dashboard/reports':              { title: 'Reports',             crumbs: ['Home', 'Reports'] },
  '/dashboard/settings':             { title: 'Settings',            crumbs: ['Home', 'Settings'] },
};

const NOTIFICATIONS = [
  { id: 1, msg: 'Password reset requested for SR526702', time: '2m ago',  unread: true },
  { id: 2, msg: 'New duplicate registration detected',   time: '1h ago',  unread: true },
  { id: 3, msg: 'Zoom class "Crypto Trading" created',   time: '3h ago',  unread: false },
];
const UNREAD_COUNT = NOTIFICATIONS.filter((n) => n.unread).length;

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  Admin:   { color: 'var(--role-admin-color)',   bg: 'var(--role-admin-bg)'   },
  Teacher: { color: 'var(--role-teacher-color)', bg: 'var(--role-teacher-bg)' },
  Staff:   { color: 'var(--role-staff-color)',   bg: 'var(--role-staff-bg)'   },
};

export default function TopNavbar() {
  const pathname         = usePathname();
  const { role }         = useUserRole();
  const { data: session } = useSession();

  const meta    = PAGE_META[pathname] ?? { title: 'Dashboard', crumbs: ['Home'] };
  const name    = session?.user?.name ?? 'Support Agent';
  const initials = getInitials(name);
  const rc      = ROLE_COLORS[role] ?? ROLE_COLORS.Staff;

  const iconBtnStyle: React.CSSProperties = {
    width: '36px', height: '36px', borderRadius: '9px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-secondary)',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  return (
    <div style={{
      height: '60px',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--navbar-shadow)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
      position: 'relative',
      zIndex: 20,
    }}>

      {/* Gradient bottom line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, transparent 100%)',
        opacity: 0.4,
      }} />

      {/* Left: Breadcrumb + Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
          {meta.crumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{crumb}</span>
              {i < meta.crumbs.length - 1 && (
                <ChevronRight size={10} color="var(--text-muted)" style={{ opacity: 0.5 }} />
              )}
            </span>
          ))}
        </div>
        <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          {meta.title}
        </h1>
      </div>

      {/* Right: Actions + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Search */}
        <button
          style={iconBtnStyle}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'var(--accent-primary)';
            el.style.borderColor = 'var(--border-hover)';
            el.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'var(--text-secondary)';
            el.style.borderColor = 'var(--border)';
            el.style.background = 'var(--bg-input)';
          }}
        >
          <Search size={15} />
        </button>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={iconBtnStyle}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--accent-primary)';
              el.style.borderColor = 'var(--border-hover)';
              el.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--text-secondary)';
              el.style.borderColor = 'var(--border)';
              el.style.background = 'var(--bg-input)';
            }}
          >
            <Bell size={15} />
          </button>
          {UNREAD_COUNT > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: 'var(--accent-red)', color: 'white',
              fontSize: '10px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--navbar-bg)',
              boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
            }}>{UNREAD_COUNT}</span>
          )}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 2px', opacity: 0.6 }} />

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '5px 10px 5px 6px', borderRadius: '10px',
          background: 'var(--bg-input)', border: '1px solid var(--border)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border-hover)';
            el.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border)';
            el.style.background = 'var(--bg-input)';
          }}
        >
          {/* Avatar */}
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '11px',
            boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
          }}>{initials}</div>

          <div style={{ lineHeight: 1.3 }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{name}</p>
            <span style={{
              fontSize: '10px', fontWeight: 700,
              color: rc.color, background: rc.bg,
              padding: '1px 5px', borderRadius: '4px',
            }}>{role}</span>
          </div>

          <ChevronDown size={13} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
}
