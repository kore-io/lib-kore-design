import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Fragment, useId, type ReactElement, type ReactNode } from 'react';
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
  /**
   * Item desabilitado: continua focável no teclado, com `aria-disabled`, e selecionar não
   * faz nada (o menu fica aberto). Use com o `disabledReason`.
   */
  disabled?: boolean;
  /**
   * O motivo do desabilitado, vindo do app (ex.: "Só o casal pode alterar respostas depois
   * do prazo."): texto de apoio abaixo do rótulo, lido como a descrição do item.
   */
  disabledReason?: string;
  onSelect: () => void;
}

interface ActionMenuBaseProps {
  /** Grupos de itens, separados por linhas. */
  groups: ActionMenuItem[][];
  className?: string;
}

interface ActionMenuDotsProps extends ActionMenuBaseProps {
  /** Nome acessível do botão ⋮, vindo do app (ex.: "Ações de Família Moreira"). */
  label: string;
  trigger?: undefined;
}

interface ActionMenuTriggerProps extends ActionMenuBaseProps {
  /**
   * Gatilho próprio no lugar do ⋮ (ex.: o Button "Adicionar tag" da barra de seleção);
   * recebe as props do menu (asChild). Desabilitado, o menu não abre.
   */
  trigger: ReactElement<{ disabled?: boolean }>;
  /** Não é usado: o gatilho tem o seu nome. */
  label?: string;
}

/** O `label` é obrigatório no ⋮ e opcional com `trigger`. */
export type ActionMenuProps = ActionMenuDotsProps | ActionMenuTriggerProps;

/**
 * Menu de ações do DS: o botão ⋮ (32 px, área de toque de 44 px), ou um gatilho do app,
 * abre o popover com os itens, com o teclado de menu do DropdownMenu do Radix.
 */
function Item({ item }: { item: ActionMenuItem }) {
  const reasonId = useId();
  const reason = item.disabled === true ? item.disabledReason : undefined;
  return (
    <DropdownMenu.Item
      className={joinClassNames({
        names: [
          'kore-action-menu__item',
          item.destructive && 'kore-action-menu__item--destructive',
          item.disabled && 'kore-action-menu__item--disabled',
        ],
      })}
      textValue={item.label}
      // Com conteúdo próprio ou com o motivo, o nome do item é o label; o motivo é a descrição.
      aria-label={item.content === undefined && !reason ? undefined : item.label}
      // Desabilitado sem o `disabled` do Radix, que tiraria o item do teclado e o motivo do
      // leitor de tela: aria-disabled e o onSelect que não faz nada (o menu fica aberto).
      {...(item.disabled && { 'aria-disabled': true })}
      {...(reason && { 'aria-describedby': reasonId })}
      onSelect={(event) => {
        if (item.disabled) {
          event.preventDefault();
          return;
        }
        item.onSelect();
      }}
    >
      <span className="kore-action-menu__label">{item.content ?? item.label}</span>
      {reason && (
        <span id={reasonId} className="kore-action-menu__reason">
          {reason}
        </span>
      )}
    </DropdownMenu.Item>
  );
}

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
                <Item key={item.id} item={item} />
              ))}
            </Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
