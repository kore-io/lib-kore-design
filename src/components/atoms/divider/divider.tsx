import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends ComponentPropsWithRef<'hr'> {
  orientation?: DividerOrientation;
}

/** Divider do DS: linha de 1 px em gray.300, horizontal ou vertical. */
export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={joinClassNames({
        names: ['kore-divider', `kore-divider--${orientation}`, className],
      })}
      {...props}
    />
  );
}
