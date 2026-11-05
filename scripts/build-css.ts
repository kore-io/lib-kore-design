import { mkdirSync, writeFileSync } from 'node:fs';
import { buildTailwindCss } from '../src/css/tailwind-css';
import { buildTokensCss } from '../src/css/tokens-css';

mkdirSync('dist', { recursive: true });
writeFileSync('dist/tokens.css', buildTokensCss());
writeFileSync('dist/tailwind.css', buildTailwindCss());
