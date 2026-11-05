import { mkdirSync, writeFileSync } from 'node:fs';
import { buildTokensCss } from '../src/css/tokens-css';

mkdirSync('dist', { recursive: true });
writeFileSync('dist/tokens.css', buildTokensCss());
