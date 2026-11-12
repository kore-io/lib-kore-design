import { ChevronDown } from 'lucide-react';
import { useState, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { FieldBox } from '../field-box/field-box';

export interface SelectProps extends ComponentPropsWithRef<'select'> {
  /** Estado=Erro: borda em danger e `aria-invalid`. */
  invalid?: boolean;
  /** Texto da opção vazia (Estado=Vazio), vindo do app. */
  placeholder?: string;
}

/**
 * Select do DS sobre o `<select>` nativo (teclado, leitor de tela e roda de opções do
 * celular de graça). Os props vão para o `<select>`; `className` vai para a caixa.
 */
export function Select({
  invalid = false,
  disabled,
  placeholder,
  className,
  children,
  value,
  defaultValue,
  onChange,
  ...props
}: SelectProps) {
  const [hasValue, setHasValue] = useState(() => String(value ?? defaultValue ?? '') !== '');
  const showsPlaceholder = value === undefined ? !hasValue : String(value) === '';

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setHasValue(event.target.value !== '');
    onChange?.(event);
  }

  return (
    <FieldBox
      invalid={invalid}
      disabled={disabled ?? false}
      className={joinClassNames({
        names: ['kore-select', showsPlaceholder && 'kore-select--placeholder', className],
      })}
    >
      <select
        className="kore-select__field"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        value={value}
        defaultValue={
          value === undefined ? (defaultValue ?? (placeholder ? '' : undefined)) : undefined
        }
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown className="kore-select__icon" aria-hidden="true" strokeWidth={1.75} />
    </FieldBox>
  );
}
