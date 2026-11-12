import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Ícone do Lucide (28 px, decorativo) no círculo do DS. */
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Tipo=Com ação: o botão (Button primário M); sem ele, Tipo=Aguardando. */
  action?: ReactNode;
  /** Nível do título no documento da tela. */
  titleAs?: 'h2' | 'h3';
}

/** Empty State do DS: cartão com ícone, título, texto de apoio e a ação opcional. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  titleAs: Title = 'h2',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={joinClassNames({ names: ['kore-empty-state', className] })} {...props}>
      <span className="kore-empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <Title className="kore-empty-state__title">{title}</Title>
      {description && <p className="kore-empty-state__description">{description}</p>}
      {action && <div className="kore-empty-state__action">{action}</div>}
    </div>
  );
}
