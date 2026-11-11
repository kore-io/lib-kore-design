import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Tab, Tabs } from './tab';

function renderTabs() {
  return render(
    <Tabs aria-label="Convidados">
      <Tab href="/app/convidados" current>
        Grupos e convidados
      </Tab>
      <Tab href="/app/convidados/lixeira">Lixeira</Tab>
    </Tabs>,
  );
}

describe('Tabs e Tab', () => {
  it('são uma navegação com links, e só a atual tem aria-current', () => {
    renderTabs();
    expect(screen.getByRole('navigation', { name: 'Convidados' })).toHaveClass('kore-tabs');
    const current = screen.getByRole('link', { name: 'Grupos e convidados' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('kore-tab', 'kore-tab--current');
    const other = screen.getByRole('link', { name: 'Lixeira' });
    expect(other).not.toHaveAttribute('aria-current');
    expect(other).not.toHaveClass('kore-tab--current');
  });

  it('com asChild, o filho é o link e recebe as classes do DS', () => {
    render(
      <Tab asChild current>
        <a href="/app/convidados/tags">Tags · 6 de 10</a>
      </Tab>,
    );
    const link = screen.getByRole('link', { name: 'Tags · 6 de 10' });
    expect(link).toHaveClass('kore-tab', 'kore-tab--current');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('é acessível', async () => {
    const { container } = renderTabs();
    await expectNoA11yViolations({ container });
  });
});
