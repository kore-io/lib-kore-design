import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /**
   * Estado=Indeterminado (o "marcar todos" com parte marcada): traço no lugar do check.
   * O leitor de tela anuncia "misto" pelo `indeterminate` nativo.
   */
  indeterminate?: boolean;
}

/**
 * Checkbox do DS: o `<input type="checkbox">` nativo, escondido de forma acessível, com o
 * controle do DS desenhado ao lado. O texto é o `children`; sem texto (ex.: numa linha da
 * tabela), o app dá o nome por `aria-label`. `className` vai para o rótulo; o ref, para o
 * `<input>`.
 */
export function Checkbox({
  indeterminate = false,
  className,
  children,
  ref,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // A cada render: o clique limpa o `indeterminate` nativo, e a prop pode continuar `true`.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  return (
    <label className={joinClassNames({ names: ['kore-checkbox', className] })}>
      <input ref={inputRef} type="checkbox" className="kore-checkbox__input" {...props} />
      <span className="kore-checkbox__control" aria-hidden="true">
        <svg
          className="kore-checkbox__check"
          viewBox="0 0 14 10"
          fill="none"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1.5 5.2 5 8.5l7.5-7" />
        </svg>
        <svg
          className="kore-checkbox__minus"
          viewBox="0 0 10 2"
          fill="none"
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          <path d="M1 1h8" />
        </svg>
      </span>
      {children !== undefined && <span className="kore-checkbox__label">{children}</span>}
    </label>
  );
}
