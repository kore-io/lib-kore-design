import { Slot, Slottable } from '@radix-ui/react-slot';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface NavItemProps extends ComponentPropsWithRef<'a'> {
  /** Ícone do Lucide (20 px, decorativo), à esquerda. */
  icon: ReactNode;
  /** Estado=Ativo: a página atual (`aria-current="page"`). */
  current?: boolean;
  /**
   * Usa o filho como o link (ex.: o `<Link>` do roteador do app), mantendo as classes,
   * o ícone e o estado do DS.
   */
  asChild?: boolean;
}

/** Nav Item do DS: item da Sidebar e do drawer, com ícone e rótulo do app. */
export function NavItem({
  icon,
  current = false,
  asChild = false,
  className,
  children,
  ...props
}: NavItemProps) {
  const Component = asChild ? Slot : 'a';
  return (
    <Component
      className={joinClassNames({
        names: ['kore-nav-item', current && 'kore-nav-item--current', className],
      })}
      aria-current={current ? 'page' : undefined}
      {...props}
    >
      <span className="kore-nav-item__icon" aria-hidden="true">
        {icon}
      </span>
      <Slottable>{children}</Slottable>
    </Component>
  );
}
