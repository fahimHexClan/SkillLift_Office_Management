'use client';

import {
  LayoutDashboard, Video, Users, UserCheck,
  BarChart2, Settings, LogOut, ChevronRight,
  CalendarDays, Shield, UserSearch, UserCog,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useUserRole } from '@/hooks/useUserRole';
import { UserRole } from '@/types';
import { getInitials } from '@/lib/utils';

// ─── Sidebar tokens — all values come from CSS variables (theme-aware) ────────
const S = {
  bg:            'var(--sidebar-bg)',
  border:        'var(--sidebar-border-c)',
  text:          'var(--sidebar-text)',
  textMuted:     'var(--sidebar-text-inactive)',
  textInactive:  'var(--sidebar-text-inactive)',
  hover:         'var(--sidebar-hover-bg)',
  hoverText:     'var(--sidebar-hover-text)',
  hoverBorder:   'var(--sidebar-hover-border)',
  activeGrad:    'var(--sidebar-active-bg)',
  activeText:    'var(--sidebar-active-text)',
  activeGlow:    'var(--sidebar-active-glow)',
  sectionLabel:  'var(--sidebar-section-label)',
  gradient:      'var(--gradient-main)',
  logoBg:        'var(--sidebar-logo-bg)',
  logoBorder:    'var(--sidebar-logo-border)',
  profileBg:     'var(--sidebar-profile-bg)',
  profileBorder: 'var(--sidebar-profile-border)',
  avatarInner:   'var(--sidebar-avatar-inner)',
  avatarText:    'var(--sidebar-avatar-text)',
  shadow:        'var(--sidebar-shadow)',
  logoutColor:   'var(--sidebar-logout-color)',
  logoutBg:      'var(--sidebar-logout-bg)',
  logoutBorder:  'var(--sidebar-logout-border)',
};

// ─── Nav structure ────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href:  string;
  icon:  React.ElementType;
  roles: UserRole[];
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin','Teacher','Staff'] },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Student Search',     href: '/dashboard/student-search',     icon: UserSearch,  roles: ['Admin','Teacher','Staff'] },
      { label: 'Zoom Classes',       href: '/dashboard/zoom-classes',       icon: Video,       roles: ['Admin','Teacher','Staff'] },
      { label: 'Student Management', href: '/dashboard/admin/students',     icon: Users,       roles: ['Admin'] },
      { label: 'Coordinator Mgmt',   href: '/dashboard/admin/coordinators', icon: UserCheck,   roles: ['Admin'] },
      { label: 'User Management',    href: '/dashboard/admin/users',        icon: UserCog,     roles: ['Admin'] },
      { label: 'Hall Bookings',      href: '/dashboard/hall-bookings',      icon: CalendarDays,roles: ['Admin','Teacher','Staff'] },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Reports',  href: '/dashboard/reports',  icon: BarChart2, roles: ['Admin','Teacher','Staff'] },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings,  roles: ['Admin','Teacher','Staff'] },
    ],
  },
];

const ROLE_META: Record<UserRole, { color: string; bg: string; border: string }> = {
  Admin:   { color: 'var(--role-admin-color)',   bg: 'var(--role-admin-bg)',   border: 'var(--role-admin-border)'   },
  Teacher: { color: 'var(--role-teacher-color)', bg: 'var(--role-teacher-bg)', border: 'var(--role-teacher-border)' },
  Staff:   { color: 'var(--role-staff-color)',   bg: 'var(--role-staff-bg)',   border: 'var(--role-staff-border)'   },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useUserRole();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const rm = ROLE_META[role];

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: S.bg,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${S.border}`,
      boxShadow: S.shadow,
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: `1px solid ${S.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          padding: '10px 18px',
          background: S.logoBg,
          border: `1px solid ${S.logoBorder}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src="/skilllift-logo0.png"
            alt="SkillLift"
            style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fb = e.currentTarget.nextElementSibling as HTMLElement;
              if (fb) fb.style.display = 'flex';
            }}
          />
          {/* Fallback */}
          <div style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: S.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
              fontSize: '13px', fontWeight: 800, color: 'white',
            }}>S</div>
            <div>
              <p style={{ color: S.text, fontWeight: 800, fontSize: '12px', letterSpacing: '0.08em' }}>SKILIFT</p>
              <p style={{ color: S.sectionLabel, fontSize: '9px', letterSpacing: '0.14em' }}>OFFICE MGMT</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Role switcher ── */}
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 11px', borderRadius: '9px',
          background: rm.bg, border: `1px solid ${rm.border}`,
        }}>
          <Shield size={12} color={rm.color} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            style={{
              background: 'none', border: 'none', outline: 'none', flex: 1,
              fontSize: '12px', fontWeight: 700, color: rm.color,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        {NAV_SECTIONS.map((section, si) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          if (!visibleItems.length) return null;
          return (
            <div key={section.label} style={{ marginBottom: '6px' }}>
              {/* Section label */}
              <p style={{
                fontSize: '10px', fontWeight: 700, color: S.sectionLabel,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0 10px 6px',
                marginTop: si > 0 ? '14px' : '0',
              }}>{section.label}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {visibleItems.map((item) => {
                  const Icon   = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '9px',
                        fontSize: '13px', fontWeight: active ? 600 : 400,
                        color: active ? S.activeText : S.textInactive,
                        background: active ? S.activeGrad : 'transparent',
                        border: '1px solid transparent',
                        textDecoration: 'none',
                        boxShadow: active ? S.activeGlow : 'none',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = S.hover;
                          el.style.color = S.hoverText;
                          el.style.borderColor = S.hoverBorder;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'transparent';
                          el.style.color = S.textInactive;
                          el.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                      <span style={{ flex: 1, lineHeight: 1 }}>{item.label}</span>
                      {active && (
                        <ChevronRight size={12} style={{ opacity: 0.6, flexShrink: 0 }} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Separator after section (except last) */}
              {si < NAV_SECTIONS.length - 1 && (
                <div style={{
                  height: '1px',
                  background: S.border,
                  margin: '14px 10px 0',
                }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom: Profile + Logout ── */}
      <div style={{ padding: '10px 10px 14px', borderTop: `1px solid ${S.border}` }}>

        {/* Profile card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 11px', borderRadius: '10px',
          background: S.profileBg,
          border: `1px solid ${S.profileBorder}`,
          marginBottom: '8px',
        }}>
          {/* Avatar with gradient border */}
          <div style={{
            padding: '2px',
            borderRadius: '10px',
            background: S.gradient,
            flexShrink: 0,
            boxShadow: '0 2px 10px rgba(59,130,246,0.3)',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: S.avatarInner,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: S.avatarText, fontWeight: 800, fontSize: '11px',
            }}>SA</div>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: S.text, fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Support Agent
            </p>
            <span style={{
              fontSize: '10px', fontWeight: 700, color: rm.color,
              background: rm.bg, padding: '1px 6px', borderRadius: '4px',
            }}>{role}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '9px', width: '100%',
            fontSize: '13px', fontWeight: 500,
            color: S.logoutColor,
            background: S.logoutBg,
            border: `1px solid ${S.logoutBorder}`,
            cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(239,68,68,0.2)';
            el.style.borderColor = 'rgba(239,68,68,0.4)';
            el.style.color = '#ef4444';
            el.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = S.logoutBg;
            el.style.borderColor = S.logoutBorder;
            el.style.color = S.logoutColor;
            el.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0,
            background: 'rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={12} color={S.logoutColor} />
          </div>
          <span style={{ flex: 1, textAlign: 'left' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
