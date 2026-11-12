import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/** Tipos do DS: Primário, Secundário, Fantasma e Destrutivo. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

/** Tamanhos do DS: P (32 px, só computador), M (40 px) e G (48 px). */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClassNames({
        names: ['kore-button', `kore-button--${variant}`, `kore-button--${size}`, className],
      })}
      {...props}
    />
  );
}
