import * as RadixDialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode, type RefObject } from 'react';
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
  /**
   * Para onde o foco volta ao fechar, quando quem abriu some (ex.: o item do menu ⋮, que
   * fecha junto): o app passa o botão ⋮. Sem isso, volta a quem tinha o foco ao abrir.
   */
  returnFocusRef?: RefObject<HTMLElement | null>;
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
  returnFocusRef,
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
            const target = returnFocusRef?.current ?? returnFocus.current;
            if (!target?.isConnected) return;
            event.preventDefault();
            target.focus();
          }}
          className="kore-dialog"
          // O respiro de 16 px em volta do cartão é parte do Content: tocar nele fecha,
          // como no fundo.
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
          {...(description === undefined && { 'aria-describedby': undefined })}
        >
          <div className={joinClassNames({ names: ['kore-dialog__card', className] })}>
            <RadixDialog.Title className="kore-dialog__title">{title}</RadixDialog.Title>
            {description !== undefined && (
              <RadixDialog.Description className="kore-dialog__description">
                {description}
              </RadixDialog.Description>
            )}
            {children}
            <div className="kore-dialog__actions">{actions}</div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
