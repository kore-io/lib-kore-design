import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Button } from '../../atoms/button/button';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('Aguardando: ícone decorativo, título (h2) e apoio, sem ação', () => {
    const { container } = render(
      <EmptyState icon={<Users strokeWidth={1.75} />} title="Título" description="Apoio" />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Título' })).toHaveClass(
      'kore-empty-state__title',
    );
    expect(screen.getByText('Apoio')).toHaveClass('kore-empty-state__description');
    expect(container.querySelector('.kore-empty-state__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('.kore-empty-state__action')).toBeNull();
  });

  it('Com ação e título em h3', () => {
    render(
      <EmptyState
        icon={<Users />}
        title="Título"
        titleAs="h3"
        action={<Button>Adicionar</Button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar' }).parentElement).toHaveClass(
      'kore-empty-state__action',
    );
  });

  it('é acessível', async () => {
    const { container } = render(
      <EmptyState
        icon={<Users />}
        title="Título"
        description="Apoio"
        action={<Button>Adicionar</Button>}
      />,
    );
    await expectNoA11yViolations({ container });
  });
});
