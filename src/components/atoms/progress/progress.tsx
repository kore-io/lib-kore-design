import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface ProgressProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Quanto já foi, de 0 a `max`. */
  value: number;
  max?: number;
  /** O nome da barra (texto do app, ex.: "Respostas recebidas"); também é o leitor de tela. */
  label: string;
  /**
   * O valor escrito à direita do rótulo e lido pelo leitor de tela (ex.: "68%"). Sem ele,
   * o leitor lê a porcentagem.
   */
  valueText?: string;
  /** Só a barra, sem a linha do rótulo (ex.: a miniatura de uma foto enviando). */
  hideHeader?: boolean;
}

/**
 * Progress do DS v0.18: a linha do rótulo (type.body.md gray.700) com o valor à direita
 * (type.label ink), e embaixo o trilho de 8 px em primary.tint com a barra em primary.base,
 * os dois em pílula, com 8 px entre a linha e o trilho.
 */
export function Progress({
  value,
  max = 100,
  label,
  valueText,
  hideHeader = false,
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      {...(valueText !== undefined && { 'aria-valuetext': valueText })}
      className={joinClassNames({ names: ['kore-progress', className] })}
      {...props}
    >
      {!hideHeader && (
        <span className="kore-progress__header" aria-hidden="true">
          <span className="kore-progress__label">{label}</span>
          {valueText !== undefined && <span className="kore-progress__value">{valueText}</span>}
        </span>
      )}
      <span className="kore-progress__track" aria-hidden="true">
        <span className="kore-progress__bar" style={{ width: `${percent}%` }} />
      </span>
    </div>
  );
}
