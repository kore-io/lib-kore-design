import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/**
 * Tons do Badge. No Penpot os status são do domínio e o app faz o mapa:
 * Enviado e Informado → info; Respondido e Confirmado → success (ícone Check Bold);
 * Visualizado e Pendente → warning (Clock); Recusado → danger (X Bold);
 * Não enviado → neutral; Novo → highlight.
 */
export type BadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'highlight';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone: BadgeTone;
  /**
   * Ícone decorativo à esquerda (um ícone do Lucide), dimensionado pelo Badge. Até
   * 16 px, o Brand Kit pede traço 2,4 nos ícones de selo (Check Bold, X Bold).
   */
  icon?: ReactNode;
}

/** Badge do DS: selo de status em pílula, com o texto do app. */
export function Badge({ tone, icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={joinClassNames({
        names: [
          'kore-badge',
          `kore-badge--${tone}`,
          icon !== undefined && 'kore-badge--with-icon',
          className,
        ],
      })}
      {...props}
    >
      {icon !== undefined && (
        <span className="kore-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
