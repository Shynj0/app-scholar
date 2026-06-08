// ─── Paleta de Cores ──────────────────────────────────────────────────────────
export const colors = {
  primary:   '#1a237e',   // Azul escuro — institucional
  primaryLight: '#534bae',
  secondary: '#0288d1',   // Azul claro
  accent:    '#ff6f00',   // Laranja
  success:   '#2e7d32',   // Verde
  warning:   '#f57c00',   // Laranja aviso
  danger:    '#c62828',   // Vermelho
  background:'#f4f6fb',
  surface:   '#ffffff',
  border:    '#e0e4ef',
  text: {
    primary:   '#1a1c2e',
    secondary: '#6b7280',
    light:     '#ffffff',
    placeholder: '#9ca3af',
  },
  gray: {
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#374151',
    800: '#1f2937',
  },
  situacao: {
    Aprovado:  '#2e7d32',
    Reprovado: '#c62828',
    Cursando:  '#f57c00',
  },
} as const;

// ─── Espaçamentos ─────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// ─── Bordas ───────────────────────────────────────────────────────────────────
export const radius = {
  sm:    4,
  md:    8,
  lg:    12,
  xl:    20,
  round: 999,
} as const;

// ─── Tipografia ───────────────────────────────────────────────────────────────
export const fontSize = {
  xs:   10,
  sm:   12,
  md:   14,
  base: 15,
  lg:   16,
  xl:   18,
  xxl:  22,
  xxxl: 28,
  hero: 36,
} as const;

// ─── Sombras ──────────────────────────────────────────────────────────────────
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
