import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import type { TagColorName } from '../../../tokens/semantic';

export interface TagProps extends Omit<ComponentPropsWithRef<'span'>, 'color'> {
  /**
   * Cor da tag (decisão 191(1)): o enum da API. `null` é "Sem cor", o padrão: fundo
   * gray.100 e texto gray.700.
   */
  color?: TagColorName | null;
}

/** Tag do DS v0.18: pílula com o nome da tag, no fundo e no texto da cor dela. */
export function Tag({ color = null, className, children, ...props }: TagProps) {
  const modifier = color === null ? 'kore-tag--none' : `kore-tag--${color}`;
  return (
    <span
      className={joinClassNames({
        names: ['kore-tag', modifier, className],
      })}
      {...props}
    >
      {children}
    </span>
  );
}
