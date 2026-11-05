import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Radio } from './radio';

function renderGroup({ onChange = vi.fn(), disabled = false } = {}) {
  return render(
    <fieldset>
      <legend>Presença</legend>
      <Radio name="presence" value="yes" onChange={onChange} disabled={disabled}>
        Vai
      </Radio>
      <Radio name="presence" value="no" onChange={onChange}>
        Não vai
      </Radio>
    </fieldset>,
  );
}

describe('Radio', () => {
  it('é um radio nativo rotulado pelo texto, com o controle decorativo', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Radio ref={ref} name="presence" value="yes">
        Vai
      </Radio>,
    );
    const radio = screen.getByRole('radio', { name: 'Vai' });
    expect(ref.current).toBe(radio);
    expect(radio).toHaveClass('kore-radio__input');
    expect(container.querySelector('.kore-radio__control')).toHaveAttribute('aria-hidden', 'true');
  });

  it('marca pelo clique no texto e só um por grupo', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderGroup({ onChange });
    await user.click(screen.getByText('Vai'));
    expect(screen.getByRole('radio', { name: 'Vai' })).toBeChecked();
    await user.click(screen.getByText('Não vai'));
    expect(screen.getByRole('radio', { name: 'Vai' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Não vai' })).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('desabilitado não marca', async () => {
    const user = userEvent.setup();
    renderGroup({ disabled: true });
    await user.click(screen.getByText('Vai'));
    expect(screen.getByRole('radio', { name: 'Vai' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Vai' })).not.toBeChecked();
  });

  it('é acessível', async () => {
    const { container } = renderGroup();
    await expectNoA11yViolations({ container });
  });
});
