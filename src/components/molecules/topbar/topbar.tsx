import { Menu } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { IconButton } from '../../atoms/icon-button/icon-button';

export interface TopbarProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  /** Nome do casamento ou da área (ex.: "Ana & Marcos"). */
  title: ReactNode;
  /** Selo de status (ex.: o do site); sai no celular, como no DS. */
  status?: ReactNode;
  /** Ações à direita (Notificações, Menu do usuário). */
  actions?: ReactNode;
  /** Rótulo do botão ☰, vindo do app (ex.: "Abrir menu"). Só abaixo de 1024 px. */
  menuLabel: string;
  onMenuClick: () => void;
  /** Estado e id do drawer, para o `aria-expanded` e o `aria-controls` do ☰. */
  menuExpanded?: boolean;
  menuControls?: string;
}

/**
 * Topbar do DS: ☰ (celular e tablet), título, selo de status (a partir do tablet) e as
 * ações. O logo não fica aqui: fica no topo da Sidebar e do drawer (IA da Área do Casal).
 */
export function Topbar({
  title,
  status,
  actions,
  menuLabel,
  onMenuClick,
  menuExpanded,
  menuControls,
  className,
  ...props
}: TopbarProps) {
  return (
    <header className={joinClassNames({ names: ['kore-topbar', className] })} {...props}>
      <div className="kore-topbar__start">
        <IconButton
          className="kore-topbar__menu-button"
          icon={<Menu size={24} strokeWidth={1.75} />}
          label={menuLabel}
          onClick={onMenuClick}
          aria-expanded={menuExpanded}
          aria-controls={menuControls}
        />
        <p className="kore-topbar__title">{title}</p>
        {status && <div className="kore-topbar__status">{status}</div>}
      </div>
      {actions && <div className="kore-topbar__actions">{actions}</div>}
    </header>
  );
}
