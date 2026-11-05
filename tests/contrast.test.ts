import { describe, expect, it } from 'vitest';
import { coreColors, semanticColors, siteBackgrounds, siteColors } from '../src';

function luminance({ hex }: { hex: string }): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast({ foreground, background }: { foreground: string; background: string }) {
  const [light, dark] = [luminance({ hex: foreground }), luminance({ hex: background })].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const AA_TEXT = 4.5;

describe('contraste WCAG AA (texto normal, 4,5:1)', () => {
  const pairs = [
    ['foreground', 'background'],
    ['card-foreground', 'card'],
    ['primary-foreground', 'primary'],
    ['primary-foreground', 'primary-hover'],
    ['secondary-foreground', 'secondary'],
    ['muted-foreground', 'muted'],
    ['muted-foreground', 'background'],
    // Campos têm fundo branco (`color.white` = `card`); desabilitados, `muted`.
    ['placeholder', 'card'],
    ['placeholder', 'background'],
    ['placeholder', 'muted'],
    ['accent-foreground', 'accent'],
    ['destructive-foreground', 'destructive'],
    ['destructive-foreground', 'destructive-hover'],
  ] as const;

  it.each(pairs)('%s sobre %s', (foreground, background) => {
    expect(
      contrast({
        foreground: semanticColors[foreground],
        background: semanticColors[background],
      }),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(['success', 'warning', 'danger', 'info'] as const)('%s.text sobre %s.tint', (name) => {
    const { text, tint } = coreColors[name];
    expect(contrast({ foreground: text, background: tint })).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(Object.entries(siteColors))('site: paleta %s', (_name, palette) => {
    expect(
      contrast({ foreground: palette.primaryForeground, background: palette.primary }),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(Object.entries(siteBackgrounds))('site: fundo %s', (_name, values) => {
    for (const foreground of [values.foreground, values.mutedForeground]) {
      for (const background of [values.background, values.surface]) {
        expect(contrast({ foreground, background })).toBeGreaterThanOrEqual(AA_TEXT);
      }
    }
  });

  it('placeholder usa o cinza mais claro da escala que passa no campo (decisão 132)', () => {
    const lighterGrays = (['500', '600'] as const).map((step) => coreColors.gray[step]);
    for (const gray of lighterGrays) {
      expect(contrast({ foreground: gray, background: semanticColors.card })).toBeLessThan(AA_TEXT);
    }
    expect(semanticColors.placeholder).toBe(coreColors.gray[700]);
  });
});
