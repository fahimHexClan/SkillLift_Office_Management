'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { T } from '@/lib/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem { id: number; message: string; type: ToastType; }

interface ToastCtx {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ addToast: () => {} });
export const useToast = () => useContext(ToastContext);

let _nextId = 0;

const TOAST_META: Record<ToastType, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  success: { icon: <CheckCircle2 size={16} />, color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
  error:   { icon: <XCircle      size={16} />, color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  warning: { icon: <AlertTriangle size={16}/>, color: '#ca8a04', bg: '#fef9c3', border: '#fde68a' },
  info:    { icon: <Info          size={16} />, color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
};

function ToastList({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px',
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => {
        const m = TOAST_META[t.type];
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: T.radius,
            background: '#ffffff', border: `1px solid ${m.border}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            animation: 'toastIn 0.3s ease forwards',
            pointerEvents: 'all', minWidth: '280px', maxWidth: '380px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: m.bg, color: m.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{m.icon}</div>
            <p style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: T.text, lineHeight: 1.4 }}>
              {t.message}
            </p>
            <button onClick={() => remove(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.textMuted, display: 'flex', padding: '2px', flexShrink: 0,
            }}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_nextId;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastList toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}
