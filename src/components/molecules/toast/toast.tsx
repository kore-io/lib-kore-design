import * as RadixToast from '@radix-ui/react-toast';
import { CircleCheck, Info, X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { breakpoints } from '../../../tokens/layout';

/** Tipos do DS: Sucesso e Erro (o Erro usa o ícone Info, como no Penpot). */
export type ToastTone = 'success' | 'danger';

/** Uma ação no Toast (ex.: "Abrir a prévia" quando o navegador bloqueia a nova aba). */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  tone: ToastTone;
  message: string;
  /** Com ação, o Toast fica até ser usado ou fechado, para dar tempo de tocar. */
  action?: ToastAction;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  showToast: (toast: ToastOptions) => void;
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
  /** Ajuste de posição por layout (padrão: centralizado, na base até o lg e no alto nele). */
  viewportClassName?: string;
}

const DESKTOP_QUERY = `(min-width: ${breakpoints.lg}px)`;

/** No computador (lg), o Toast fica no alto; abaixo, na base (decisão 238(1)). */
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia(DESKTOP_QUERY).matches,
  );
  useEffect(() => {
    // Sem matchMedia (ex.: jsdom), fica o padrão do celular.
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return desktop;
}

/**
 * Toast do DS: fila de avisos curtos, na base no celular e no tablet e no alto no
 * computador (Radix Toast: região aria-live, pausa ao passar o mouse ou focar, F8 leva até
 * eles). Entra de baixo com 8 px e sai por opacidade depois de 5 s; arrastar para a borda
 * mais perto fecha.
 */
export function ToastProvider({
  children,
  label,
  dismissLabel,
  duration = 5000,
  viewportClassName,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const desktop = useIsDesktop();

  const showToast = useCallback((toast: ToastOptions) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() + Math.random() }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  function remove({ id }: { id: number }) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider
        label={label}
        duration={duration}
        swipeDirection={desktop ? 'up' : 'down'}
      >
        {children}
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CircleCheck : Info;
          return (
            <RadixToast.Root
              key={toast.id}
              className={joinClassNames({ names: ['kore-toast', `kore-toast--${toast.tone}`] })}
              type={toast.tone === 'danger' || toast.action ? 'foreground' : 'background'}
              {...(toast.action && { duration: Infinity })}
              onOpenChange={(open) => {
                if (!open) remove({ id: toast.id });
              }}
            >
              <Icon className="kore-toast__icon" aria-hidden="true" strokeWidth={1.75} />
              <RadixToast.Description className="kore-toast__message">
                {toast.message}
              </RadixToast.Description>
              {toast.action && (
                <RadixToast.Action
                  className="kore-toast__action"
                  altText={toast.action.label}
                  onClick={toast.action.onClick}
                >
                  {toast.action.label}
                </RadixToast.Action>
              )}
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
