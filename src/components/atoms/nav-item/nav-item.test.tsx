import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { NavItem } from './nav-item';

/** Simula o Link do roteador: um <a> com props próprias. */
function RouterLink({ to, ...props }: ComponentPropsWithRef<'a'> & { to: string }) {
  return <a href={to} data-router="true" {...props} />;
}

describe('NavItem', () => {
  it('é um link com ícone decorativo e o rótulo do app', () => {
    render(
      <NavItem href="/convidados" icon={<Users strokeWidth={1.75} />}>
        Convidados
      </NavItem>,
    );
    const link = screen.getByRole('link', { name: 'Convidados' });
    expect(link).toHaveAttribute('href', '/convidados');
    expect(link).toHaveClass('kore-nav-item');
    expect(link).not.toHaveAttribute('aria-current');
    expect(link.querySelector('.kore-nav-item__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('Ativo: aria-current="page" e modificador', () => {
    render(
      <NavItem href="/" icon={<Users />} current>
        Dashboard
      </NavItem>,
    );
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('kore-nav-item--current');
  });

  it('asChild: o Link do roteador recebe as classes, o ícone e o estado', () => {
    render(
      <NavItem asChild icon={<Users />} current>
        <RouterLink to="/convidados">Convidados</RouterLink>
      </NavItem>,
    );
    const link = screen.getByRole('link', { name: 'Convidados' });
    expect(link).toHaveAttribute('data-router', 'true');
    expect(link).toHaveAttribute('href', '/convidados');
    expect(link).toHaveClass('kore-nav-item', 'kore-nav-item--current');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link.firstElementChild).toHaveClass('kore-nav-item__icon');
  });

  it('é acessível numa navegação', async () => {
    const { container } = render(
      <nav aria-label="Menu">
        <NavItem href="/" icon={<Users />} current>
          Dashboard
        </NavItem>
        <NavItem href="/convidados" icon={<Users />}>
          Convidados
        </NavItem>
      </nav>,
    );
    await expectNoA11yViolations({ container });
  });
});
