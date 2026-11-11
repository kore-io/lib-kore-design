import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Fragment, type ReactElement, type ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface ActionMenuItem {
  id: string;
  /** O texto do item; também é o que a busca por letra do teclado usa. */
  label: string;
  /**
   * Conteúdo no lugar do texto (ex.: a Tag com a cor, no Adicionar tag). O `label`
   * continua sendo o nome do item para o teclado.
   */
  content?: ReactNode;
  /** Ação destrutiva (ex.: Mover para a lixeira): texto em destructive. */
  destructive?: boolean;
  onSelect: () => void;
}

export interface ActionMenuProps {
  /**
   * Nome acessível do botão ⋮, vindo do app (ex.: "Ações de Família Moreira"). Com
   * `trigger`, não é usado (o gatilho tem o seu nome).
   */
  label: string;
  /**
   * Gatilho próprio no lugar do ⋮ (ex.: o Button "Adicionar tag" da barra de seleção);
   * recebe as props do menu (asChild). Desabilitado, o menu não abre.
   */
  trigger?: ReactElement<{ disabled?: boolean }>;
  /** Grupos de itens, separados por linhas. */
  groups: ActionMenuItem[][];
  className?: string;
}

/**
 * Menu de ações do DS: o botão ⋮ (32 px, área de toque de 44 px), ou um gatilho do app,
 * abre o popover com os itens, com o teclado de menu do DropdownMenu do Radix.
 */
export function ActionMenu({ label, trigger, groups, className }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      {/* O Radix decide se abre pelo disabled dele, não pelo do filho. */}
      <DropdownMenu.Trigger asChild disabled={trigger?.props.disabled === true}>
        {trigger ?? (
          <button
            type="button"
            aria-label={label}
            className={joinClassNames({ names: ['kore-action-menu__trigger', className] })}
          >
            <EllipsisVertical size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="kore-action-menu__popover"
          align="end"
          sideOffset={4 /* space.1, escolha do código */}
        >
          {groups.map((group, index) => (
            <Fragment key={group.map((item) => item.id).join()}>
              {index > 0 && <DropdownMenu.Separator className="kore-action-menu__separator" />}
              {group.map((item) => (
                <DropdownMenu.Item
                  key={item.id}
                  className={joinClassNames({
                    names: [
                      'kore-action-menu__item',
                      item.destructive && 'kore-action-menu__item--destructive',
                    ],
                  })}
                  textValue={item.label}
                  onSelect={item.onSelect}
                >
                  {item.content ?? item.label}
                </DropdownMenu.Item>
              ))}
            </Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
