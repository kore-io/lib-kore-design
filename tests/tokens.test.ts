import { describe, expect, it } from 'vitest';
import penpot from './fixtures/penpot-ds-v0.16.json';
import {
  coreColors,
  fractionalBorderWidths,
  fontFamilies,
  fontWeights,
  motion,
  motionAnimations,
  motionDistance,
  overlayColor,
  radius,
  resolveCoreColor,
  semanticColorRefs,
  shadows,
  siteBackgrounds,
  siteColors,
  siteDefaults,
  siteFonts,
  spacing,
  typeStyles,
} from '../src';

const PENPOT_REF = /^\{color\.(.+)\}$/;

/** Divergências aceitas em relação ao Penpot, com o valor do Penpot e o motivo. */
const SEMANTIC_DIVERGENCES: Record<string, { penpot: string; code: string; reason: string }> = {
  placeholder: {
    penpot: 'gray.500',
    code: 'gray.700',
    reason: 'decisão 132: placeholder com 4,5:1 (WCAG 1.4.3)',
  },
};

function penpotRefToPath({ ref }: { ref: string }): string {
  const match = PENPOT_REF.exec(ref);
  if (!match?.[1]) throw new Error(`Referência inválida: ${ref}`);
  return match[1];
}

/** `type.display.xl` → `display-xl`; `type.label-lg` → `label-lg`. */
function typeKey({ token }: { token: string }): string {
  return token.replace(/^type\./, '').replace('.', '-');
}

const siteLabels = (record: Record<string, { label: string }>) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [value.label, key]));

describe('tokens espelham o Design System v0.16 do Penpot', () => {
  it('cores do core (Kore/Core, sem os swatches do site)', () => {
    for (const [token, hex] of Object.entries(penpot['Kore/Core'])) {
      if (!token.startsWith('color.')) continue;
      expect(resolveCoreColor({ path: token.replace(/^color\./, '') }), token).toBe(hex);
    }
  });

  it('o core não tem cor que não exista no Penpot', () => {
    const count = (node: object): number =>
      Object.values(node).reduce<number>(
        (total, value) => total + (typeof value === 'object' ? count(value) : 1),
        0,
      );
    const penpotColors = Object.keys(penpot['Kore/Core']).filter((t) => t.startsWith('color.'));
    expect(count(coreColors)).toBe(penpotColors.length);
  });

  it('semânticos apontam para os mesmos tokens do core', () => {
    const { 'color.overlay': overlay, ...refs } = penpot['Kore/Semantic'];
    expect(Object.keys(semanticColorRefs).sort()).toEqual(Object.keys(refs).sort());
    for (const [name, ref] of Object.entries(refs)) {
      const divergence = SEMANTIC_DIVERGENCES[name];
      expect(penpotRefToPath({ ref }), name).toBe(divergence?.penpot ?? penpotRefToPath({ ref }));
      expect(semanticColorRefs[name as keyof typeof semanticColorRefs], name).toBe(
        divergence?.code ?? penpotRefToPath({ ref }),
      );
    }
    expect(overlayColor).toBe(overlay);
  });

  it('famílias, pesos e estilos de texto', () => {
    const typography = penpot['Kore/Typography'];
    expect(fontFamilies.display[0]).toBe(typography['font.display']);
    expect(fontFamilies.body[0]).toBe(typography['font.body']);
    expect(String(fontWeights.regular)).toBe(typography['weight.regular']);
    expect(String(fontWeights.semibold)).toBe(typography['weight.semibold']);
    expect(String(fontWeights.bold)).toBe(typography['weight.bold']);

    const penpotStyles = Object.entries(typography).filter(([token]) => token.startsWith('type.'));
    expect(Object.keys(typeStyles).sort()).toEqual(
      penpotStyles.map(([token]) => typeKey({ token })).sort(),
    );
    for (const [token, value] of penpotStyles) {
      const style = typeStyles[typeKey({ token }) as keyof typeof typeStyles];
      const expected = value as {
        font: string;
        size: number;
        weight: string;
        lineHeight: number;
        letterSpacing: number;
        textCase?: string;
        textDecoration?: string;
      };
      expect(style, token).toMatchObject({
        fontFamily: expected.font,
        fontSize: expected.size,
        fontWeight: expected.weight,
        lineHeight: expected.lineHeight,
      });
      // O código usa em (Brand Kit); o Penpot, px. Tolerância de 0,05 px.
      expect(style.letterSpacing * style.fontSize, token).toBeCloseTo(expected.letterSpacing, 1);
      expect('textTransform' in style ? style.textTransform : undefined, token).toBe(
        expected.textCase,
      );
      expect('textDecoration' in style ? style.textDecoration : undefined, token).toBe(
        expected.textDecoration,
      );
    }
  });

  it('espaçamento, raio e movimento', () => {
    expect(
      Object.fromEntries(Object.entries(spacing).map(([step, px]) => [`space.${step}`, px])),
    ).toEqual(penpot['Kore/Spacing']);
    expect(
      Object.fromEntries(Object.entries(radius).map(([name, px]) => [`radius.${name}`, px])),
    ).toEqual(penpot['Kore/Radius']);
    expect({
      'motion.fast': motion.fast,
      'motion.base': motion.base,
      'motion.slow': motion.slow,
      'motion.distance': motionDistance,
    }).toEqual(penpot['Kore/Motion']);
  });

  it('bordas fracionárias dos componentes viram utilitárias do preset (decisão 140)', () => {
    const penpotWidths = Object.keys(
      penpot['Bordas fracionárias dos componentes (fora de ícones)'],
    ).map(Number);
    expect([...fractionalBorderWidths]).toEqual(penpotWidths);
  });

  it('animações seguem os padrões da página de Motion', () => {
    const patterns = penpot['02 · Motion (padrões)'];
    expect(patterns['Drawer (Sidebar no celular e no tablet)']).toContain('motion.slow');
    expect(motionAnimations['drawer-in']).toEqual({ keyframes: 'slide-in-left', duration: 'slow' });
    expect(motionAnimations['overlay-in'].duration).toBe('slow');
    // Sair: um passo abaixo (slow → base).
    expect(motionAnimations['drawer-out']).toEqual({
      keyframes: 'slide-out-left',
      duration: 'base',
    });
    expect(motionAnimations['overlay-out'].duration).toBe('base');
    expect(patterns['Movimento reduzido']).toContain('motion.base');
    expect(motionAnimations['reduced-in']).toEqual({ keyframes: 'fade-in', duration: 'base' });
    expect(motionAnimations['reduced-out']).toEqual({ keyframes: 'fade-out', duration: 'base' });
  });

  it('sombras', () => {
    expect(
      Object.keys(shadows).map((name) => (name === 'focus-ring' ? name : `shadow.${name}`)),
    ).toEqual(Object.keys(penpot['Kore/Shadow']));
    for (const [token, { x, y, blur, spread, color }] of Object.entries(penpot['Kore/Shadow'])) {
      const name = token.replace(/^shadow\./, '') as keyof typeof shadows;
      expect(shadows[name], token).toEqual({
        offsetX: x,
        offsetY: y,
        blur,
        spread,
        color: PENPOT_REF.test(color)
          ? resolveCoreColor({ path: penpotRefToPath({ ref: color }) })
          : color.replaceAll(',', ', '),
      });
    }
  });

  it('aparência do site: fontes, cores, fundos e padrões', () => {
    const fontKeys = siteLabels(siteFonts);
    expect(Object.keys(siteFonts)).toHaveLength(Object.keys(penpot['Site/Fontes']).length);
    for (const [label, fonts] of Object.entries(penpot['Site/Fontes'])) {
      const key = fontKeys[label] as keyof typeof siteFonts;
      expect(siteFonts[key], label).toMatchObject(fonts);
    }

    const colorKeys = siteLabels(siteColors);
    expect(Object.keys(siteColors)).toHaveLength(Object.keys(penpot['Site/Cores']).length);
    for (const [label, colors] of Object.entries(penpot['Site/Cores'])) {
      const key = colorKeys[label] as keyof typeof siteColors;
      expect(siteColors[key], label).toMatchObject({
        primary: colors.primary,
        primaryForeground: colors['primary-foreground'],
        accent: colors.accent,
      });
      // Os swatches do seletor de tema (Kore/Core) repetem a paleta.
      const core = penpot['Kore/Core'] as Record<string, string>;
      expect(core[`site.swatch.${key}.primary`], label).toBe(colors.primary);
      expect(core[`site.swatch.${key}.accent`], label).toBe(colors.accent);
    }

    const backgroundKeys = siteLabels(siteBackgrounds);
    expect(Object.keys(siteBackgrounds)).toHaveLength(Object.keys(penpot['Site/Fundo']).length);
    for (const [label, values] of Object.entries(penpot['Site/Fundo'])) {
      const key = backgroundKeys[label] as keyof typeof siteBackgrounds;
      expect(siteBackgrounds[key], label).toMatchObject({
        background: values.background,
        surface: values.surface,
        foreground: values.foreground,
        mutedForeground: values['muted-foreground'],
        border: values.border,
        koreSeal: resolveCoreColor({ path: penpotRefToPath({ ref: values['kore-seal'] }) }),
      });
    }

    const defaults = penpot['Temas ativos (padrão)'];
    expect(siteDefaults).toEqual({
      fonts: fontKeys[defaults['Aparência · Fontes']],
      colors: colorKeys[defaults['Aparência · Cores']],
      background: backgroundKeys[defaults['Aparência · Fundo']],
    });
  });
});
