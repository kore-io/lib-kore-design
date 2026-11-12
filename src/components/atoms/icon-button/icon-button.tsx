import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Ícone do Lucide, decorativo. */
  icon: ReactNode;
  /** Nome acessível, vindo do app (ex.: "Abrir menu"). */
  label: string;
  /** Contador sobre o ícone (ex.: notificações não lidas); o número é visual. */
  count?: number;
}

/**
 * Botão redondo de 40 px só com ícone, como "Abrir menu", "Notificações" e "Fechar
 * menu" do DS. Com `count`, o contador vai no canto (inclua o número no `label`).
 */
export function IconButton({
  icon,
  label,
  count,
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={joinClassNames({ names: ['kore-icon-button', className] })}
      {...props}
    >
      <span className="kore-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
      {count !== undefined && count > 0 && (
        <span className="kore-icon-button__count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}
