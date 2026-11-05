import type { ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface FieldBoxProps {
  /** Estado=Erro do DS: borda de 1,5 px em danger. */
  invalid?: boolean;
  /** Estado=Desabilitado do DS. */
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Caixa comum aos campos do DS (Input, Select e Date Field): borda, raio, alturas
 * por dispositivo e os estados de foco, erro e desabilitado. Uso interno.
 */
export function FieldBox({
  invalid = false,
  disabled = false,
  className,
  children,
}: FieldBoxProps) {
  return (
    <div
      className={joinClassNames({
        names: [
          'kore-field-box',
          invalid && 'kore-field-box--invalid',
          disabled && 'kore-field-box--disabled',
          className,
        ],
      })}
    >
      {children}
    </div>
  );
}
