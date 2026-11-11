import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { FieldBox } from '../field-box/field-box';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  /** Estado=Erro: borda em danger e `aria-invalid`. */
  invalid?: boolean;
}

/**
 * Textarea do DS v0.18: a caixa comum dos campos, com altura mínima de 96 px e o texto
 * em várias linhas. Os props vão para o `<textarea>` (o ref também); `className` vai
 * para a caixa. O rótulo e a mensagem de erro ficam com quem compõe o campo.
 */
export function Textarea({ invalid = false, disabled, className, ...props }: TextareaProps) {
  return (
    <FieldBox
      invalid={invalid}
      disabled={disabled ?? false}
      className={joinClassNames({ names: ['kore-textarea', className] })}
    >
      <textarea
        className="kore-textarea__field"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      />
    </FieldBox>
  );
}
