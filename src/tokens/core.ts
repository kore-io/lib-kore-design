/**
 * Conjunto `Kore/Core` do Design System no Penpot (DS v0.16, 02/11/2026).
 * Valores copiados do Penpot; os nomes seguem o token, com `.` virando chave.
 */
export const coreColors = {
  primary: {
    base: '#9B3552',
    dark: '#74233D',
    darker: '#5C1A30',
    tint: '#F6E6EB',
  },
  accent: {
    base: '#B8925A',
    tint: '#F5EDE0',
  },
  ink: '#241A1E',
  paper: '#FCFAF7',
  white: '#FFFFFF',
  gray: {
    100: '#F4EFEF',
    300: '#E3D9DB',
    500: '#9A8E91',
    600: '#8C7F83',
    700: '#5C5055',
  },
  success: {
    base: '#2E9E6B',
    text: '#1E6B48',
    tint: '#E4F4EC',
  },
  warning: {
    base: '#E8A13A',
    text: '#8A5A12',
    tint: '#FCF1DE',
  },
  danger: {
    base: '#D9534F',
    text: '#A12F2B',
    tint: '#FBE9E8',
    darker: '#85231F',
  },
  info: {
    base: '#3D7FD9',
    text: '#1F5596',
    tint: '#E6EFFB',
  },
} as const;

export type CoreColors = typeof coreColors;
