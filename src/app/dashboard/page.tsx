'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap, Users, CreditCard, BookOpen,
  TrendingUp, Clock, ArrowUpRight, Quote,
  Pencil, Check, X, Lock, KeyRound,
  AlertCircle as AlertErr, Video, BarChart2,
  Bell, Activity, RefreshCw, Brain,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import type { UserRole } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { T, card, inputCss, labelCss, spinner } from '@/lib/theme';
import { getInitials } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════
//  STATIC DATA
// ═══════════════════════════════════════════════════════════

const GROWTH_WEEKLY = [
  { day: 'Mon', students: 12 },
  { day: 'Tue', students: 19 },
  { day: 'Wed', students: 8  },
  { day: 'Thu', students: 24 },
  { day: 'Fri', students: 31 },
  { day: 'Sat', students: 18 },
  { day: 'Sun', students: 22 },
];

const GROWTH_MONTHLY = [
  { day: 'Wk 1', students: 87  },
  { day: 'Wk 2', students: 112 },
  { day: 'Wk 3', students: 98  },
  { day: 'Wk 4', students: 134 },
];

const PAYMENT_DATA = [
  { name: 'Full Payment', value: 1904, color: '#0d9488' },
  { name: 'Half Payment', value: 943,  color: '#f59e0b' },
];

const COURSE_FALLBACK = [
  { course: 'Crypto Trading Guide',  students: 847 },
  { course: 'Forex Fundamentals',    students: 612 },
  { course: 'Stock Market Basics',   students: 534 },
  { course: 'Options Trading Pro',   students: 421 },
  { course: 'Technical Analysis',    students: 387 },
];

const LIVE_POOL = [
  { emoji: '🟢', msg: 'SR527364 — New Registration',              time: '2 min ago',  color: '#10b981' },
  { emoji: '💰', msg: 'SR526701 — Full Payment Received',         time: '15 min ago', color: '#0d9488' },
  { emoji: '🔍', msg: 'SR527100 — Profile Viewed',                time: '22 min ago', color: '#3b82f6' },
  { emoji: '⚠️', msg: 'SR527200 — Half Payment Overdue (45 days)', time: '1 hr ago',   color: '#f59e0b' },
  { emoji: '🟢', msg: 'SR527401 — New Registration',              time: '1 hr ago',   color: '#10b981' },
  { emoji: '💰', msg: 'SR526890 — Half Payment Received',         time: '2 hrs ago',  color: '#0d9488' },
  { emoji: '🔄', msg: 'SR527050 — Course Transfer Completed',     time: '3 hrs ago',  color: '#8b5cf6' },
  { emoji: '🟢', msg: 'SR527320 — New Registration',              time: '3 hrs ago',  color: '#10b981' },
];

const ALERTS_DATA = [
  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   emoji: '🔴', count: 23, msg: 'students have half payment pending > 30 days' },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  emoji: '🟡', count: 7,  msg: 'duplicate registrations detected this week'  },
  { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  emoji: '🟢', count: 14, msg: 'new students registered today'                },
  { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  emoji: '🔵', count: 5,  msg: 'students upgraded from half to full payment today' },
];

const PEAK_HOURS = [
  { hour: '6PM', val: 25 },
  { hour: '7PM', val: 68 },
  { hour: '8PM', val: 95 },
  { hour: '9PM', val: 87 },
  { hour: '10PM', val: 72 },
  { hour: '11PM', val: 41 },
];

const AI_INSIGHTS = [
  {
    emoji: '💰',
    title: 'Payment Alert',
    insight: '23 students haven\'t paid balance in 30+ days. Potential revenue: Rs. 230,000',
    action: 'View Students',
    href: '/dashboard/student-search',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glow: 'rgba(245,158,11,0.25)',
  },
  {
    emoji: '📚',
    title: 'Course Performance',
    insight: 'Crypto Trading Guide has the highest enrollment (847 students) but 34% half-payment pending',
    action: 'View Report',
    href: '/dashboard/reports',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    glow: 'rgba(59,130,246,0.25)',
  },
  {
    emoji: '⏰',
    title: 'Peak Registration Time',
    insight: 'Most registrations happen between 7PM–10PM. Schedule support staff accordingly.',
    action: 'View Analytics',
    href: '/dashboard/reports',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
    glow: 'rgba(13,148,136,0.25)',
  },
];

// ═══════════════════════════════════════════════════════════
//  SHARED HELPERS
// ═══════════════════════════════════════════════════════════

function SectionHeader({ title, icon, action }: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <p style={{ fontSize: '13px', fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>
          {title}
        </p>
      </div>
      {action}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; name: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: '10px', padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }}>
      <p style={{ fontSize: '11px', color: T.textMuted, marginBottom: '4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: '13px', fontWeight: 700, color: '#0d9488' }}>
          {p.value} {p.name === 'students' ? 'students' : ''}
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  1. STATS ROW
// ═══════════════════════════════════════════════════════════

function StatsRow() {
  const [totalCourses, setTotalCourses] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/proxy/courses')
      .then((r) => r.json())
      .then((data) => {
        const list: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setTotalCourses(list.length || 5);
      })
      .catch(() => setTotalCourses(5));
  }, []);

  const STATS = [
    {
      title: 'Total Students',
      value: '2,847',
      sub: '+127 this month',
      trend: '+4.7%',
      trendUp: true,
      icon: GraduationCap,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      glow: 'rgba(59,130,246,0.18)',
    },
    {
      title: 'Active Students',
      value: '1,904',
      sub: 'Fully activated',
      trend: '+2.1%',
      trendUp: true,
      icon: Users,
      gradient: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
      glow: 'rgba(16,185,129,0.18)',
    },
    {
      title: 'Half Payment Pending',
      value: '943',
      sub: '23 overdue >30 days',
      trend: '-1.3%',
      trendUp: false,
      icon: CreditCard,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      glow: 'rgba(245,158,11,0.18)',
    },
    {
      title: 'Total Courses',
      value: totalCourses !== null ? String(totalCourses) : '…',
      sub: '3 ongoing sessions',
      trend: 'Stable',
      trendUp: true,
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      glow: 'rgba(139,92,246,0.18)',
    },
  ];

  return (
    <div className="stats-grid">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.title}
            className="fade-up"
            style={{
              background: T.card,
              borderRadius: '16px',
              border: `1px solid ${T.border}`,
              boxShadow: T.shadowCard,
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '14px',
              cursor: 'default', transition: 'all 0.25s ease',
              animationDelay: `${i * 0.07}s`, animationFillMode: 'both',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = `var(--shadow-md), 0 0 28px ${s.glow}`;
              el.style.borderColor = T.borderHover;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = T.shadowCard;
              el.style.borderColor = T.border;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.title}
                </p>
                <p style={{ fontSize: '30px', fontWeight: 800, color: T.text, marginTop: '5px', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {s.value}
                </p>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: s.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 18px ${s.glow}`,
              }}>
                <Icon size={21} color="white" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '12px', color: T.textSec }}>{s.sub}</p>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', fontWeight: 600,
                color: s.trendUp ? 'var(--accent-green)' : 'var(--accent-red)',
              }}>
                <TrendingUp size={11} />
                {s.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  2A. GROWTH CHART
// ═══════════════════════════════════════════════════════════

function GrowthChart() {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const data = view === 'weekly' ? GROWTH_WEEKLY : GROWTH_MONTHLY;

  return (
    <div style={{ ...card, padding: '0', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="#0d9488" />
          <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Student Growth</p>
        </div>
        <div className="chart-toggle" style={{ display: 'flex', background: T.input, borderRadius: '8px', border: `1px solid ${T.border}`, padding: '2px' }}>
          {(['weekly', 'monthly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                background: view === v ? '#0d9488' : 'transparent',
                color: view === v ? 'white' : T.textSec,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif", textTransform: 'capitalize',
              }}
            >{v}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 8px 8px' }}>
        <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone" dataKey="students"
              stroke="#0d9488" strokeWidth={2.5}
              fill="url(#tealGrad)" dot={{ fill: '#0d9488', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  2B. PAYMENT DONUT
// ═══════════════════════════════════════════════════════════

function PaymentDonut() {
  const total   = PAYMENT_DATA.reduce((s, d) => s + d.value, 0);
  const pct     = Math.round((PAYMENT_DATA[0].value / total) * 100);

  return (
    <div style={{ ...card, padding: '0', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CreditCard size={14} color="#0d9488" />
        <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Payment Conversion</p>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '200px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PAYMENT_DATA}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={78}
                dataKey="value" startAngle={90} endAngle={-270}
                strokeWidth={0}
              >
                {PAYMENT_DATA.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label overlay */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#0d9488', lineHeight: 1 }}>{pct}%</p>
            <p style={{ fontSize: '10px', color: T.textMuted, fontWeight: 600, marginTop: '2px' }}>Converted</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', padding: '0 16px 16px' }}>
          {PAYMENT_DATA.map((d) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                <p style={{ fontSize: '12px', color: T.textSec }}>{d.name}</p>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: T.text }}>{d.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  2C. COURSE BREAKDOWN
// ═══════════════════════════════════════════════════════════

function CourseBreakdown() {
  const [courses, setCourses] = useState(COURSE_FALLBACK);

  useEffect(() => {
    fetch('/api/proxy/courses')
      .then((r) => r.json())
      .then((data) => {
        const list: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          const mapped = list.slice(0, 5).map((c, i) => ({
            course: typeof c === 'string'
              ? (c.length > 20 ? c.slice(0, 20) + '…' : c)
              : String((c as Record<string,unknown>).name ?? ''),
            students: COURSE_FALLBACK[i]?.students ?? Math.floor(Math.random() * 600 + 200),
          }));
          setCourses(mapped);
        }
      })
      .catch(() => {}); // keep fallback
  }, []);

  const max = Math.max(...courses.map((c) => c.students));

  return (
    <div style={{ ...card, padding: '0', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={14} color="#0d9488" />
        <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Top Courses</p>
      </div>
      <div style={{ flex: 1, padding: '16px 8px 8px' }}>
        <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={courses} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category" dataKey="course" width={90}
              tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0d9488' }}>{payload[0].value} students</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="students" radius={[0, 6, 6, 0]} maxBarSize={18}>
              {courses.map((c, i) => (
                <Cell
                  key={i}
                  fill={`rgba(13,148,136,${0.4 + (c.students / max) * 0.6})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  3. ALERTS PANEL
// ═══════════════════════════════════════════════════════════

function AlertsPanel() {
  return (
    <div style={{ ...card, padding: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bell size={14} color="#0d9488" />
        <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Smart Alerts</p>
        <span style={{
          marginLeft: 'auto', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px',
        }}>
          {ALERTS_DATA.length} active
        </span>
      </div>
      <div style={{ padding: '8px 0', flex: 1 }}>
        {ALERTS_DATA.map((a, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '13px 20px',
              borderBottom: i < ALERTS_DATA.length - 1 ? `1px solid ${T.border}` : 'none',
              background: 'transparent', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: a.bg, border: `1px solid ${a.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}>
              {a.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', color: T.text, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: a.color }}>{a.count} </span>
                {a.msg}
              </p>
            </div>
            <Link
              href="/dashboard/student-search"
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: '7px',
                fontSize: '11px', fontWeight: 600,
                background: a.bg, border: `1px solid ${a.border}`,
                color: a.color, textDecoration: 'none',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  4. LIVE FEED
// ═══════════════════════════════════════════════════════════

function LiveFeed() {
  const [items, setItems]         = useState(LIVE_POOL);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('just now');
  const [tick, setTick]           = useState(0);

  // Auto-refresh every 30s — rotate a new item to top
  useEffect(() => {
    const id = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        setItems((prev) => {
          const next = [...prev];
          next.unshift(next.pop()!);
          return next;
        });
        setTick((t) => t + 1);
        setLastUpdated('just now');
        setRefreshing(false);
      }, 600);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ ...card, padding: '0', display: 'flex', flexDirection: 'column' }}>
      {/* Header with LIVE badge */}
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="#0d9488" />
          <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Live Feed</p>
          {/* LIVE pulse badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', fontSize: '10px', fontWeight: 800,
            padding: '2px 8px', borderRadius: '99px', letterSpacing: '0.06em',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981', flexShrink: 0,
              animation: 'pulse 2s infinite',
            }} />
            LIVE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <p style={{ fontSize: '10px', color: T.textMuted }}>Updated {lastUpdated}</p>
          <div style={{
            width: '22px', height: '22px', borderRadius: '6px',
            background: T.input, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RefreshCw
              size={11} color={T.textMuted}
              style={{ animation: refreshing ? 'spin 0.6s linear' : 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Feed items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {items.map((item, i) => (
          <div
            key={`${tick}-${i}`}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '11px 20px',
              borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : 'none',
              background: i === 0 && tick > 0 ? 'rgba(13,148,136,0.04)' : 'transparent',
              transition: 'background 0.3s',
              animation: i === 0 && tick > 0 ? 'fadeUp 0.35s ease' : 'none',
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
              background: `${item.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>
              {item.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: '1px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: T.text, lineHeight: 1.4, marginBottom: '2px' }}>
                {item.msg}
              </p>
              <p style={{ fontSize: '10px', color: T.textMuted }}>{item.time}</p>
            </div>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: item.color, flexShrink: 0, marginTop: '6px',
              boxShadow: `0 0 6px ${item.color}80`,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  5. AI INSIGHTS
// ═══════════════════════════════════════════════════════════

function AIInsights() {
  return (
    <div>
      <SectionHeader
        title="AI Insights"
        icon={<Brain size={14} color="#0d9488" />}
      />
      <div className="insights-grid">
        {AI_INSIGHTS.map((ins, i) => (
          <div
            key={i}
            className="fade-up"
            style={{
              borderRadius: '16px', padding: '20px',
              background: ins.gradient,
              boxShadow: `0 8px 24px ${ins.glow}`,
              display: 'flex', flexDirection: 'column', gap: '12px',
              transition: 'all 0.25s ease',
              animationDelay: `${i * 0.08}s`, animationFillMode: 'both',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = `0 16px 36px ${ins.glow}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = `0 8px 24px ${ins.glow}`;
            }}
          >
            {/* Top: emoji + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>
                {ins.emoji}
              </div>
              <p style={{ fontWeight: 800, fontSize: '14px', color: 'white', letterSpacing: '-0.01em' }}>
                {ins.title}
              </p>
            </div>

            {/* Insight text */}
            <p style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65, flex: 1,
            }}>
              {ins.insight}
            </p>

            {/* Special: Peak Hours mini chart */}
            {ins.title === 'Peak Registration Time' && (
              <div style={{ height: '50px', margin: '0 -4px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PEAK_HOURS} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap="20%">
                    <Bar dataKey="val" radius={[3, 3, 0, 0]} maxBarSize={20}>
                      {PEAK_HOURS.map((h, idx) => (
                        <Cell key={idx} fill={`rgba(255,255,255,${0.35 + (h.val / 100) * 0.55})`} />
                      ))}
                    </Bar>
                    <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.7)' }} axisLine={false} tickLine={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Action button */}
            <Link
              href={ins.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'white', fontSize: '12px', fontWeight: 700,
                textDecoration: 'none', transition: 'all 0.15s',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
            >
              {ins.action}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  DAILY MOTIVATION (original — kept intact)
// ═══════════════════════════════════════════════════════════

interface DailyQuote {
  quote: string;
  author: string;
  updatedBy: string;
  updatedAt: string;
}

function DailyMotivation() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [quoteData, setQuoteData]   = useState<DailyQuote | null>(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [editQuote, setEditQuote]   = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/quote')
      .then((r) => r.json())
      .then((d) => { setQuoteData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = () => {
    if (!quoteData) return;
    setEditQuote(quoteData.quote);
    setEditAuthor(quoteData.author);
    setSaveError(null);
    setEditing(true);
  };
  const cancel = () => { setEditing(false); setSaveError(null); };

  const save = async () => {
    if (!editQuote.trim() || !editAuthor.trim()) { setSaveError('Quote and author cannot be empty.'); return; }
    setSaving(true); setSaveError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: editQuote, author: editAuthor }),
      });
      if (!res.ok) { const err = await res.json(); setSaveError(err.error ?? 'Failed to save.'); setSaving(false); return; }
      setQuoteData(await res.json());
      setEditing(false);
    } catch { setSaveError('Network error. Please try again.'); }
    setSaving(false);
  };

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: '14px', boxShadow: T.shadowCard, overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Quote size={14} color="var(--accent-primary)" />
          <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Daily Motivation</p>
        </div>
        {isAdmin && !editing && (
          <button
            onClick={startEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
              color: T.textSec, background: T.input, border: `1px solid ${T.borderHover}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <Pencil size={10} /> Edit Quote
          </button>
        )}
      </div>
      <div style={{ padding: '20px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textMuted, fontSize: '13px' }}>
            <span style={spinner} /> Loading quote…
          </div>
        ) : editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ ...labelCss, marginBottom: '5px', display: 'block' }}>Quote</label>
              <textarea
                autoFocus value={editQuote}
                onChange={(e) => { setEditQuote(e.target.value); setSaveError(null); }}
                rows={3}
                style={{
                  ...inputCss, width: '100%', resize: 'vertical', padding: '10px 12px',
                  fontStyle: 'italic', fontSize: '14px', lineHeight: 1.6,
                  border: `1.5px solid ${saveError ? 'var(--accent-red)' : 'var(--accent-primary)'}`,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ ...labelCss, marginBottom: '5px', display: 'block' }}>Author</label>
              <input
                value={editAuthor}
                onChange={(e) => { setEditAuthor(e.target.value); setSaveError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
                style={{ ...inputCss, width: '100%', height: '36px', padding: '0 12px', boxSizing: 'border-box' }}
              />
            </div>
            {saveError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AlertErr size={12} color="var(--accent-red)" />
                <p style={{ fontSize: '12px', color: 'var(--accent-red)' }}>{saveError}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px', border: 'none', background: T.gradient, color: 'white', fontWeight: 600, fontSize: '12px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                {saving ? <span style={spinner} /> : <Check size={12} />} {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={cancel} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: `1px solid ${T.border}`, background: T.input, color: T.textSec, fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : quoteData ? (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Quote size={16} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '15px', fontStyle: 'italic', lineHeight: 1.65, color: T.text, fontWeight: 500, marginBottom: '10px' }}>
                &ldquo;{quoteData.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>— {quoteData.author}</p>
                <p style={{ fontSize: '11px', color: T.textMuted }}>
                  Updated by {quoteData.updatedBy} · {new Date(quoteData.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: T.textMuted }}>No quote available.</p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PROFILE CARD (original — kept intact)
// ═══════════════════════════════════════════════════════════

type FieldKey = 'name' | 'nic' | 'payId' | 'email' | 'contact' | 'srNumber';
interface FieldDef { key: FieldKey; label: string; adminOnly: boolean; readOnly?: boolean; type?: string; verify?: (v: string) => string | null; }

const FIELDS: FieldDef[] = [
  { key: 'name',     label: 'Full Name',     adminOnly: false, verify: (v) => v.trim().length < 2 ? 'Name too short' : null },
  { key: 'nic',      label: 'NIC Number',    adminOnly: false, verify: (v) => /^[0-9]{9}[VvXx]$/.test(v) || /^[0-9]{12}$/.test(v) ? null : 'Invalid NIC format' },
  { key: 'payId',    label: 'Pay ID',        adminOnly: false, verify: (v) => /^[0-9]+$/.test(v.trim()) ? null : 'Pay ID must be numeric' },
  { key: 'email',    label: 'Email Address', adminOnly: false, type: 'email', verify: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email format' },
  { key: 'contact',  label: 'Mobile Number', adminOnly: false, type: 'tel',   verify: (v) => /^0[0-9]{9}$/.test(v) ? null : '10 digits starting with 0' },
  { key: 'srNumber', label: 'SR Number',     adminOnly: true,  verify: (v) => /^SR[0-9]+$/.test(v) ? null : 'Format: SR followed by digits' },
];
const MOCK_PROFILE: Record<FieldKey, string> = { name: 'Support Agent', nic: '921622503V', payId: '201824', email: 'admin@skilllift.lk', contact: '0712345678', srNumber: 'SR000001' };

function ProfileCard() {
  const { addToast } = useToast();
  const { data: session } = useSession();
  const sessionRoleRaw = session?.user?.role ?? null;
  const role: UserRole = sessionRoleRaw ? (sessionRoleRaw.charAt(0).toUpperCase() + sessionRoleRaw.slice(1)) as UserRole : 'Staff';
  const isAdmin = sessionRoleRaw === 'admin';
  const [values, setValues]     = useState<Record<FieldKey, string>>(MOCK_PROFILE);
  const [editKey, setEditKey]   = useState<FieldKey | null>(null);
  const [editVal, setEditVal]   = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [savedKey, setSavedKey] = useState<FieldKey | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setValues((prev) => ({ ...prev, name: session.user!.name ?? prev.name, email: session.user!.email ?? prev.email }));
    }
  }, [session]);

  const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
    Admin:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
    Teacher: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)'  },
    Staff:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)'  },
  };
  const rc = ROLE_COLORS[role] ?? ROLE_COLORS.Staff;

  const startEdit = (f: FieldDef) => { if (f.adminOnly && !isAdmin) return; setEditKey(f.key); setEditVal(values[f.key]); setError(null); };
  const cancel    = () => { setEditKey(null); setError(null); };
  const save = async (f: FieldDef) => {
    const err = f.verify?.(editVal) ?? null;
    if (err) { setError(err); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setValues((p) => ({ ...p, [f.key]: editVal }));
    setSaving(false); setEditKey(null);
    setSavedKey(f.key);
    setTimeout(() => setSavedKey(null), 2500);
    addToast(`${f.label} updated successfully`);
  };

  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {session?.user?.image && !imgError ? (
            <img src={session.user.image} alt={values.name} onError={() => setImgError(true)} style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', display: 'block', flexShrink: 0, boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }} />
          ) : (
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: T.gradient, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }}>{getInitials(values.name)}</div>
          )}
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: T.text }}>{values.name}</p>
            <span style={{ fontSize: '11px', fontWeight: 700, color: rc.color, background: rc.bg, padding: '2px 8px', borderRadius: '5px' }}>{role}</span>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: T.textMuted }}>Click <Pencil size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> to edit</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {FIELDS.map((f, idx) => {
          const isEditing = editKey === f.key;
          const locked    = f.adminOnly && !isAdmin;
          const isSaved   = savedKey === f.key;
          const colSpan   = idx === FIELDS.length - 1 && FIELDS.length % 2 !== 0;
          return (
            <div key={f.key} style={{ padding: '14px 20px', borderBottom: idx < FIELDS.length - 2 ? `1px solid ${T.border}` : 'none', borderRight: idx % 2 === 0 ? `1px solid ${T.border}` : 'none', gridColumn: colSpan ? 'span 2' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ ...labelCss, marginBottom: 0 }}>{f.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {f.adminOnly && (<span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', color: 'var(--accent-purple)', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', gap: '3px', textTransform: 'uppercase' }}><Lock size={8} /> Admin</span>)}
                  {f.key === 'email' && !isEditing && (<span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', color: 'var(--accent-green)', background: 'rgba(16,185,129,0.1)' }}>Verified</span>)}
                </div>
              </div>
              {isEditing ? (
                <div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input autoFocus type={f.type ?? 'text'} value={editVal} onChange={(e) => { setEditVal(e.target.value); setError(null); }} onKeyDown={(e) => { if (e.key === 'Enter') save(f); if (e.key === 'Escape') cancel(); }} style={{ ...inputCss, height: '34px', padding: '0 10px', border: `1.5px solid ${error ? 'var(--accent-red)' : 'var(--accent-primary)'}`, boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(59,130,246,0.12)' }} />
                    <button onClick={() => save(f)} disabled={saving} style={{ width: '34px', height: '34px', borderRadius: T.radiusSm, border: 'none', background: T.gradient, color: 'white', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(59,130,246,0.3)', opacity: saving ? 0.7 : 1 }}>{saving ? <span style={spinner} /> : <Check size={13} />}</button>
                    <button onClick={cancel} style={{ width: '34px', height: '34px', borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.input, color: T.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={13} /></button>
                  </div>
                  {error && (<div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}><AlertErr size={11} color="var(--accent-red)" /><p style={{ fontSize: '11px', color: 'var(--accent-red)' }}>{error}</p></div>)}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: T.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{values[f.key] || '—'}</p>
                    {isSaved && (<span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, flexShrink: 0 }}><Check size={11} color="var(--accent-green)" /> Saved</span>)}
                  </div>
                  <button onClick={() => startEdit(f)} disabled={locked || !!editKey} title={locked ? 'Admin only' : `Edit ${f.label}`} style={{ width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0, background: locked ? 'transparent' : T.input, border: `1px solid ${locked ? T.border : T.borderHover}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked || !!editKey ? 'not-allowed' : 'pointer', color: locked ? T.textMuted : T.textSec, opacity: !!editKey && !isEditing ? 0.3 : 1, transition: 'all 0.15s' }}>
                    {locked ? <Lock size={11} /> : <Pencil size={11} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════

export default function DashboardPage() {
  const { data: session } = useSession();
  const sessionRoleRaw = session?.user?.role ?? null;
  const isAdmin   = sessionRoleRaw === 'admin';
  const canManage = isAdmin || sessionRoleRaw === 'teacher';

  const quickActions = [
    { label: 'Reset Student Password', href: '/dashboard/admin/students', icon: KeyRound,  show: isAdmin,   gradient: 'linear-gradient(135deg, #ef4444, #f59e0b)' },
    { label: 'Manage Zoom Classes',    href: '/dashboard/zoom-classes',   icon: Video,     show: canManage, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { label: 'View Reports',           href: '/dashboard/reports',        icon: BarChart2, show: true,      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  ].filter((a) => a.show);

  return (
    <div className="page-padding dash-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── 1. Stats Row ── */}
      <div className="fade-up" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
        <StatsRow />
      </div>

      {/* ── 2. Analytics ── */}
      <div className="fade-up" style={{ animationDelay: '0.08s', animationFillMode: 'both' }}>
        <SectionHeader
          title="Smart Analytics"
          icon={<BarChart2 size={14} color="#0d9488" />}
        />
        <div className="analytics-grid">
          <GrowthChart />
          <PaymentDonut />
          <CourseBreakdown />
        </div>
      </div>

      {/* ── 3. Alerts + Live Feed ── */}
      <div className="fade-up alerts-feed-grid" style={{ animationDelay: '0.16s', animationFillMode: 'both' }}>
        <AlertsPanel />
        <LiveFeed />
      </div>

      {/* ── 4. AI Insights ── */}
      <div className="fade-up" style={{ animationDelay: '0.22s', animationFillMode: 'both' }}>
        <AIInsights />
      </div>

      {/* ── 5. Daily Motivation ── */}
      <div className="fade-up" style={{ animationDelay: '0.28s', animationFillMode: 'both' }}>
        <DailyMotivation />
      </div>

      {/* ── 6. Profile Card ── */}
      <div className="fade-up" style={{ animationDelay: '0.32s', animationFillMode: 'both' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: T.textSec, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Pencil size={13} color="var(--accent-primary)" /> My Profile
        </p>
        <ProfileCard />
      </div>

      {/* ── 7. Quick Actions ── */}
      {quickActions.length > 0 && (
        <div className="fade-up" style={{ animationDelay: '0.36s', animationFillMode: 'both' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: T.textSec, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} color="var(--accent-primary)" /> Quick Actions
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href} href={a.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 22px', borderRadius: '12px', background: T.card, border: `1px solid ${T.border}`, textDecoration: 'none', transition: 'all 0.2s ease', boxShadow: T.shadowCard }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.borderColor = T.borderHover; el.style.boxShadow = T.shadow; el.style.background = T.cardHover; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = T.border; el.style.boxShadow = T.shadowCard; el.style.background = T.card; }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: a.gradient, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <Icon size={16} color="white" />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{a.label}</p>
                  <ArrowUpRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
