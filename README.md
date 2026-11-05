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
- `border-1.5`: borda de 1,5 px dos componentes do DS (erro dos campos, controles desmarcados), que a escala inteira do Tailwind não tem (decisão 140);
- `animate-drawer-in|drawer-out|overlay-in|overlay-out|popover-in|popover-out|sheet-in|sheet-out|reduced-in|reduced-out`: animações do DS (02 · Motion), para usar com `motion-reduce:animate-reduced-*`;
- `rounded-sm|md|lg|xl|full`, `shadow-sm|md|lg|focus-ring`, `ease-kore`, e `transition` com 200 ms (`motion.base`) e a curva do DS por padrão. Os tempos `--kore-motion-fast|base|slow` servem em `duration-(--kore-motion-fast)`.

## CSS dos componentes (decisão 131)

O JSX dos componentes usa só classes semânticas (`kore-button kore-button--primary`), nunca utilitárias. O estilo fica no `.css` do componente (`src/components/<atoms|molecules>/<componente>/<componente>.css`), só com `@apply` das utilitárias do preset; variantes são classes modificadoras (`--primary`). O build resolve o `@apply` (com `@reference` ao Tailwind e ao preset) e publica `components.css` em CSS puro, na camada `components`, átomos antes das moléculas. Quebram o build: utilitária fora do DS (`bg-red-500`), valor ou variante arbitrária (`bg-[#f00]`, `text-[13px]`, `[&>svg]:p-2`), variável que não seja `--kore-*` ou `--site-*` (`bg-(--kore-primary-base)` vale) e `.css` fora de `atoms/` e `molecules/`.

```css
@import 'tailwindcss';
@import '@kore-io/design/tailwind.css';
@import '@kore-io/design/components.css';
```

## Stylelint (decisões 131 e 133)

O pacote publica um plugin do Stylelint com as regras do CSS de componente, para o editor, o lint e o CI (aqui e no `web-kore-app`). O build do `components.css` checa as mesmas regras.

```js
// stylelint.config.js
export default {
  plugins: ['@kore-io/design/stylelint'],
  rules: {
    'kore/apply-ds-only': true,
    'kore/declaration-ds-only': true,
    'kore/at-rule-ds-only': true,
  },
};
```

- `kore/apply-ds-only`: no `@apply`, nada de valor ou variante arbitrária (`bg-[#f00]`, `[&>svg]:p-2`) nem variável fora de `--kore-*`/`--site-*`.
- `kore/declaration-ds-only`: declaração direta (fora do `@apply`) só para propriedade sem utilitária equivalente, listada em `stylelint/rules.js` (`DIRECT_PROPERTIES`; propriedade nova entra por PR), e com valor só de palavras-chave ou `var(--kore-*|--site-*)`. Recusa cor literal (inclusive nomeada), número com ou sem unidade e `var()` fora do DS.
- `kore/at-rule-ds-only`: só `@apply`, `@media`, `@supports`, `@container` e `@keyframes`. Recusa `@import`, `@theme`, `@utility`, `@plugin`, `@config`, `@source`, `@tailwind`, `@layer` e as demais, que trariam CSS de fora ou mexeriam no tema. Dentro de `@keyframes` valem as mesmas regras de declaração.

## Componentes (React)

React 19 é `peerDependency`. Os componentes ficam em `src/components/<atoms|molecules>/<componente>/`, com o `.tsx`, o `.css` (só `@apply`, decisão 131) e o teste ao lado (`*.test.tsx`, Vitest + Testing Library em jsdom). Todo teste de componente roda o axe-core com `expectNoA11yViolations` (`tests/a11y.ts`); o contraste é coberto pelos testes dos tokens.

### Divergências registradas em relação ao Penpot

- **Ícones**: Lucide com `strokeWidth={1.75}` (regra do Brand Kit), mesmo onde o Penpot mostra traço 2 ou 1,6 em instâncias.
- **Date Field**: o Penpot não tem Foco nem Erro; o código usa os do Input (decisão 141).
- **Placeholder**: `gray.700` em vez de `gray.500` (decisão 132).
- **Nav Item Ativo**: negrito (700), como nas instâncias da Sidebar; o componente principal do Penpot tem 600 (decisão 144).
- **Menu do usuário**: 8 px (space.2) entre o gatilho e o popover, escolha do código sem par no Penpot.
- **Code Input em erro**: no Penpot, cada casa herda o ícone de alerta do Input, que não cabe com o dígito numa casa de 52 px; o código mostra só a borda de erro, e a mensagem fica com a tela.
