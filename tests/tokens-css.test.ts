import { describe, expect, it } from 'vitest';
import { buildTokensCss, pxToRem } from '../src/css/tokens-css';
import { siteBackgrounds, siteColors, siteFonts } from '../src';

const css = buildTokensCss();

function rootBlock(): string {
  const match = /:root \{\n([\s\S]*?)\n\}/.exec(css);
  if (!match?.[1]) throw new Error(':root não encontrado');
  return match[1];
}

describe('tokens.css', () => {
  it('converte px em rem com base 16', () => {
    expect(pxToRem({ px: 16 })).toBe('1rem');
    expect(pxToRem({ px: 11 })).toBe('0.6875rem');
  });

  it('declara as variáveis do core, do semântico e o tema padrão do site no :root', () => {
    const root = rootBlock();
    expect(root).toContain('--kore-primary-dark: #74233D;');
    expect(root).toContain('--kore-gray-600: #8C7F83;');
    expect(root).toContain("--kore-font-display: 'Cormorant Garamond', 'Georgia', serif;");
    expect(root).toContain('--kore-size-display-xl: 3rem;');
    expect(root).toContain('--kore-leading-display-xl: 1.083;');
    expect(root).toContain('--kore-space-4: 1rem;');
    expect(root).toContain('--kore-radius-md: 10px;');
    expect(root).toContain('--kore-shadow-md: 0 4px 12px 0 rgba(36, 26, 30, 0.08);');
    expect(root).toContain('--kore-shadow-focus-ring: 0 0 0 5px #9B3552;');
    expect(root).toContain('--kore-motion-base: 200ms;');
    expect(root).toContain('--kore-ease: cubic-bezier(0.2, 0.8, 0.2, 1);');
    expect(root).toContain('--primary: var(--kore-primary-dark);');
    expect(root).toContain('--destructive-hover: var(--kore-danger-darker);');
    expect(root).toContain('--overlay: rgba(36, 26, 30, 0.4);');
    expect(root).toContain('--tag-wine-tint: var(--kore-primary-tint);');
    expect(root).toContain('--tag-champagne-text: var(--kore-ink);');
    expect(root).toContain('--tag-blue-text: var(--kore-info-text);');
    expect(root).toContain("--site-font-display: 'Cormorant Garamond', serif;");
    expect(root).toContain('--site-primary: #A94F37;');
    expect(root).toContain('--site-background: #FBF7F2;');
  });

  it('toda variável semântica aponta para uma variável do core que existe', () => {
    const root = rootBlock();
    for (const [, target] of root.matchAll(/: var\((--kore-[\w-]+)\);/g)) {
      expect(root, target).toContain(`${target}:`);
    }
  });

  it('tem um seletor por tema de cada eixo da aparência do site', () => {
    for (const name of Object.keys(siteFonts))
      expect(css).toContain(`[data-site-fonts='${name}'] {`);
    for (const name of Object.keys(siteColors))
      expect(css).toContain(`[data-site-colors='${name}'] {`);
    for (const name of Object.keys(siteBackgrounds)) {
      expect(css).toContain(`[data-site-background='${name}'] {`);
    }
    expect(css).toMatch(/\[data-site-colors='noite'\] \{[^}]*--site-primary-foreground: #15171C;/);
    expect(css).toMatch(/\[data-site-background='escuro'\] \{[^}]*--site-kore-seal: #F6E6EB;/);
  });
});
