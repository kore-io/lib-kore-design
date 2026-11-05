import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Badge } from '../../atoms/badge/badge';
import { Topbar } from './topbar';

describe('Topbar', () => {
  it('é o banner com ☰, título, selo e ações', async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    render(
      <Topbar
        title="Ana & Marcos"
        status={<Badge tone="success">Publicado</Badge>}
        actions={<button type="button">Notificações</button>}
        menuLabel="Abrir menu"
        onMenuClick={onMenuClick}
        menuExpanded={false}
        menuControls="drawer"
      />,
    );
    expect(screen.getByRole('banner')).toHaveClass('kore-topbar');
    expect(screen.getByText('Ana & Marcos')).toHaveClass('kore-topbar__title');
    expect(screen.getByText('Publicado').parentElement).toHaveClass('kore-topbar__status');
    const menu = screen.getByRole('button', { name: 'Abrir menu' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveAttribute('aria-controls', 'drawer');
    await user.click(menu);
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('é acessível', async () => {
    const { container } = render(
      <Topbar title="Ana & Marcos" menuLabel="Abrir menu" onMenuClick={() => {}} />,
    );
    await expectNoA11yViolations({ container });
  });
});
