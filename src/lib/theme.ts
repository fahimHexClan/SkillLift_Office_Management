// ─── Design tokens — CSS variable references ─────────────────────────────────
// All values map to CSS custom properties defined in globals.css.
// Both light and dark themes are handled via :root and .dark selectors.
export const T = {
  // Backgrounds
  bg:          'var(--bg-primary)',
  bgSec:       'var(--bg-secondary)',
  sidebar:     'var(--sidebar-bg)',
  card:        'var(--bg-card)',
  cardHover:   'var(--bg-hover)',
  input:       'var(--bg-input)',
  elevated:    'var(--bg-elevated)',

  // Borders
  border:      'var(--border)',
  borderHover: 'var(--border-hover)',
  borderCyan:  'rgba(59,130,246,0.25)',

  // Text
  text:        'var(--text-primary)',
  textSec:     'var(--text-secondary)',
  textMuted:   'var(--text-muted)',

  // Accents
  blue:        'var(--accent-primary)',
  blueLight:   'var(--accent-primary)',
  cyan:        'var(--accent-secondary)',
  cyanLight:   'var(--accent-secondary)',
  purple:      'var(--accent-purple)',
  green:       'var(--accent-green)',
  orange:      'var(--accent-orange)',
  red:         'var(--accent-red)',

  // Gradients
  gradient:    'var(--gradient-main)',
  gradientH:   'var(--gradient-main)',
  gradientPurple: 'var(--gradient-purple)',
  gradientGreen:  'var(--gradient-green)',
  gradientOrange: 'var(--gradient-orange)',

  // Shadows
  shadow:      'var(--shadow-md)',
  shadowCard:  'var(--shadow-sm)',
  shadowLg:    'var(--shadow-lg)',
  shadowGlow:  'var(--shadow-glow)',

  // Radii
  radius:   '12px',
  radiusSm: '8px',
  radiusLg: '16px',
  radiusXl: '20px',
} as const;

// ─── Reusable CSSProperties objects ──────────────────────────────────────────
export const card: React.CSSProperties = {
  background:   'var(--bg-card)',
  borderRadius: T.radius,
  border:       '1px solid var(--border)',
  boxShadow:    'var(--shadow-sm)',
  overflow:     'hidden',
};

export const inputCss: React.CSSProperties = {
  width:        '100%',
  padding:      '10px 14px',
  background:   'var(--bg-input)',
  border:       '1px solid var(--border)',
  borderRadius: T.radiusSm,
  fontSize:     '13px',
  color:        'var(--text-primary)',
  fontFamily:   "'Inter', sans-serif",
  outline:      'none',
  transition:   'border-color 0.15s, box-shadow 0.15s',
};

export const labelCss: React.CSSProperties = {
  fontSize:      '11px',
  fontWeight:    600,
  color:         'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom:  '6px',
  display:       'block',
};

export const btnPrimary: React.CSSProperties = {
  display:      'flex',
  alignItems:   'center',
  gap:          '8px',
  padding:      '9px 20px',
  borderRadius: T.radiusSm,
  fontSize:     '13px',
  fontWeight:   600,
  background:   'var(--gradient-main)',
  border:       'none',
  color:        'white',
  cursor:       'pointer',
  fontFamily:   "'Inter', sans-serif",
  boxShadow:    '0 4px 12px rgba(59,130,246,0.3)',
  transition:   'all 0.2s',
};

export const btnGhost: React.CSSProperties = {
  display:      'flex',
  alignItems:   'center',
  gap:          '8px',
  padding:      '9px 18px',
  borderRadius: T.radiusSm,
  fontSize:     '13px',
  fontWeight:   500,
  background:   'var(--bg-card)',
  border:       '1px solid var(--border)',
  color:        'var(--text-primary)',
  cursor:       'pointer',
  fontFamily:   "'Inter', sans-serif",
  transition:   'all 0.2s',
};

export const spinner: React.CSSProperties = {
  width:          '14px',
  height:         '14px',
  border:         '2px solid rgba(255,255,255,0.3)',
  borderTopColor: 'white',
  borderRadius:   '50%',
  display:        'inline-block',
  animation:      'spin 0.7s linear infinite',
};
