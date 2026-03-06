'use client';

import { LayoutDashboard, CalendarDays, LogOut, Zap, Video, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useUserRole } from '@/hooks/useUserRole';
import { UserRole } from '@/types';

const roleMeta: Record<UserRole, { color: string; bg: string; border: string }> = {
  Admin:   { color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' },
  Teacher: { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
  Staff:   { color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, isAdmin } = useUserRole();
  const rm = roleMeta[role];

  const navItems = [
    { label: 'Dashboard',          href: '/dashboard',               icon: LayoutDashboard, visible: true },
    { label: 'Zoom Classes',        href: '/dashboard/zoom-classes',  icon: Video,           visible: true },
    { label: 'Student Management',  href: '/dashboard/admin/students', icon: Users,           visible: isAdmin },
    { label: 'Hall Bookings',       href: '/dashboard/hall-bookings', icon: CalendarDays,    visible: true },
  ];

  return (
    <aside style={{
      width: '208px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f1729 0%, #162035 100%)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em' }}>SKILIFT</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.08em' }}>SUPPORT</p>
          </div>
        </div>
      </div>

      {/* Agent + Role */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '13px',
            flexShrink: 0, boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
          }}>SA</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Support Agent</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontFamily: 'monospace' }}>OS011</p>
          </div>
        </div>

        {/* Role switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: '8px',
          background: rm.bg, border: `1px solid ${rm.border}`,
        }}>
          <Shield size={11} color={rm.color} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            style={{
              background: 'none', border: 'none', outline: 'none', flex: 1,
              fontSize: '11px', fontWeight: 700, color: rm.color,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <option value="Admin" style={{ background: '#1e293b', color: 'white' }}>Admin</option>
            <option value="Teacher" style={{ background: '#1e293b', color: 'white' }}>Teacher</option>
            <option value="Staff" style={{ background: '#1e293b', color: 'white' }}>Staff</option>
          </select>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', padding: '4px 8px 8px', textTransform: 'uppercase' }}>Menu</p>
        {navItems.filter((item) => item.visible).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
              background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.1))' : 'transparent',
              border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '10px', width: '100%',
          fontSize: '13px', fontWeight: 500,
          color: 'rgba(239,68,68,0.7)',
          background: 'transparent', border: '1px solid transparent',
          cursor: 'pointer', transition: 'all 0.2s',
          fontFamily: "'DM Sans', sans-serif",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)';
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
