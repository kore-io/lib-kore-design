import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Logo } from './logo';

describe('Logo', () => {
  it('é uma imagem com o nome do app, na versão Vinho por padrão', () => {
    render(<Logo label="Kore" />);
    const logo = screen.getByRole('img', { name: 'Kore' });
    expect(logo).toHaveClass('kore-logo', 'kore-logo--wine');
    expect(logo).toHaveAttribute('viewBox', '64 4290 86.4 32');
  });

  it('versão Branco', () => {
    render(<Logo label="Kore" variant="white" />);
    expect(screen.getByRole('img', { name: 'Kore' })).toHaveClass('kore-logo--white');
  });

  it('é acessível', async () => {
    const { container } = render(<Logo label="Kore" />);
    await expectNoA11yViolations({ container });
  });
});
