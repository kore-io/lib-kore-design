import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('é um checkbox nativo rotulado pelo texto, com o controle decorativo', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Checkbox ref={ref}>Lembrar</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar' });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveClass('kore-checkbox__input');
    expect(container.querySelector('.kore-checkbox__control')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('sem texto, leva o nome do aria-label e não desenha o rótulo', () => {
    const { container } = render(<Checkbox aria-label="Selecionar Família Moreira" />);
    expect(screen.getByRole('checkbox', { name: 'Selecionar Família Moreira' })).toBeVisible();
    expect(container.querySelector('.kore-checkbox__label')).toBeNull();
  });

  it('marca e desmarca pelo clique, e avisa o onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Lembrar</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar' });
    await user.click(screen.getByText('Lembrar'));
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('indeterminado liga e desliga o estado nativo (leitor de tela: misto)', () => {
    const { rerender } = render(
      <Checkbox aria-label="Selecionar todos" indeterminate onChange={() => undefined} />,
    );
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toBePartiallyChecked();
    rerender(<Checkbox aria-label="Selecionar todos" onChange={() => undefined} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('desabilitado não marca', async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled>Lembrar</Checkbox>);
    await user.click(screen.getByText('Lembrar'));
    expect(screen.getByRole('checkbox', { name: 'Lembrar' })).not.toBeChecked();
  });

  it('é acessível', async () => {
    const { container } = render(
      <div>
        <Checkbox>Lembrar</Checkbox>
        <Checkbox aria-label="Selecionar todos" indeterminate onChange={() => undefined} />
      </div>,
    );
    await expectNoA11yViolations({ container });
  });
});
