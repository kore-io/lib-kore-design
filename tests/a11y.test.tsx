import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from './a11y';

describe('base de testes de componente (RTL + axe)', () => {
  it('passa com marcação acessível', async () => {
    const { container } = render(
      <button type="button" aria-label="Fechar">
        ×
      </button>,
    );
    await expectNoA11yViolations({ container });
  });

  it('acusa marcação inacessível', async () => {
    const { container } = render(<button type="button" />);
    await expect(expectNoA11yViolations({ container })).rejects.toThrow(/button-name/);
  });
});
