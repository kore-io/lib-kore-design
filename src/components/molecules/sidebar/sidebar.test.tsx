import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutDashboard, Users } from 'lucide-react';
import { useState } from 'react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Logo } from '../../atoms/logo/logo';
import { NavItem } from '../../atoms/nav-item/nav-item';
import { Sidebar } from './sidebar';
import { SidebarDrawer } from './sidebar-drawer';

const items = (
  <>
    <NavItem href="#dashboard" icon={<LayoutDashboard />} current>
      Dashboard
    </NavItem>
    <NavItem href="#convidados" icon={<Users />}>
      Convidados
    </NavItem>
  </>
);

describe('Sidebar', () => {
  it('é um complementar com o logo e a navegação rotulada pelo app', () => {
    render(
      <Sidebar logo={<Logo label="Kore" />} navLabel="Menu principal">
        {items}
      </Sidebar>,
    );
    expect(screen.getByRole('complementary')).toHaveClass('kore-sidebar');
    expect(screen.getByRole('img', { name: 'Kore' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Menu principal' });
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Dashboard' }));
  });

  it('é acessível', async () => {
    const { container } = render(
      <Sidebar logo={<Logo label="Kore" />} navLabel="Menu principal">
        {items}
      </Sidebar>,
    );
    await expectNoA11yViolations({ container });
  });
});

function DrawerHarness({
  onOpenChange = vi.fn(),
}: {
  onOpenChange?: (change: { open: boolean }) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir menu
      </button>
      <SidebarDrawer
        open={open}
        onOpenChange={(change) => {
          onOpenChange(change);
          setOpen(change.open);
        }}
        id="drawer"
        title="Menu"
        closeLabel="Fechar menu"
        logo={<Logo label="Kore" />}
        navLabel="Menu principal"
      >
        {items}
      </SidebarDrawer>
    </>
  );
}

describe('SidebarDrawer', () => {
  it('abre como diálogo modal com título oculto, logo, fechar e navegação', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(dialog).toHaveClass('kore-drawer');
    expect(dialog).toHaveAttribute('id', 'drawer');
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument();
  });

  it('fecha pelo botão, pelo Esc e ao escolher um item', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DrawerHarness onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('link', { name: 'Convidados' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('é acessível aberto', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await expectNoA11yViolations({ container: document.body });
  });

  it('fecha sozinho quando a tela chega a 1024 px (a Sidebar fixa assume)', async () => {
    const user = userEvent.setup();
    let notify = () => {};
    let desktop = false;
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return desktop;
        },
        media: query,
        addEventListener: (_event: string, listener: () => void) => {
          notify = listener;
        },
        removeEventListener: vi.fn(),
      })),
    );
    const onOpenChange = vi.fn();
    render(<DrawerHarness onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    desktop = true;
    act(() => notify());
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
