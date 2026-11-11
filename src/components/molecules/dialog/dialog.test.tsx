import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Button } from '../../atoms/button/button';
import { Dialog } from './dialog';

function Confirm({ onConfirm = vi.fn() }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Regenerar link
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Regenerar o link da Família Moreira?"
        description="O link antigo para de funcionar na hora."
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Regenerar link
            </Button>
          </>
        }
      />
    </>
  );
}

describe('Dialog', () => {
  it('é um alertdialog com o título como nome e o texto como descrição', async () => {
    const user = userEvent.setup();
    render(<Confirm />);
    await user.click(screen.getByRole('button', { name: 'Regenerar link' }));
    const dialog = screen.getByRole('alertdialog', {
      name: 'Regenerar o link da Família Moreira?',
    });
    expect(dialog).toHaveAccessibleDescription('O link antigo para de funcionar na hora.');
    expect(dialog).toHaveClass('kore-dialog');
  });

  it('a ação principal chama o app; Cancelar e Esc fecham e devolvem o foco', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Confirm onConfirm={onConfirm} />);
    const trigger = screen.getByRole('button', { name: 'Regenerar link' });
    await user.click(trigger);
    const dialog = screen.getByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Regenerar link' }));
    expect(onConfirm).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('com campo, pode ser um dialog sem descrição', () => {
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        role="dialog"
        title="Mover Pedro Moreira"
        actions={null}
      >
        <label>
          Grupo <input />
        </label>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Mover Pedro Moreira' });
    expect(dialog).not.toHaveAttribute('aria-describedby');
    expect(screen.getByRole('textbox', { name: 'Grupo' })).toBeInTheDocument();
  });

  it('é acessível aberto', async () => {
    const user = userEvent.setup();
    render(<Confirm />);
    await user.click(screen.getByRole('button', { name: 'Regenerar link' }));
    // O Radix põe o diálogo num portal no body, fora dos landmarks (como o Menu do usuário).
    await expectNoA11yViolations({ container: document.body, disabledRules: ['region'] });
  });
});
