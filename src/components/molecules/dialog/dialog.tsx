import * as RadixDialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título (texto do app), lido como o nome do diálogo. */
  title: ReactNode;
  /** Texto de apoio, lido como a descrição do diálogo. */
  description?: ReactNode;
  /** Conteúdo extra entre o texto e as ações (ex.: um campo). */
  children?: ReactNode;
  /** Os botões, na ordem do DS: o secundário (Cancelar) e depois o principal. */
  actions: ReactNode;
  /**
   * `alertdialog` para confirmar uma ação (o padrão, como Regenerar link e Mover para a
   * lixeira); `dialog` para um diálogo com campo.
   */
  role?: 'alertdialog' | 'dialog';
  className?: string;
}

/**
 * Dialog do DS v0.18: o fundo em overlay e o cartão de 440 px (no celular, a largura da
 * tela menos 16 px de cada lado), com o título, o texto e as ações à direita. Prende o
 * foco, fecha no Esc e no fundo (Dialog do Radix), e devolve o foco a quem o tinha ao abrir.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  role = 'alertdialog',
  className,
}: DialogProps) {
  // O app abre o Dialog por um botão seu (sem o Trigger do Radix): guarda quem tinha o
  // foco ao abrir e o devolve ao fechar.
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="kore-dialog__overlay" />
        <RadixDialog.Content
          role={role}
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            if (!returnFocus.current?.isConnected) return;
            event.preventDefault();
            returnFocus.current.focus();
          }}
          className={joinClassNames({ names: ['kore-dialog', className] })}
          {...(description === undefined && { 'aria-describedby': undefined })}
        >
          <RadixDialog.Title className="kore-dialog__title">{title}</RadixDialog.Title>
          {description !== undefined && (
            <RadixDialog.Description className="kore-dialog__description">
              {description}
            </RadixDialog.Description>
          )}
          {children}
          <div className="kore-dialog__actions">{actions}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
