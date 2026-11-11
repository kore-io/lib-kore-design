import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Button } from '../../atoms/button/button';
import { Tag } from '../../atoms/tag/tag';
import { ActionMenu } from './action-menu';

function renderMenu({ onOpen = vi.fn(), onTrash = vi.fn() } = {}) {
  render(
    <ActionMenu
      label="Ações de Família Moreira"
      groups={[
        [{ id: 'open', label: 'Abrir', onSelect: onOpen }],
        [{ id: 'trash', label: 'Mover para a lixeira', destructive: true, onSelect: onTrash }],
      ]}
    />,
  );
  return { onOpen, onTrash };
}

describe('ActionMenu', () => {
  it('o botão ⋮ tem o nome do app e abre os itens, com a linha entre os grupos', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Ações de Família Moreira' }));
    const items = screen.getAllByRole('menuitem');
    expect(items.map((item) => item.textContent)).toEqual(['Abrir', 'Mover para a lixeira']);
    expect(items[1]).toHaveClass('kore-action-menu__item--destructive');
    expect(items[0]).not.toHaveClass('kore-action-menu__item--destructive');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('escolher um item chama a ação e fecha o menu', async () => {
    const user = userEvent.setup();
    const { onTrash, onOpen } = renderMenu();
    await user.click(screen.getByRole('button', { name: 'Ações de Família Moreira' }));
    await user.click(screen.getByRole('menuitem', { name: 'Mover para a lixeira' }));
    expect(onTrash).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('abre pelo teclado e navega pelas setas', async () => {
    const user = userEvent.setup();
    const { onOpen } = renderMenu();
    screen.getByRole('button', { name: 'Ações de Família Moreira' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: 'Abrir' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('com gatilho próprio, o botão do app abre os itens com conteúdo (ex.: a Tag)', async () => {
    const user = userEvent.setup();
    const onPadrinhos = vi.fn();
    render(
      <ActionMenu
        label="não usado"
        trigger={<Button variant="secondary">Adicionar tag</Button>}
        groups={[
          [
            {
              id: 't1',
              label: 'Família da Ana',
              content: <Tag color="wine">Família da Ana</Tag>,
              onSelect: vi.fn(),
            },
            {
              id: 't2',
              label: 'Padrinhos',
              content: <Tag color="champagne">Padrinhos</Tag>,
              onSelect: onPadrinhos,
            },
          ],
        ]}
      />,
    );
    expect(screen.queryByRole('button', { name: 'não usado' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Adicionar tag' }));
    const item = screen.getByRole('menuitem', { name: 'Padrinhos' });
    expect(item.querySelector('.kore-tag--champagne')).not.toBeNull();
    await user.click(item);
    expect(onPadrinhos).toHaveBeenCalledOnce();
  });

  it('a busca por letra usa o label, mesmo com conteúdo', async () => {
    const user = userEvent.setup();
    render(
      <ActionMenu
        label="Tags"
        groups={[
          [
            { id: 'a', label: 'Amigos', content: <Tag>Amigos</Tag>, onSelect: vi.fn() },
            { id: 'p', label: 'Padrinhos', content: <Tag>Padrinhos</Tag>, onSelect: vi.fn() },
          ],
        ]}
      />,
    );
    screen.getByRole('button', { name: 'Tags' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('p');
    expect(screen.getByRole('menuitem', { name: 'Padrinhos' })).toHaveFocus();
  });

  it('gatilho desabilitado não abre o menu', async () => {
    const user = userEvent.setup();
    render(
      <ActionMenu
        label="Tags"
        trigger={<Button disabled>Adicionar tag</Button>}
        groups={[[{ id: 'a', label: 'Amigos', onSelect: vi.fn() }]]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Adicionar tag' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('é acessível, fechado e aberto', async () => {
    const user = userEvent.setup();
    renderMenu();
    await expectNoA11yViolations({ container: document.body });
    await user.click(screen.getByRole('button', { name: 'Ações de Família Moreira' }));
    // O Radix põe o menu num portal no body, fora dos landmarks (como no Menu do usuário);
    // no app, a regra `region` vale para a página.
    await expectNoA11yViolations({ container: document.body, disabledRules: ['region'] });
  });
});
