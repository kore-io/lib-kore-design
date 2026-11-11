import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('mostra o rótulo, o número e a linha de apoio, nessa ordem', () => {
    const { container } = render(<StatCard label="Válidas" value={142} detail="viram 58 grupos" />);
    expect(container.firstElementChild).toHaveClass('kore-stat-card');
    expect(container.firstElementChild?.textContent).toBe('Válidas142viram 58 grupos');
    expect(screen.getByText('142')).toHaveClass('kore-stat-card__value');
  });

  it('sem linha de apoio, só o rótulo e o número', () => {
    const { container } = render(<StatCard label="Com erro" value={2} />);
    expect(container.querySelector('.kore-stat-card__detail')).toBeNull();
  });

  it('é acessível', async () => {
    const { container } = render(<StatCard label="Duplicadas" value={1} detail="ficam de fora" />);
    await expectNoA11yViolations({ container });
  });
});
