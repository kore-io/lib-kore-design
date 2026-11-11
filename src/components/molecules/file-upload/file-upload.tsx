import { UploadCloud } from 'lucide-react';
import { useState, type DragEvent, type ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface FileUploadProps {
  /** Texto principal (do app, ex.: "Arrastem a planilha ou cliquem para escolher"). */
  title: ReactNode;
  /** Linha de apoio (ex.: "Excel (.xlsx) com até 1.000 linhas"). */
  hint?: ReactNode;
  /** Tipos aceitos pelo seletor do sistema (atributo `accept` do input). */
  accept?: string;
  disabled?: boolean;
  /** O arquivo escolhido pelo seletor ou solto na área (o primeiro, se vierem vários). */
  onFile: (file: File) => void;
  className?: string;
}

/**
 * File Upload do DS v0.18 (Estado Vazio): a área tracejada para arrastar um arquivo ou
 * clicar e escolher. É um `<label>` com o `<input type="file">` nativo escondido de forma
 * acessível (teclado e leitor de tela de graça); o título e a linha de apoio são o nome
 * do campo. Arrastando por cima, a borda fica em ring.
 */
export function FileUpload({
  title,
  hint,
  accept,
  disabled = false,
  onFile,
  className,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !disabled) onFile(file);
  }

  return (
    <label
      className={joinClassNames({
        names: [
          'kore-file-upload',
          dragging && 'kore-file-upload--dragging',
          disabled && 'kore-file-upload--disabled',
          className,
        ],
      })}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        className="kore-file-upload__input"
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          // O mesmo arquivo pode ser escolhido de novo (ex.: depois de corrigir).
          event.target.value = '';
        }}
      />
      <UploadCloud
        className="kore-file-upload__icon"
        size={24}
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="kore-file-upload__title">{title}</span>
      {hint !== undefined && (
        <>
          {/* O espaço separa no nome acessível; na coluna, não aparece. */}{' '}
          <span className="kore-file-upload__hint">{hint}</span>
        </>
      )}
    </label>
  );
}
