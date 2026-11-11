import { LoaderCircle } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
  /** O que está carregando, para o leitor de tela (texto do app). */
  label: string;
}

/**
 * Spinner do DS (Tamanho P, 16 px): o ícone Loader girando, em gray.700. É um `status`,
 * com o nome lido pelo leitor de tela.
 */
export function Spinner({ label, className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      className={joinClassNames({ names: ['kore-spinner', className] })}
      {...props}
    >
      <LoaderCircle className="kore-spinner__icon" size={16} strokeWidth={2} aria-hidden="true" />
      <span className="kore-spinner__label">{label}</span>
    </span>
  );
}
