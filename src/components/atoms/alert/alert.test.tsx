import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Alert, type AlertTone } from './alert';

describe('Alert', () => {
  it.each<AlertTone>(['info', 'success', 'warning', 'danger'])(
    'tom %s: modificador, ícone decorativo, título e texto de apoio',
    (tone) => {
      const { container } = render(
        <Alert tone={tone} title="Título">
          Texto de apoio
        </Alert>,
      );
      expect(container.firstChild).toHaveClass('kore-alert', `kore-alert--${tone}`);
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('Título')).toHaveClass('kore-alert__title');
      expect(screen.getByText('Texto de apoio')).toHaveClass('kore-alert__description');
    },
  );

  it('sem título, só o texto', () => {
    const { container } = render(<Alert tone="info">Só o texto</Alert>);
    expect(container.querySelector('.kore-alert__title')).toBeNull();
  });

  it('role="alert" para mensagem que aparece depois de uma ação', () => {
    render(
      <Alert tone="danger" role="alert" title="Não deu certo">
        Tente de novo.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Não deu certoTente de novo.');
  });

  it('é acessível', async () => {
    const { container } = render(
      <Alert tone="warning" title="Título">
        Texto de apoio
      </Alert>,
    );
    await expectNoA11yViolations({ container });
  });
});
