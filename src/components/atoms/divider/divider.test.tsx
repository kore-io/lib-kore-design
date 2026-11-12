import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Divider } from './divider';

describe('Divider', () => {
  it('horizontal por padrão, como separador', () => {
    render(<Divider />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('kore-divider', 'kore-divider--horizontal');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('vertical com aria-orientation', () => {
    render(<Divider orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('kore-divider--vertical');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('é acessível', async () => {
    const { container } = render(
      <div>
        <Divider />
        <Divider orientation="vertical" />
      </div>,
    );
    await expectNoA11yViolations({ container });
  });
});
