/**
 * Conjunto `Kore/Typography` (DS v0.16). Tamanhos em px, como no Penpot;
 * a saída CSS converte para rem. A altura de linha é a razão do Penpot e o
 * espaçamento entre letras é em em.
 */
export const fontFamilies = {
  display: ['Cormorant Garamond', 'Georgia', 'serif'],
  body: ['Nunito Sans', 'system-ui', 'sans-serif'],
} as const;

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
} as const;

export type FontFamilyName = keyof typeof fontFamilies;
export type FontWeightName = keyof typeof fontWeights;

export interface TypeStyle {
  fontFamily: FontFamilyName;
  /** px */
  fontSize: number;
  fontWeight: FontWeightName;
  lineHeight: number;
  /**
   * em, para escalar com o tamanho. O overline usa 0.08em do Brand Kit; o Penpot
   * guarda 0.9px (0.88px no tamanho 11), diferença aceita pelo orquestrador.
   */
  letterSpacing: number;
  textTransform?: 'uppercase';
  textDecoration?: 'underline';
}

/** Chave = token sem o prefixo `type.`, com `.` virando `-` (`type.display.xl` → `display-xl`). */
export const typeStyles = {
  'display-xl': {
    fontFamily: 'display',
    fontSize: 48,
    fontWeight: 'semibold',
    lineHeight: 1.083,
    letterSpacing: 0,
  },
  'display-lg': {
    fontFamily: 'display',
    fontSize: 36,
    fontWeight: 'semibold',
    lineHeight: 1.167,
    letterSpacing: 0,
  },
  'display-md': {
    fontFamily: 'display',
    fontSize: 28,
    fontWeight: 'semibold',
    lineHeight: 1.214,
    letterSpacing: 0,
  },
  'display-sm': {
    fontFamily: 'display',
    fontSize: 24,
    fontWeight: 'semibold',
    lineHeight: 1.25,
    letterSpacing: 0,
  },
  heading: {
    fontFamily: 'body',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 1.444,
    letterSpacing: 0,
  },
  'body-lg': {
    fontFamily: 'body',
    fontSize: 16,
    fontWeight: 'regular',
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  'body-md': {
    fontFamily: 'body',
    fontSize: 14,
    fontWeight: 'regular',
    lineHeight: 1.429,
    letterSpacing: 0,
  },
  label: {
    fontFamily: 'body',
    fontSize: 14,
    fontWeight: 'semibold',
    lineHeight: 1.429,
    letterSpacing: 0,
  },
  'label-lg': {
    fontFamily: 'body',
    fontSize: 16,
    fontWeight: 'semibold',
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'body',
    fontSize: 12,
    fontWeight: 'regular',
    lineHeight: 1.333,
    letterSpacing: 0,
  },
  overline: {
    fontFamily: 'body',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 1.455,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
  },
  number: {
    fontFamily: 'body',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 1.214,
    letterSpacing: 0,
  },
  link: {
    fontFamily: 'body',
    fontSize: 14,
    fontWeight: 'semibold',
    lineHeight: 1.429,
    letterSpacing: 0,
    textDecoration: 'underline',
  },
} as const satisfies Record<string, TypeStyle>;

export type TypeStyleName = keyof typeof typeStyles;
