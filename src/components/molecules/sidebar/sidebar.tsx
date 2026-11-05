import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface SidebarProps extends ComponentPropsWithRef<'aside'> {
  /** O Logo do DS, no topo (o logo não fica na Topbar). */
  logo: ReactNode;
  /** Nome acessível da navegação, vindo do app. */
  navLabel: string;
  /** Os Nav Items. */
  children: ReactNode;
}

/** Sidebar do DS no computador (a partir de 1024 px): 256 px fixa, logo e navegação. */
export function Sidebar({ logo, navLabel, className, children, ...props }: SidebarProps) {
  return (
    <aside className={joinClassNames({ names: ['kore-sidebar', className] })} {...props}>
      <div className="kore-sidebar__logo">{logo}</div>
      <nav className="kore-sidebar__nav" aria-label={navLabel}>
        {children}
      </nav>
    </aside>
  );
}
