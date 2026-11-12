import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/** Tamanhos do DS: P (24 px), M (32 px) e G (40 px). */
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Iniciais vindas do app (ex.: "AM"). */
  initials: string;
  size?: AvatarSize;
  /**
   * Nome da pessoa, quando o avatar aparece sozinho. Sem ele, o avatar é decorativo
   * (o nome já está ao lado, como na Topbar).
   */
  label?: string;
}

/** Avatar do DS: iniciais em primary.dark sobre primary.tint, em círculo. */
export function Avatar({ initials, size = 'md', label, className, ...props }: AvatarProps) {
  return (
    <span
      className={joinClassNames({ names: ['kore-avatar', `kore-avatar--${size}`, className] })}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...props}
    >
      {initials}
    </span>
  );
}
