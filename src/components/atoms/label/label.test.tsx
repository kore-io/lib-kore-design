import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Label } from './label';

describe('Label', () => {
  it('rotula o campo pelo htmlFor', () => {
    render(
      <>
        <Label htmlFor="name">Nome do convidado</Label>
        <input id="name" />
      </>,
    );
    expect(screen.getByLabelText('Nome do convidado')).toBe(screen.getByRole('textbox'));
    expect(screen.getByText('Nome do convidado')).toHaveClass('kore-label');
  });

  it('mostra a marca de opcional com o texto do app, dentro do nome acessível', () => {
    render(
      <>
        <Label htmlFor="phone" optionalText="(opcional)">
          Telefone
        </Label>
        <input id="phone" />
      </>,
    );
    expect(screen.getByText('(opcional)')).toHaveClass('kore-label__optional');
    expect(screen.getByRole('textbox', { name: 'Telefone (opcional)' })).toBeInTheDocument();
  });

  it('é acessível', async () => {
    const { container } = render(
      <>
        <Label htmlFor="phone" optionalText="(opcional)">
          Telefone
        </Label>
        <input id="phone" />
      </>,
    );
    await expectNoA11yViolations({ container });
  });
});
