import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('é um textarea nativo na caixa dos campos, com o ref e os props', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <Textarea ref={ref} aria-label="Colar a lista" placeholder="Família Moreira: Luiz, Célia" />,
    );
    const field = screen.getByRole('textbox', { name: 'Colar a lista' });
    expect(ref.current).toBe(field);
    expect(field.tagName).toBe('TEXTAREA');
    expect(container.firstElementChild).toHaveClass('kore-field-box', 'kore-textarea');
    await user.type(field, 'Família Moreira: Luiz{Enter}Carla Nunes + 2 filhos');
    expect(field).toHaveValue('Família Moreira: Luiz\nCarla Nunes + 2 filhos');
  });

  it('com erro, marca a caixa e o aria-invalid', () => {
    const { container } = render(<Textarea aria-label="Lista" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(container.firstElementChild).toHaveClass('kore-field-box--invalid');
  });

  it('desabilitado', () => {
    const { container } = render(<Textarea aria-label="Lista" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(container.firstElementChild).toHaveClass('kore-field-box--disabled');
  });

  it('é acessível', async () => {
    const { container } = render(<Textarea aria-label="Colar a lista" />);
    await expectNoA11yViolations({ container });
  });
});
