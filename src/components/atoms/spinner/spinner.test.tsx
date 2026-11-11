import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('é um status com o nome do app, e o ícone é decorativo', () => {
    const { container } = render(<Spinner label="Carregando mais grupos" />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando mais grupos');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('é acessível', async () => {
    const { container } = render(<Spinner label="Carregando mais grupos" />);
    await expectNoA11yViolations({ container });
  });
});
