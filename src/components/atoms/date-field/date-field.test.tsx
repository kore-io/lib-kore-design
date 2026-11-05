import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Label } from '../label/label';
import { DateField } from './date-field';

function renderDateField(props: Partial<Parameters<typeof DateField>[0]> = {}) {
  return render(
    <>
      <Label htmlFor="date">Data do casamento</Label>
      <DateField id="date" {...props} />
    </>,
  );
}

describe('DateField', () => {
  it('é um campo de data com o rótulo, vazio por padrão', () => {
    renderDateField();
    const field = screen.getByLabelText('Data do casamento');
    expect(field).toHaveAttribute('type', 'date');
    expect(field.parentElement).toHaveClass('kore-field-box', 'kore-date-field--empty');
  });

  it('sai do estado vazio ao receber uma data (ISO), sem controle', () => {
    const onChange = vi.fn();
    renderDateField({ onChange });
    const field = screen.getByLabelText('Data do casamento');
    fireEvent.change(field, { target: { value: '2026-11-14' } });
    expect(field).toHaveValue('2026-11-14');
    expect(field.parentElement).not.toHaveClass('kore-date-field--empty');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('abre o calendário do sistema ao clicar, quando o navegador permite', () => {
    const ref = createRef<HTMLInputElement>();
    renderDateField({ ref });
    const showPicker = vi.fn();
    Object.assign(ref.current as HTMLInputElement, { showPicker });
    fireEvent.click(ref.current as HTMLInputElement);
    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it('Erro e Desabilitado', () => {
    const { container } = renderDateField({
      invalid: true,
      disabled: true,
      defaultValue: '2026-11-14',
    });
    expect(container.querySelector('.kore-date-field__error-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    const field = screen.getByLabelText('Data do casamento');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toBeDisabled();
    expect(field.parentElement).toHaveClass('kore-field-box--invalid', 'kore-field-box--disabled');
    expect(field.parentElement).not.toHaveClass('kore-date-field--empty');
  });

  it('é acessível', async () => {
    const { container } = renderDateField();
    await expectNoA11yViolations({ container });
  });
});
