import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Label } from '../label/label';
import { Input } from './input';

describe('Input', () => {
  it('é um campo de texto dentro da caixa do DS, com ref e props no <input>', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} name="email" type="email" placeholder="seu@email.com" />);
    const field = screen.getByRole('textbox');
    expect(ref.current).toBe(field);
    expect(field).toHaveAttribute('name', 'email');
    expect(field).toHaveClass('kore-input__field');
    expect(field.parentElement).toHaveClass('kore-field-box', 'kore-input');
    expect(field).not.toHaveAttribute('aria-invalid');

    await user.type(field, 'casal@kore.com.br');
    expect(field).toHaveValue('casal@kore.com.br');
  });

  it('Erro: aria-invalid, modificador da caixa e ícone decorativo', () => {
    const { container } = render(<Input invalid aria-describedby="email-error" />);
    const field = screen.getByRole('textbox');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field.parentElement).toHaveClass('kore-field-box--invalid');
    expect(container.querySelector('.kore-input__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('Desabilitado: campo desabilitado e modificador da caixa', () => {
    render(<Input disabled defaultValue="Célia Moreira" />);
    const field = screen.getByRole('textbox');
    expect(field).toBeDisabled();
    expect(field.parentElement).toHaveClass('kore-field-box--disabled');
  });

  it('é acessível com Label, inclusive em erro', async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" invalid aria-describedby="email-error" />
        <p id="email-error">Mensagem de erro</p>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAccessibleDescription(
      'Mensagem de erro',
    );
    await expectNoA11yViolations({ container });
  });
});
