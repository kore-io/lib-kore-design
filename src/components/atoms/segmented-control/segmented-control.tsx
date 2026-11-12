import { useId } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
}

export interface SegmentedControlProps<V extends string> {
  /** Nome do grupo para o leitor de tela (ex.: "Ver como"). */
  label: string;
  options: readonly SegmentedOption<V>[];
  value: V;
  onChange: (value: V) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Controle segmentado do DS (a barra da prévia do site, "Ver como": Visitante · Grupo).
 * É um grupo de `<input type="radio">` nativos, escondidos de forma acessível: as setas
 * trocam o segmento e o leitor de tela anuncia o grupo e a escolha. O segmento ativo tem
 * fundo branco e texto ink; os outros herdam a cor do texto de onde o controle está (na
 * barra da prévia, branco sobre ink).
 */
export function SegmentedControl<V extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: SegmentedControlProps<V>) {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={joinClassNames({ names: ['kore-segmented', className] })}
    >
      {options.map((option) => (
        <label key={option.value} className="kore-segmented__option">
          <input
            type="radio"
            className="kore-segmented__input"
            name={name}
            value={option.value}
            checked={option.value === value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
          />
          <span className="kore-segmented__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
