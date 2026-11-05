import { render, screen } from '@testing-library/react';
import { Check } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Badge, type BadgeTone } from './badge';

describe('Badge', () => {
  it.each<BadgeTone>(['info', 'success', 'warning', 'danger', 'neutral', 'highlight'])(
    'tom %s como modificador, com o texto do app',
    (tone) => {
      render(<Badge tone={tone}>Status</Badge>);
      expect(screen.getByText('Status')).toHaveClass('kore-badge', `kore-badge--${tone}`);
    },
  );

  it('ícone decorativo à esquerda muda o recuo', () => {
    const { container } = render(
      <Badge tone="success" icon={<Check strokeWidth={2.4} />}>
        Confirmado
      </Badge>,
    );
    expect(screen.getByText('Confirmado')).toHaveClass('kore-badge--with-icon');
    expect(container.querySelector('.kore-badge__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('é acessível', async () => {
    const { container } = render(
      <Badge tone="highlight" icon={<Check strokeWidth={2.4} />}>
        Novo
      </Badge>,
    );
    await expectNoA11yViolations({ container });
  });
});
