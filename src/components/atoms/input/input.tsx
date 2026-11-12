import { CircleAlert } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { FieldBox } from '../field-box/field-box';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  /** Estado=Erro: borda em danger, ícone de alerta e `aria-invalid`. */
  invalid?: boolean;
}

/**
 * Input do DS. Os props vão para o `<input>` (o ref também); `className` vai para a
 * caixa. A mensagem de erro e o rótulo ficam com quem compõe o campo.
 */
export function Input({ invalid = false, disabled, className, ...props }: InputProps) {
  return (
    <FieldBox
      invalid={invalid}
      disabled={disabled ?? false}
      className={joinClassNames({ names: ['kore-input', className] })}
    >
      <input
        className="kore-input__field"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      />
      {invalid && (
        <CircleAlert className="kore-input__icon" aria-hidden="true" strokeWidth={1.75} />
      )}
    </FieldBox>
  );
}
