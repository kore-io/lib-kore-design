import type { ComponentPropsWithRef, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface StatCardProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Rótulo em type.overline (ex.: "Válidas"). */
  label: ReactNode;
  /** O número (ex.: 142). */
  value: ReactNode;
  /** A linha de apoio (ex.: "viram 58 grupos"). */
  detail?: ReactNode;
}

/** Stat Card do DS v0.18: o rótulo, o número em destaque e a linha de apoio. */
export function StatCard({ label, value, detail, className, ...props }: StatCardProps) {
  return (
    <div className={joinClassNames({ names: ['kore-stat-card', className] })} {...props}>
      <span className="kore-stat-card__label">{label}</span>
      <span className="kore-stat-card__value">{value}</span>
      {detail !== undefined && <span className="kore-stat-card__detail">{detail}</span>}
    </div>
  );
}
