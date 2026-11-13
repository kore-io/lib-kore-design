import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('é um botão com o nome do app e o ícone decorativo', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<Bell size={20} />} label="Notificações" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Notificações' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('kore-icon-button');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('mostra o contador visual só quando há algo a contar', () => {
    const { container, rerender } = render(
      <IconButton icon={<Bell />} label="Notificações, 3 não lidas" count={3} />,
    );
    expect(container.querySelector('.kore-icon-button__count')).toHaveTextContent('3');
    expect(container.querySelector('.kore-icon-button__count')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    rerender(<IconButton icon={<Bell />} label="Notificações, 9 não lidas" count={9} />);
    expect(container.querySelector('.kore-icon-button__count')).toHaveTextContent(/^9$/);
    // Acima de 9, "9+" (decisão 149); o nome acessível continua vindo do app.
    rerender(<IconButton icon={<Bell />} label="Notificações, mais de 9 não lidas" count={12} />);
    expect(container.querySelector('.kore-icon-button__count')).toHaveTextContent(/^9\+$/);
    expect(screen.getByRole('button')).toHaveAccessibleName('Notificações, mais de 9 não lidas');
    rerender(<IconButton icon={<Bell />} label="Notificações" count={0} />);
    expect(container.querySelector('.kore-icon-button__count')).toBeNull();
  });

  it('é acessível', async () => {
    const { container } = render(<IconButton icon={<Bell />} label="Notificações" count={3} />);
    await expectNoA11yViolations({ container });
  });
});
