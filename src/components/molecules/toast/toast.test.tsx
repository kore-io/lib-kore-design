import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { ToastProvider, useToast, type ToastTone } from './toast';

function Trigger({ tone, message }: { tone: ToastTone; message: string }) {
  const { showToast } = useToast();
  return (
    <button type="button" onClick={() => showToast({ tone, message })}>
      Mostrar
    </button>
  );
}

function renderWithProvider({
  tone = 'success',
  message = 'Mensagem do app',
  duration,
}: { tone?: ToastTone; message?: string; duration?: number } = {}) {
  return render(
    <ToastProvider label="Avisos" dismissLabel="Fechar" {...(duration && { duration })}>
      <main>
        <Trigger tone={tone} message={message} />
      </main>
    </ToastProvider>,
  );
}

describe('Toast', () => {
  it('mostra o aviso com o tom e o texto do app, numa região rotulada', async () => {
    const user = userEvent.setup();
    renderWithProvider({ tone: 'success' });
    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    const toast = screen.getByText('Mensagem do app').closest('.kore-toast');
    expect(toast).toHaveClass('kore-toast', 'kore-toast--success');
    expect(screen.getByRole('region', { name: 'Avisos (F8)' })).toContainElement(
      toast as HTMLElement,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('o X fecha o aviso', async () => {
    const user = userEvent.setup();
    renderWithProvider({ tone: 'danger' });
    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(screen.getByText('Mensagem do app').closest('.kore-toast')).toHaveClass(
      'kore-toast--danger',
    );
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(document.querySelector('.kore-toast')).toBeNull());
  });

  it('sai sozinho depois da duração', async () => {
    const user = userEvent.setup();
    renderWithProvider({ duration: 50 });
    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(document.querySelector('.kore-toast')).not.toBeNull();
    await waitFor(() => expect(document.querySelector('.kore-toast')).toBeNull(), {
      timeout: 1000,
    });
  });

  it('com ação: o botão da ação, que chama o app e fecha o aviso; não sai sozinho', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    function WithAction() {
      const { showToast } = useToast();
      return (
        <button
          type="button"
          onClick={() =>
            showToast({
              tone: 'danger',
              message: 'O navegador bloqueou a nova aba.',
              action: { label: 'Abrir a prévia', onClick },
            })
          }
        >
          Mostrar
        </button>
      );
    }
    render(
      <ToastProvider label="Avisos" dismissLabel="Fechar" duration={50}>
        <WithAction />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    // Passada a duração dos outros avisos, o com ação continua.
    await new Promise((resolve) => setTimeout(resolve, 200));
    const action = screen.getByRole('button', { name: 'Abrir a prévia' });
    expect(action).toHaveClass('kore-toast__action');
    await user.click(action);
    expect(onClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(document.querySelector('.kore-toast')).toBeNull());
  });

  it('useToast sem o provider avisa o erro', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger tone="success" message="x" />)).toThrow(/ToastProvider/);
  });

  it('é acessível com o aviso aberto', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider();
    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    await expectNoA11yViolations({ container, disabledRules: ['region'] });
  });
});
