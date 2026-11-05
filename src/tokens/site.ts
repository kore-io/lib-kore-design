import { coreColors } from './core';

/**
 * Aparência do site do casal (DS v0.16): três eixos independentes, cada um um
 * grupo de temas no Penpot (`Aparência · Fontes`, `· Cores`, `· Fundo`).
 * O padrão de cada eixo é o tema ativo no Penpot.
 */
export const siteFonts = {
  romantico: { label: 'Romântico', display: 'Cormorant Garamond', body: 'Lato' },
  classico: { label: 'Clássico', display: 'Playfair Display', body: 'Source Sans 3' },
  leve: { label: 'Leve', display: 'Josefin Sans', body: 'Nunito Sans' },
  moderno: { label: 'Moderno', display: 'DM Serif Display', body: 'Inter' },
} as const;

export const siteColors = {
  terracota: {
    label: 'Terracota',
    primary: '#A94F37',
    primaryForeground: '#FFFFFF',
    accent: '#7A8B69',
  },
  salvia: { label: 'Sálvia', primary: '#566C4B', primaryForeground: '#FFFFFF', accent: '#C9A66B' },
  rose: { label: 'Rosé', primary: '#A3545E', primaryForeground: '#FFFFFF', accent: '#8C9A7E' },
  marfim: { label: 'Marfim', primary: '#7D6036', primaryForeground: '#FFFFFF', accent: '#1F2A44' },
  marinho: {
    label: 'Marinho',
    primary: '#1F2A44',
    primaryForeground: '#FFFFFF',
    accent: '#B08D57',
  },
  areia: { label: 'Areia', primary: '#2F6F7E', primaryForeground: '#FFFFFF', accent: '#D9A06B' },
  'por-do-sol': {
    label: 'Pôr do sol',
    primary: '#B24F34',
    primaryForeground: '#FFFFFF',
    accent: '#2F6F7E',
  },
  grafite: {
    label: 'Grafite',
    primary: '#222222',
    primaryForeground: '#FFFFFF',
    accent: '#9A8C7A',
  },
  noite: { label: 'Noite', primary: '#E7D3B0', primaryForeground: '#15171C', accent: '#9A8C7A' },
} as const;

export const siteBackgrounds = {
  claro: {
    label: 'Claro',
    background: '#FFFFFF',
    surface: '#F5F5F4',
    foreground: '#1F1F1F',
    mutedForeground: '#5E5E5B',
    border: '#E4E4E1',
    koreSeal: coreColors.primary.dark,
  },
  creme: {
    label: 'Creme',
    background: '#FBF7F2',
    surface: '#FFFFFF',
    foreground: '#2E2A26',
    mutedForeground: '#6B6159',
    border: '#E8DFD4',
    koreSeal: coreColors.primary.dark,
  },
  escuro: {
    label: 'Escuro',
    background: '#15171C',
    surface: '#1E2128',
    foreground: '#F2F0EC',
    mutedForeground: '#A9A59E',
    border: '#353944',
    koreSeal: coreColors.primary.tint,
  },
} as const;

export type SiteFontsName = keyof typeof siteFonts;
export type SiteColorsName = keyof typeof siteColors;
export type SiteBackgroundName = keyof typeof siteBackgrounds;

export const siteDefaults = {
  fonts: 'romantico',
  colors: 'terracota',
  background: 'creme',
} as const satisfies {
  fonts: SiteFontsName;
  colors: SiteColorsName;
  background: SiteBackgroundName;
};

/** Atributos HTML que trocam a aparência do site (ex.: `<html data-site-colors="salvia">`). */
export const siteDataAttributes = {
  fonts: 'data-site-fonts',
  colors: 'data-site-colors',
  background: 'data-site-background',
} as const;
