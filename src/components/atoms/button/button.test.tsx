import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Button, type ButtonSize, type ButtonVariant } from './button';

describe('Button', () => {
  it('é um <button type="button"> primário M por padrão, com classes semânticas', () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toBe('kore-button kore-button--primary kore-button--md');
  });

  it.each<[ButtonVariant, ButtonSize]>([
    ['secondary', 'sm'],
    ['ghost', 'lg'],
    ['destructive', 'md'],
  ])('aplica a variante %s e o tamanho %s como modificadores', (variant, size) => {
    render(
      <Button variant={variant} size={size}>
        Ação
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      `kore-button--${variant}`,
      `kore-button--${size}`,
    );
  });

  it('aceita type="submit", classe extra do app e ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button type="submit" className="kore-login__submit" ref={ref}>
        Entrar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Entrar' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('kore-button', 'kore-login__submit');
    expect(ref.current).toBe(button);
  });

  it('chama onClick e não chama quando desabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Continuar</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Continuar
      </Button>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('é acessível', async () => {
    const { container } = render(
      <>
        <Button>Salvar</Button>
        <Button variant="secondary" disabled>
          Pré-visualizar
        </Button>
      </>,
    );
    await expectNoA11yViolations({ container });
  });
});
