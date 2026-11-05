# @kore-io/design

Tokens e componentes do Kore, espelho do Design System do Penpot. Ver `docs-kore-hub` (Marca, Mapa de páginas do Penpot e ADR-26/ADR-27).

Publicado como pacote privado no GitHub Packages (`@kore-io/design`).

## Requisitos

Node.js 24 (`.nvmrc`) e pnpm 10 (`packageManager`).

## Comandos

| Comando                             | O que faz                                         |
| ----------------------------------- | ------------------------------------------------- |
| `pnpm install`                      | instala as dependências e os hooks do Git (Husky) |
| `pnpm build`                        | gera `dist/`                                      |
| `pnpm test`                         | testes (Vitest)                                   |
| `pnpm typecheck`                    | checagem de tipos                                 |
| `pnpm lint`                         | ESLint                                            |
| `pnpm format` / `pnpm format:check` | Prettier                                          |

Commits em Conventional Commits (commitlint no `commit-msg`); lint-staged no `pre-commit`.

## Tokens

Os tokens espelham o **Design System v0.16** do Penpot (arquivo `Design system`). A fonte no código é `src/tokens/`; o teste `tests/tokens.test.ts` compara cada valor com `tests/fixtures/penpot-ds-v0.16.json`, os valores brutos lidos do Penpot. Ao subir a versão do DS: atualizar a fixture com o Penpot, rodar os testes e corrigir `src/tokens/`.

```ts
import { semanticColors, typeStyles, spacing } from '@kore-io/design';
```

```css
@import '@kore-io/design/tokens.css';
```

O `tokens.css` declara no `:root`:

- `--kore-*`: o core (cores, fontes, pesos, tamanhos e alturas de linha, espaçamento, raio, sombra, movimento);
- `--background`, `--primary`, `--ring`…: os semânticos, com os nomes do shadcn/ui, apontando para o core;
- `--site-*`: a aparência do site do casal. Os três eixos trocam por atributo, em qualquer elemento: `data-site-fonts` (`romantico`, `classico`, `leve`, `moderno`), `data-site-colors` (`terracota`, `salvia`, `rose`, `marfim`, `marinho`, `areia`, `por-do-sol`, `grafite`, `noite`) e `data-site-background` (`claro`, `creme`, `escuro`). Sem atributo, vale o padrão do Penpot: Romântico, Terracota e Creme.

As fontes (Cormorant Garamond, Nunito Sans e as do site) não vêm no pacote: o app carrega.

## Preset do Tailwind (v4)

```css
@import 'tailwindcss';
@import '@kore-io/design/tailwind.css';
```

O preset importa o `tokens.css` e:

- **zera** as escalas padrão do Tailwind que o DS substitui (cores, fontes, tamanhos de texto, raios e sombras): só valem os valores do Brand Kit. O espaçamento fica na base 4 (`p-4` = `space.4` = 16 px), igual ao DS. A escala fica aberta (`p-7` vale) porque `w-*`, `h-*` e `size-*` usam a mesma escala e o alvo de toque de 44 px (`h-11`) não é passo do DS;
- cores: `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-overlay`… (semânticos), `bg-success-tint`, `text-danger-text`, `bg-gray-100`… (core) e `bg-site-primary`, `text-site-foreground`… (site, que trocam com os atributos `data-site-*`);
- fontes: `font-display`, `font-body`, `font-site-display`, `font-site-body`;
- texto: `text-<estilo>` (tamanho, altura de linha e peso) e `type-<estilo>` (o estilo completo, com a família), para `display-xl`, `display-lg`, `display-md`, `display-sm`, `heading`, `body-lg`, `body-md`, `label`, `label-lg`, `caption`, `overline`, `number` e `link`;
- breakpoints só `md:` (768 px) e `lg:` (1024 px), como no Brand Kit; o `html` usa a fonte do corpo (`--default-font-family`);
- `rounded-sm|md|lg|xl|full`, `shadow-sm|md|lg|focus-ring`, `ease-kore`, e `transition` com 200 ms (`motion.base`) e a curva do DS por padrão. Os tempos `--kore-motion-fast|base|slow` servem em `duration-(--kore-motion-fast)`.
