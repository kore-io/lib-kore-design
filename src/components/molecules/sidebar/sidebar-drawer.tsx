import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { useMediaQuery } from '../../../lib/use-media-query';
import { IconButton } from '../../atoms/icon-button/icon-button';

export interface SidebarDrawerProps {
  open: boolean;
  onOpenChange: (change: { open: boolean }) => void;
  /** Para o `aria-controls` do ☰ da Topbar. */
  id?: string;
  /** Nome acessível do drawer (fica oculto na tela), vindo do app. */
  title: string;
  /** Rótulo do botão de fechar, vindo do app (ex.: "Fechar menu"). */
  closeLabel: string;
  logo: ReactNode;
  navLabel: string;
  /** Os Nav Items. Escolher um item fecha o drawer. */
  children: ReactNode;
}

/**
 * A Sidebar no celular e no tablet: drawer de 304 px que entra da esquerda sobre o fundo
 * escurecido (Dialog do Radix: foco preso, Esc e toque fora fecham).
 */
export function SidebarDrawer({
  open,
  onOpenChange,
  id,
  title,
  closeLabel,
  logo,
  navLabel,
  children,
}: SidebarDrawerProps) {
  // A partir de 1024 px a Sidebar fixa assume: o drawer aberto fecharia sobre ela.
  const isDesktop = useMediaQuery({ query: '(min-width: 64rem)', fallback: false });
  useEffect(() => {
    if (isDesktop && open) onOpenChange({ open: false });
  }, [isDesktop, open, onOpenChange]);

  function closeOnNavigation(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a')) onOpenChange({ open: false });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => onOpenChange({ open: next })}>
      <Dialog.Portal>
        <Dialog.Overlay className="kore-drawer__overlay" />
        <Dialog.Content id={id} className="kore-drawer" aria-describedby={undefined}>
          <Dialog.Title className="kore-drawer__title">{title}</Dialog.Title>
          <div className="kore-drawer__header">
            {logo}
            <Dialog.Close asChild>
              <IconButton icon={<X size={24} strokeWidth={1.75} />} label={closeLabel} />
            </Dialog.Close>
          </div>
          <nav className="kore-drawer__nav" aria-label={navLabel} onClick={closeOnNavigation}>
            {children}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
