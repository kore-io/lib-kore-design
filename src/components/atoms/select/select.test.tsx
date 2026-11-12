import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Label } from '../label/label';
import { Select } from './select';

function renderSelect(props: Partial<Parameters<typeof Select>[0]> = {}) {
  return render(
    <>
      <Label htmlFor="age">Faixa etária</Label>
      <Select id="age" placeholder="Selecione" {...props}>
        <option value="adult">Adulto</option>
        <option value="child">Criança</option>
      </Select>
    </>,
  );
}

describe('Select', () => {
  it('começa no placeholder (Vazio) e sai dele ao escolher, sem controle', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange });
    const select = screen.getByRole('combobox', { name: 'Faixa etária' });
    expect(select).toHaveValue('');
    expect(select.parentElement).toHaveClass('kore-select--placeholder');

    await user.selectOptions(select, 'Adulto');
    expect(select).toHaveValue('adult');
    expect(select.parentElement).not.toHaveClass('kore-select--placeholder');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('controlado: o placeholder segue o value', () => {
    const { rerender } = render(
      <Select aria-label="Faixa etária" placeholder="Selecione" value="" onChange={() => {}}>
        <option value="adult">Adulto</option>
      </Select>,
    );
    expect(screen.getByRole('combobox').parentElement).toHaveClass('kore-select--placeholder');
    rerender(
      <Select aria-label="Faixa etária" placeholder="Selecione" value="adult" onChange={() => {}}>
        <option value="adult">Adulto</option>
      </Select>,
    );
    expect(screen.getByRole('combobox').parentElement).not.toHaveClass('kore-select--placeholder');
  });

  it('a opção do placeholder não é escolhível', () => {
    const { container } = renderSelect();
    const option = container.querySelector('option[value=""]');
    expect(option).toHaveTextContent('Selecione');
    expect(option).toBeDisabled();
  });

  it('Erro e Desabilitado', () => {
    const ref = createRef<HTMLSelectElement>();
    renderSelect({ invalid: true, disabled: true, ref });
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toBeDisabled();
    expect(ref.current?.parentElement).toHaveClass(
      'kore-field-box--invalid',
      'kore-field-box--disabled',
    );
  });

  it('é acessível', async () => {
    const { container } = renderSelect();
    await expectNoA11yViolations({ container });
  });
});
