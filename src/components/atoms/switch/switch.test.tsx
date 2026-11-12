import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Switch } from './switch';

describe('Switch', () => {
  it('é um switch nativo rotulado pelo texto, com o controle decorativo', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Switch ref={ref}>Mostrar a seção no site</Switch>);
    const control = screen.getByRole('switch', { name: 'Mostrar a seção no site' });
    expect(ref.current).toBe(control);
    expect(control).not.toBeChecked();
    expect(container.querySelector('.kore-switch__control')).toHaveAttribute('aria-hidden', 'true');
  });

  it('liga e desliga pelo clique e pelo espaço, e avisa o onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Mostrar a contagem no site</Switch>);
    const control = screen.getByRole('switch');
    await user.click(screen.getByText('Mostrar a contagem no site'));
    expect(control).toBeChecked();
    control.focus();
    await user.keyboard(' ');
    expect(control).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('desabilitado não muda', async () => {
    const user = userEvent.setup();
    render(
      <Switch disabled defaultChecked>
        Mostrar a contagem no site
      </Switch>,
    );
    await user.click(screen.getByText('Mostrar a contagem no site'));
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('sem texto, leva o nome do aria-label', () => {
    const { container } = render(<Switch aria-label="Mostrar a seção no site" />);
    expect(screen.getByRole('switch', { name: 'Mostrar a seção no site' })).toBeInTheDocument();
    expect(container.querySelector('.kore-switch__label')).toBeNull();
  });

  it('é acessível, ligado e desligado', async () => {
    const { container } = render(
      <>
        <Switch defaultChecked>Ligado</Switch>
        <Switch>Desligado</Switch>
      </>,
    );
    await expectNoA11yViolations({ container });
  });
});
