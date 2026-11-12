import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { SegmentedControl } from './segmented-control';

const OPTIONS = [
  { value: 'visitor', label: 'Visitante' },
  { value: 'party', label: 'Grupo' },
] as const;

function Controlled({ onChange = vi.fn(), disabled = false }) {
  const [value, setValue] = useState<'visitor' | 'party'>('visitor');
  return (
    <SegmentedControl
      label="Ver como"
      options={OPTIONS}
      value={value}
      disabled={disabled}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe('SegmentedControl', () => {
  it('é um grupo de rádios rotulado, com o segmento ativo marcado', () => {
    render(<Controlled />);
    const group = screen.getByRole('radiogroup', { name: 'Ver como' });
    expect(group).toHaveClass('kore-segmented');
    expect(screen.getByRole('radio', { name: 'Visitante' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Grupo' })).not.toBeChecked();
  });

  it('o clique e as setas trocam o segmento e avisam o app', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.click(screen.getByText('Grupo'));
    expect(screen.getByRole('radio', { name: 'Grupo' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('party');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Visitante' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('visitor');
  });

  it('desabilitado não troca', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} disabled />);
    await user.click(screen.getByText('Grupo'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Grupo' })).toBeDisabled();
  });

  it('é acessível', async () => {
    const { container } = render(<Controlled />);
    await expectNoA11yViolations({ container });
  });
});
