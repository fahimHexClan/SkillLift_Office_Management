'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);

  const handleToggle = () => {
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 400);
  };

  return (
    <button
      onClick={handleToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '9px',
        background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
        border: isDark ? '1px solid rgba(148,163,184,0.12)' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isDark ? '#94a3b8' : '#64748b',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        // Override global transition for instant feel
        transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = isDark ? 'rgba(59,130,246,0.15)' : '#e2e8f0';
        el.style.color = isDark ? '#60a5fa' : '#2563eb';
        el.style.borderColor = isDark ? 'rgba(59,130,246,0.3)' : '#cbd5e1';
        el.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
        el.style.color = isDark ? '#94a3b8' : '#64748b';
        el.style.borderColor = isDark ? 'rgba(148,163,184,0.12)' : '#e2e8f0';
        el.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: spinning ? 'iconSpin 0.4s ease forwards' : 'none',
        }}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </span>
    </button>
  );
}
