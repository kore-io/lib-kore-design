import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface LabelProps extends ComponentPropsWithRef<'label'> {
  /**
   * Marca do campo opcional (Tipo=Opcional do DS). O texto vem do app, pela Voz
   * (no Penpot, "(opcional)").
   */
  optionalText?: string;
}

/** Label do DS: rótulo de campo em type.label, com a marca de opcional ao lado. */
export function Label({ optionalText, className, children, ...props }: LabelProps) {
  return (
    <label className={joinClassNames({ names: ['kore-label', className] })} {...props}>
      {children}
      {optionalText && (
        <>
          {/* O espaço separa no nome acessível; no flex, o gap faz o espaço visual. */}{' '}
          <span className="kore-label__optional">{optionalText}</span>
        </>
      )}
    </label>
  );
}
