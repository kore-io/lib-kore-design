import { useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface CodeInputProps {
  /** Quantidade de dígitos (o código de acesso tem 6, RN01 do Login). */
  length?: number;
  /** Controlado: o código digitado até agora. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (change: { value: string }) => void;
  /** Chamado quando todos os dígitos estão preenchidos. */
  onComplete?: (change: { value: string }) => void;
  /** Rótulo de cada casa, vindo do app (ex.: "Dígito 1 de 6"). */
  digitLabel: (position: { index: number; length: number }) => string;
  /** Nome acessível do grupo, vindo do app. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Estado=Erro do DS. */
  invalid?: boolean;
  disabled?: boolean;
  /** Envia o código num campo oculto com este nome. */
  name?: string;
  autoFocus?: boolean;
  className?: string;
}

const DIGIT = /\d/g;

function onlyDigits({ text, length }: { text: string; length: number }) {
  return (text.match(DIGIT) ?? []).join('').slice(0, length);
}

/**
 * Code Input do DS: uma casa por dígito. Digitar avança; colar ou o preenchimento
 * automático do código (one-time-code) distribui os dígitos; Backspace numa casa
 * vazia volta (também no Android, pelo change vazio e pelo beforeinput); as setas
 * andam entre as casas.
 */
export function CodeInput({
  length = 6,
  value,
  defaultValue = '',
  onValueChange,
  onComplete,
  digitLabel,
  invalid = false,
  disabled = false,
  name,
  autoFocus,
  className,
  ...aria
}: CodeInputProps) {
  const [internalValue, setInternalValue] = useState(() =>
    onlyDigits({ text: defaultValue, length }),
  );
  const code = value === undefined ? internalValue : onlyDigits({ text: value, length });
  const cells = useRef<(HTMLInputElement | null)[]>([]);

  function focusCell({ index }: { index: number }) {
    const target = cells.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  }

  function commit({ next }: { next: string }) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.({ value: next });
    if (next.length === length) onComplete?.({ value: next });
  }

  /**
   * Escreve os dígitos a partir da casa `index`, por cima dos que já estão lá e sem
   * deixar buraco antes dela; os dígitos seguintes ficam.
   */
  function writeFrom({ index, text }: { index: number; text: string }) {
    const digits = onlyDigits({ text, length });
    if (!digits) return;
    const start = Math.min(index, code.length);
    const next = (code.slice(0, start) + digits + code.slice(start + digits.length)).slice(
      0,
      length,
    );
    commit({ next });
    focusCell({ index: Math.min(start + digits.length, length - 1) });
  }

  function handleChange({ index, event }: { index: number; event: ChangeEvent<HTMLInputElement> }) {
    // Se a casa já tinha um dígito e ele não foi selecionado, o valor traz os dois.
    const previous = code[index];
    let typed = event.target.value;
    if (previous && typed.length > 1) {
      if (typed.startsWith(previous)) typed = typed.slice(1);
      else if (typed.endsWith(previous)) typed = typed.slice(0, -1);
    }
    // Casa esvaziada pelo teclado virtual (no Android o Backspace chega assim).
    if (typed === '') {
      removeBackward({ index });
      return;
    }
    writeFrom({ index, text: typed });
  }

  /** Apaga o dígito da casa ou, se ela está vazia, o da anterior, e fica nela. */
  function removeBackward({ index }: { index: number }) {
    const removeAt = code[index] === undefined ? index - 1 : index;
    if (removeAt < 0) return;
    commit({ next: code.slice(0, removeAt) + code.slice(removeAt + 1) });
    focusCell({ index: removeAt });
  }

  /**
   * No Android (Gboard) o Backspace não vem como tecla; numa casa vazia só chega o
   * beforeinput de apagar, sem change.
   */
  function handleBeforeInput({ index, event }: { index: number; event: InputEvent }) {
    if (event.inputType !== 'deleteContentBackward' || code[index] !== undefined) return;
    event.preventDefault();
    removeBackward({ index });
  }

  function handlePaste({
    index,
    event,
  }: {
    index: number;
    event: ClipboardEvent<HTMLInputElement>;
  }) {
    event.preventDefault();
    writeFrom({ index, text: event.clipboardData.getData('text') });
  }

  function handleKeyDown({
    index,
    event,
  }: {
    index: number;
    event: KeyboardEvent<HTMLInputElement>;
  }) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      removeBackward({ index });
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusCell({ index: index - 1 });
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusCell({ index: Math.min(index + 1, code.length) });
    }
  }

  return (
    <div
      role="group"
      className={joinClassNames({
        names: ['kore-code-input', invalid && 'kore-code-input--invalid', className],
      })}
      {...aria}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            cells.current[index] = element;
            if (!element) return;
            // O React não expõe o inputType do beforeinput; o listener é nativo.
            const listener = (event: Event) =>
              handleBeforeInput({ index, event: event as InputEvent });
            element.addEventListener('beforeinput', listener);
            return () => element.removeEventListener('beforeinput', listener);
          }}
          className="kore-code-input__cell"
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={digitLabel({ index, length })}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          value={code[index] ?? ''}
          onChange={(event) => handleChange({ index, event })}
          onPaste={(event) => handlePaste({ index, event })}
          onKeyDown={(event) => handleKeyDown({ index, event })}
          onFocus={(event) => event.target.select()}
        />
      ))}
      {name && <input type="hidden" name={name} value={code} />}
    </div>
  );
}
