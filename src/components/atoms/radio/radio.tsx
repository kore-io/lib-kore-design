import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type'>;

/**
 * Radio do DS: o `<input type="radio">` nativo (teclado e grupo por `name` de graça),
 * escondido de forma acessível, com o controle do DS desenhado ao lado. O texto é o
 * `children`; `className` vai para o rótulo; o ref vai para o `<input>`.
 */
export function Radio({ className, children, ...props }: RadioProps) {
  return (
    <label className={joinClassNames({ names: ['kore-radio', className] })}>
      <input type="radio" className="kore-radio__input" {...props} />
      <span className="kore-radio__control" aria-hidden="true" />
      <span className="kore-radio__label">{children}</span>
    </label>
  );
}
