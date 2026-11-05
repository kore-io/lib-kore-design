import { Calendar, CircleAlert } from 'lucide-react';
import { useState, type ChangeEvent, type ComponentPropsWithRef, type MouseEvent } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { FieldBox } from '../field-box/field-box';

export interface DateFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /**
   * Erro: borda em danger, ícone de alerta e `aria-invalid`, como no Input. O Penpot
   * não tem Foco nem Erro no Date Field; vêm do Input (decisão 141).
   */
  invalid?: boolean;
}

/**
 * Date Field do DS sobre o `<input type="date">` nativo: o navegador mostra
 * dd/mm/aaaa no idioma da página e abre o calendário do sistema. O valor é ISO
 * (aaaa-mm-dd). `className` vai para a caixa.
 */
export function DateField({
  invalid = false,
  disabled,
  className,
  value,
  defaultValue,
  onChange,
  onClick,
  ...props
}: DateFieldProps) {
  const [hasValue, setHasValue] = useState(() => String(value ?? defaultValue ?? '') !== '');
  const isEmpty = value === undefined ? !hasValue : String(value) === '';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setHasValue(event.target.value !== '');
    onChange?.(event);
  }

  function handleClick(event: MouseEvent<HTMLInputElement>) {
    onClick?.(event);
    // A seta nativa fica escondida; o clique no campo abre o calendário.
    try {
      event.currentTarget.showPicker();
    } catch {
      // Navegador sem showPicker ou campo desabilitado: segue com a digitação.
    }
  }

  return (
    <FieldBox
      invalid={invalid}
      disabled={disabled ?? false}
      className={joinClassNames({
        names: ['kore-date-field', isEmpty && 'kore-date-field--empty', className],
      })}
    >
      <Calendar className="kore-date-field__icon" aria-hidden="true" strokeWidth={1.75} />
      <input
        type="date"
        className="kore-date-field__field"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onClick={handleClick}
        {...props}
      />
      {invalid && (
        <CircleAlert
          className="kore-date-field__error-icon"
          aria-hidden="true"
          strokeWidth={1.75}
        />
      )}
    </FieldBox>
  );
}
