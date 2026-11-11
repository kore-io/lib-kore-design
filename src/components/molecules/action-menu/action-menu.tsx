import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Fragment } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface ActionMenuItem {
  id: string;
  label: string;
  /** Ação destrutiva (ex.: Mover para a lixeira): texto em destructive. */
  destructive?: boolean;
  onSelect: () => void;
}

export interface ActionMenuProps {
  /** Nome acessível do botão ⋮, vindo do app (ex.: "Ações de Família Moreira"). */
  label: string;
  /** Grupos de itens, separados por linhas. */
  groups: ActionMenuItem[][];
  className?: string;
}

/**
 * Menu de ações do DS: o botão ⋮ (32 px, área de toque de 44 px) abre o popover com os
 * itens, com o teclado de menu do DropdownMenu do Radix.
 */
export function ActionMenu({ label, groups, className }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className={joinClassNames({ names: ['kore-action-menu__trigger', className] })}
        >
          <EllipsisVertical size={20} strokeWidth={2} aria-hidden="true" />
        </button>
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
                  onSelect={item.onSelect}
                >
                  {item.label}
                </DropdownMenu.Item>
              ))}
            </Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
