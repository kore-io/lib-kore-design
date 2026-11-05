import * as RadixToast from '@radix-ui/react-toast';
import { CircleCheck, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/** Tipos do DS: Sucesso e Erro (o Erro usa o ícone Info, como no Penpot). */
export type ToastTone = 'success' | 'danger';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  showToast: (toast: { tone: ToastTone; message: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * Nome dos avisos, vindo do app: rotula a região (com o atalho, ex.: "Avisos (F8)") e
   * abre o anúncio de cada aviso no leitor de tela.
   */
  label: string;
  /** Rótulo do X de fechar, vindo do app. */
  dismissLabel: string;
  /** O DS manda sair sozinho depois de 5 s. */
  duration?: number;
  /** Ajuste de posição por layout (padrão: topo, centralizado). */
  viewportClassName?: string;
}

/**
 * Toast do DS: fila de avisos curtos no topo (Radix Toast: região aria-live, pausa ao
 * passar o mouse ou focar, F8 leva até eles). Entra de baixo com 8 px e sai por
 * opacidade depois de 5 s.
 */
export function ToastProvider({
  children,
  label,
  dismissLabel,
  duration = 5000,
  viewportClassName,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(({ tone, message }: { tone: ToastTone; message: string }) => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), tone, message }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  function remove({ id }: { id: number }) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider label={label} duration={duration} swipeDirection="up">
        {children}
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CircleCheck : Info;
          return (
            <RadixToast.Root
              key={toast.id}
              className={joinClassNames({ names: ['kore-toast', `kore-toast--${toast.tone}`] })}
              type={toast.tone === 'danger' ? 'foreground' : 'background'}
              onOpenChange={(open) => {
                if (!open) remove({ id: toast.id });
              }}
            >
              <Icon className="kore-toast__icon" aria-hidden="true" strokeWidth={1.75} />
              <RadixToast.Description className="kore-toast__message">
                {toast.message}
              </RadixToast.Description>
              <RadixToast.Close className="kore-toast__close" aria-label={dismissLabel}>
                <X aria-hidden="true" strokeWidth={1.75} />
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport
          label={`${label} ({hotkey})`}
          className={joinClassNames({ names: ['kore-toast-viewport', viewportClassName] })}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** Mostra um Toast. Precisa do ToastProvider acima. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa do ToastProvider acima na árvore.');
  return context;
}
