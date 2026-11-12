import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { GoogleButton } from './google-button';

describe('GoogleButton', () => {
  it('é um Button secundário G com o logo decorativo e o texto do app', () => {
    const { container } = render(<GoogleButton>Continuar com Google</GoogleButton>);
    const button = screen.getByRole('button', { name: 'Continuar com Google' });
    expect(button).toHaveClass(
      'kore-button',
      'kore-button--secondary',
      'kore-button--lg',
      'kore-google-button',
    );
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('é acessível', async () => {
    const { container } = render(<GoogleButton>Continuar com Google</GoogleButton>);
    await expectNoA11yViolations({ container });
  });
});
