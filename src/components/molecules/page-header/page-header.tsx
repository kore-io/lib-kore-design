import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface PageHeaderProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Título da página (um `<h1>`). */
  title: ReactNode;
  /** Resumo abaixo do título. */
  description?: ReactNode;
  /** Botões da página (ex.: secundário e primário M). */
  actions?: ReactNode;
}

/**
 * Page Header do DS: título e resumo, com as ações embaixo (celular e tablet) ou à
 * direita (computador).
 */
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={joinClassNames({ names: ['kore-page-header', className] })} {...props}>
      <div className="kore-page-header__titles">
        <h1 className="kore-page-header__title">{title}</h1>
        {description && <p className="kore-page-header__description">{description}</p>}
      </div>
      {actions && <div className="kore-page-header__actions">{actions}</div>}
    </div>
  );
}
