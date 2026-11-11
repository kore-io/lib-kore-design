import { Slot, Slottable } from '@radix-ui/react-slot';
import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface TabsProps extends ComponentPropsWithRef<'nav'> {
  /** Nome da navegação para o leitor de tela (texto do app). */
  'aria-label': string;
}

/**
 * Linha de abas do DS: as abas são links de página (cada uma é uma rota do app), então a
 * linha é um `<nav>` com 4 px entre as abas, e a atual leva `aria-current="page"`.
 */
export function Tabs({ className, children, ...props }: TabsProps) {
  return (
    <nav className={joinClassNames({ names: ['kore-tabs', className] })} {...props}>
      {children}
    </nav>
  );
}

export interface TabProps extends ComponentPropsWithRef<'a'> {
  /** Estado=Ativo: a página atual (`aria-current="page"`). */
  current?: boolean;
  /** Usa o filho como o link (ex.: o `<Link>` do roteador do app), com as classes do DS. */
  asChild?: boolean;
}

/** Tab do DS: rótulo do app e o sublinhado de 40 px da aba ativa. */
export function Tab({ current = false, asChild = false, className, children, ...props }: TabProps) {
  const Component = asChild ? Slot : 'a';
  return (
    <Component
      className={joinClassNames({ names: ['kore-tab', current && 'kore-tab--current', className] })}
      aria-current={current ? 'page' : undefined}
      {...props}
    >
      <Slottable>{children}</Slottable>
    </Component>
  );
}
