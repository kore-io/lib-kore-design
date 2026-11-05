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
