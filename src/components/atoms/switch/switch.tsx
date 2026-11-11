import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export type SwitchProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'role'>;

/**
 * Switch do DS: o `<input type="checkbox" role="switch">` nativo (teclado e "ligado ·
 * desligado" do leitor de tela de graça), escondido de forma acessível, com o controle
 * do DS desenhado ao lado. O texto é o `children`; `className` vai para o rótulo; o ref,
 * para o `<input>`.
 */
export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <label className={joinClassNames({ names: ['kore-switch', className] })}>
      <input type="checkbox" role="switch" className="kore-switch__input" {...props} />
      <span className="kore-switch__control" aria-hidden="true">
        <span className="kore-switch__thumb" />
      </span>
      {children !== undefined && <span className="kore-switch__label">{children}</span>}
    </label>
  );
}
