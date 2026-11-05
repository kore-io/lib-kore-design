import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { UserMenu, type UserMenuProps } from './user-menu';

function props(overrides: Partial<UserMenuProps> = {}): UserMenuProps {
  return {
    user: { name: 'Ana Beatriz', email: 'ana@exemplo.com', initials: 'AB' },
    activeProfile: 'Perfil ativo: Casal',
    label: 'Menu do usuário',
    groups: [
      [
        { id: 'profile', label: 'Meu perfil', onSelect: vi.fn() },
        { id: 'settings', label: 'Configurações', onSelect: vi.fn() },
      ],
      [{ id: 'switch', label: 'Trocar de perfil', detail: 'Cerimonialista', onSelect: vi.fn() }],
      [{ id: 'logout', label: 'Sair', onSelect: vi.fn() }],
    ],
    ...overrides,
  };
}

/** Simula a largura da tela pela media query do componente. */
function mockViewport({ popover }: { popover: boolean }) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: popover,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('UserMenu no tablet e no computador (popover)', () => {
  it('o gatilho abre o menu com cabeçalho, perfil ativo e itens', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: true });
    render(<UserMenu {...props()} />);
    const trigger = screen.getByRole('button', { name: 'Menu do usuário' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await user.click(trigger);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('kore-user-menu__popover');
    expect(menu).toHaveTextContent('ana@exemplo.com');
    expect(menu).toHaveTextContent('Perfil ativo: Casal');
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Meu perfil',
      'Configurações',
      'Trocar de perfil Cerimonialista',
      'Sair',
    ]);
    expect(screen.getAllByRole('separator')).toHaveLength(3);
  });

  it('escolher um item chama o app e fecha', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: true });
    const menuProps = props();
    render(<UserMenu {...menuProps} />);
    await user.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sair' }));
    expect(menuProps.groups[2]?.[0]?.onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('é acessível aberto', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: true });
    render(<UserMenu {...props()} />);
    await user.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    // O Radix põe o menu num portal no body, fora dos landmarks; a regra `region` é de
    // boa prática (não WCAG) e não se aplica a conteúdo flutuante.
    await expectNoA11yViolations({ container: document.body, disabledRules: ['region'] });
  });
});

describe('UserMenu no celular (folha inferior)', () => {
  it('abre a folha modal com o título oculto, o cabeçalho e os itens', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: false });
    render(<UserMenu {...props()} />);
    await user.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    const sheet = screen.getByRole('dialog', { name: 'Menu do usuário' });
    expect(sheet).toHaveClass('kore-user-menu__sheet');
    expect(sheet).toHaveTextContent('ana@exemplo.com');
    expect(
      screen.getByRole('button', { name: 'Trocar de perfil Cerimonialista' }),
    ).toBeInTheDocument();
  });

  it('escolher um item fecha a folha e chama o app', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: false });
    const menuProps = props();
    render(<UserMenu {...menuProps} />);
    await user.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    await user.click(screen.getByRole('button', { name: 'Meu perfil' }));
    expect(menuProps.groups[0]?.[0]?.onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('é acessível aberto', async () => {
    const user = userEvent.setup();
    mockViewport({ popover: false });
    render(<UserMenu {...props()} />);
    await user.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    // O Radix põe o menu num portal no body, fora dos landmarks; a regra `region` é de
    // boa prática (não WCAG) e não se aplica a conteúdo flutuante.
    await expectNoA11yViolations({ container: document.body, disabledRules: ['region'] });
  });
});
