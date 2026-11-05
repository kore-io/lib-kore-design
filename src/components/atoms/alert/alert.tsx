import { CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/** Tipos do DS: Informação, Sucesso, Atenção e Erro. */
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/** Ícone de cada tipo, como no Penpot (o Erro usa o mesmo ícone da Informação). */
const ICONS: Record<AlertTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: Info,
};

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  tone: AlertTone;
  /** Título em type.label; o `children` é o texto de apoio. */
  title?: ReactNode;
}

/**
 * Alert do DS. Para mensagem que aparece depois de uma ação (ex.: erro ao enviar),
 * passe `role="alert"`; para aviso fixo da tela, deixe sem role.
 */
export function Alert({ tone, title, className, children, ...props }: AlertProps) {
  const Icon = ICONS[tone];
  return (
    <div
      className={joinClassNames({ names: ['kore-alert', `kore-alert--${tone}`, className] })}
      {...props}
    >
      <Icon className="kore-alert__icon" aria-hidden="true" strokeWidth={1.75} />
      <div className="kore-alert__content">
        {title && <p className="kore-alert__title">{title}</p>}
        {children && <div className="kore-alert__description">{children}</div>}
      </div>
    </div>
  );
}
