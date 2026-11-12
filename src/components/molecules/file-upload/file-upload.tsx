import { UploadCloud } from 'lucide-react';
import { useState, type DragEvent, type ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

interface FileUploadBaseProps {
  /** Texto principal (do app, ex.: "Arrastem a planilha ou cliquem para escolher"). */
  title: ReactNode;
  /** Linha de apoio (ex.: "Excel (.xlsx) com até 1.000 linhas"). */
  hint?: ReactNode;
  /** Tipos aceitos pelo seletor do sistema (atributo `accept` do input). */
  accept?: string;
  disabled?: boolean;
  className?: string;
}

interface FileUploadSingleProps extends FileUploadBaseProps {
  multiple?: false;
  /** O arquivo escolhido pelo seletor ou solto na área (o primeiro, se vierem vários). */
  onFile: (file: File) => void;
}

interface FileUploadMultipleProps extends FileUploadBaseProps {
  /** Vários arquivos de uma vez (ex.: as fotos de Nossa história). */
  multiple: true;
  /** Os arquivos escolhidos ou soltos, na ordem em que vieram. */
  onFiles: (files: File[]) => void;
}

export type FileUploadProps = FileUploadSingleProps | FileUploadMultipleProps;

/**
 * File Upload do DS v0.18 (Estado Vazio): a área tracejada para arrastar um arquivo ou
 * clicar e escolher. É um `<label>` com o `<input type="file">` nativo escondido de forma
 * acessível (teclado e leitor de tela de graça); o título e a linha de apoio são o nome
 * do campo. Arrastando por cima, a borda fica em ring.
 */
export function FileUpload(props: FileUploadProps) {
  const { title, hint, accept, disabled = false, className } = props;
  const [dragging, setDragging] = useState(false);

  function deliver(list: FileList | null | undefined) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    if (props.multiple) props.onFiles(files);
    else if (files[0]) props.onFile(files[0]);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (!disabled) deliver(event.dataTransfer.files);
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
      onDragLeave={(event) => {
        // Passar por cima do ícone ou do texto dispara dragleave no label; só sai de fato
        // quando o ponteiro vai para fora dele (senão a borda pisca).
        const to = event.relatedTarget;
        if (to instanceof Node && event.currentTarget.contains(to)) return;
        setDragging(false);
      }}
      onDrop={onDrop}
    >
      <input
        type="file"
        className="kore-file-upload__input"
        accept={accept}
        multiple={props.multiple ?? false}
        disabled={disabled}
        onChange={(event) => {
          deliver(event.target.files);
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
