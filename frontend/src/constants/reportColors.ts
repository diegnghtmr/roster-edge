// Professional color palette for RosterEdge Reports
// Designed for sports team management with accessibility and professionalism in mind

export const REPORT_COLORS = {
  // Primary Brand Colors (RED - RosterEdge Brand)
  primary: {
    main: '#dc2626', // Red 600 - Main brand color
    light: '#ef4444', // Red 500 - Lighter accent
    dark: '#b91c1c', // Red 700 - Darker accent
    extraLight: '#f87171', // Red 400 - Active states
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  },

  // Secondary Colors
  secondary: {
    main: '#059669', // Green
    light: '#10b981', // Light Green
    dark: '#047857', // Dark Green
  },

  // Accent Colors for Charts (Red-based palette with complementary colors)
  chart: {
    red: '#dc2626', // Red 600 - Primary chart color
    rose: '#f43f5e', // Rose 500 - Complementary
    orange: '#f97316', // Orange 500
    amber: '#f59e0b', // Amber 500
    yellow: '#eab308', // Yellow 500
    lime: '#84cc16', // Lime 500
    green: '#10b981', // Green 500
    emerald: '#059669', // Emerald 600
    teal: '#14b8a6', // Teal 500
    cyan: '#06b6d4', // Cyan 500
    blue: '#3b82f6', // Blue 500
    indigo: '#6366f1', // Indigo 500
    purple: '#a855f7', // Purple 500
    pink: '#ec4899', // Pink 500
    slate: '#64748b', // Slate 500
    crimson: '#b91c1c', // Red 700 - Dark accent
  },

  // Gradient combinations for charts (Red-focused)
  gradients: {
    redToOrange: ['#dc2626', '#f97316'],
    redToRose: ['#dc2626', '#f43f5e'],
    warmSpectrum: ['#dc2626', '#f97316', '#eab308'],
    coolSpectrum: ['#06b6d4', '#3b82f6', '#6366f1'],
    greenToTeal: ['#10b981', '#14b8a6'],
    purpleToIndigo: ['#a855f7', '#6366f1'],
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    black: '#000000',
  },

  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // PDF Specific Colors (Red theme)
  pdf: {
    background: '#ffffff',
    headerBg: '#dc2626', // Red 600
    headerText: '#ffffff',
    sectionBg: '#fef2f2', // Red 50 - Very light red background
    cardBg: '#ffffff',
    cardBorder: '#fecaca', // Red 200
    tableBorder: '#fca5a5', // Red 300
    tableHeaderBg: '#dc2626', // Red 600
    tableHeaderText: '#ffffff',
    footerText: '#9ca3af',
    accentLine: '#ef4444', // Red 500
  },
};

// Chart color palettes for different report types (Red-focused)
export const CHART_PALETTES = {
  // Default palette for general charts (Red-based)
  default: [
    REPORT_COLORS.chart.red,
    REPORT_COLORS.chart.orange,
    REPORT_COLORS.chart.amber,
    REPORT_COLORS.chart.green,
    REPORT_COLORS.chart.teal,
    REPORT_COLORS.chart.blue,
    REPORT_COLORS.chart.purple,
    REPORT_COLORS.chart.pink,
  ],

  // Performance-focused palette (Green to Red)
  performance: [
    REPORT_COLORS.chart.green,
    REPORT_COLORS.chart.lime,
    REPORT_COLORS.chart.yellow,
    REPORT_COLORS.chart.orange,
    REPORT_COLORS.chart.red,
  ],

  // Team comparison palette (Red-focused with contrasts)
  comparison: [
    REPORT_COLORS.chart.red,
    REPORT_COLORS.chart.blue,
    REPORT_COLORS.chart.green,
    REPORT_COLORS.chart.orange,
    REPORT_COLORS.chart.purple,
    REPORT_COLORS.chart.teal,
  ],

  // Staff/Role palette (Warm tones)
  roles: [
    REPORT_COLORS.chart.red,
    REPORT_COLORS.chart.rose,
    REPORT_COLORS.chart.orange,
    REPORT_COLORS.chart.amber,
    REPORT_COLORS.chart.yellow,
    REPORT_COLORS.chart.pink,
  ],

  // Temporal/Progress palette (Red gradient)
  temporal: [
    REPORT_COLORS.chart.crimson,
    REPORT_COLORS.chart.red,
    REPORT_COLORS.chart.rose,
    REPORT_COLORS.chart.orange,
  ],

  // Statistical palette (Red to neutral tones)
  statistical: [
    REPORT_COLORS.chart.red,
    REPORT_COLORS.chart.rose,
    REPORT_COLORS.chart.slate,
    REPORT_COLORS.chart.indigo,
  ],
};

// Typography styles for PDFs
export const PDF_TYPOGRAPHY = {
  fontFamily: {
    primary: 'Helvetica',
    bold: 'Helvetica-Bold',
    oblique: 'Helvetica-Oblique',
  },
  fontSize: {
    h1: 24,
    h2: 20,
    h3: 16,
    h4: 14,
    body: 12,
    small: 10,
    tiny: 8,
  },
  fontWeight: {
    normal: 'normal' as const,
    bold: 'bold' as const,
  },
};

// Spacing constants
export const PDF_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Border radius
export const PDF_RADIUS = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

// Shadow styles (for web components)
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
