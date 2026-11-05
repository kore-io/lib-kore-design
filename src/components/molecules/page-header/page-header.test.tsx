import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Button } from '../../atoms/button/button';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('título como h1, resumo e ações', () => {
    render(
      <PageHeader
        title="Convidados"
        description="Resumo da página"
        actions={<Button>Novo grupo</Button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Convidados' })).toHaveClass(
      'kore-page-header__title',
    );
    expect(screen.getByText('Resumo da página')).toHaveClass('kore-page-header__description');
    expect(screen.getByRole('button', { name: 'Novo grupo' }).parentElement).toHaveClass(
      'kore-page-header__actions',
    );
  });

  it('sem resumo nem ações', () => {
    const { container } = render(<PageHeader title="Convidados" />);
    expect(container.querySelector('.kore-page-header__description')).toBeNull();
    expect(container.querySelector('.kore-page-header__actions')).toBeNull();
  });

  it('é acessível', async () => {
    const { container } = render(
      <PageHeader title="Convidados" description="Resumo" actions={<Button>Novo grupo</Button>} />,
    );
    await expectNoA11yViolations({ container });
  });
});
