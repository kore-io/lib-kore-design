import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Fragment, useState } from 'react';
import { joinClassNames } from '../../../lib/class-names';
import { useMediaQuery } from '../../../lib/use-media-query';
import { Avatar } from '../../atoms/avatar/avatar';
import { Divider } from '../../atoms/divider/divider';

export interface UserMenuItem {
  id: string;
  label: string;
  /** Linha de apoio (ex.: o outro perfil em "Trocar de perfil"). */
  detail?: string;
  onSelect: () => void;
}

export interface UserMenuProps {
  user: { name: string; email: string; initials: string };
  /** Linha do perfil ativo, vinda do app (ex.: "Perfil ativo: Casal · Ana & Marcos"). */
  activeProfile?: string;
  /** Grupos de itens, separados por linhas (a IA decide quais itens aparecem). */
  groups: UserMenuItem[][];
  /** Nome acessível do botão e da folha, vindo do app (ex.: "Menu do usuário"). */
  label: string;
  className?: string;
}

/** A partir do tablet o menu é um popover; no celular, uma folha inferior (DS v0.16). */
const POPOVER_QUERY = '(min-width: 48rem)';

function Header({
  user,
  activeProfile,
}: {
  user: UserMenuProps['user'];
  activeProfile: string | undefined;
}) {
  return (
    <>
      <div className="kore-user-menu__header">
        <Avatar initials={user.initials} />
        <div className="kore-user-menu__identity">
          <p className="kore-user-menu__name">{user.name}</p>
          <p className="kore-user-menu__email">{user.email}</p>
        </div>
      </div>
      {activeProfile && <p className="kore-user-menu__active">{activeProfile}</p>}
    </>
  );
}

function ItemContent({ item }: { item: UserMenuItem }) {
  return (
    <>
      <span className="kore-user-menu__item-label">{item.label}</span>
      {item.detail && (
        <>
          {/* O espaço separa no nome acessível; na coluna, não aparece. */}{' '}
          <span className="kore-user-menu__item-detail">{item.detail}</span>
        </>
      )}
    </>
  );
}

/**
 * Menu do usuário do DS: o gatilho (avatar; nome e seta a partir do tablet) abre o
 * cabeçalho com nome, e-mail e perfil ativo, e os grupos de itens. Popover com teclado
 * de menu (DropdownMenu do Radix) a partir do tablet; folha inferior modal no celular.
 */
export function UserMenu({ user, activeProfile, groups, label, className }: UserMenuProps) {
  const isPopover = useMediaQuery({ query: POPOVER_QUERY, fallback: true });
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      aria-label={label}
      className={joinClassNames({ names: ['kore-user-menu__trigger', className] })}
    >
      <Avatar initials={user.initials} />
      <span className="kore-user-menu__trigger-name" aria-hidden="true">
        {user.name}
      </span>
      <ChevronDown
        className="kore-user-menu__chevron"
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );

  if (isPopover) {
    return (
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="kore-user-menu__popover"
            align="end"
            sideOffset={8 /* space.2, escolha do código */}
          >
            <Header user={user} activeProfile={activeProfile} />
            {/* No DS há uma linha antes de cada grupo, logo depois do cabeçalho. */}
            {groups.map((group) => (
              <Fragment key={group.map((item) => item.id).join()}>
                <DropdownMenu.Separator asChild>
                  <Divider />
                </DropdownMenu.Separator>
                {group.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    className="kore-user-menu__item"
                    onSelect={item.onSelect}
                  >
                    <ItemContent item={item} />
                  </DropdownMenu.Item>
                ))}
              </Fragment>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="kore-user-menu__overlay" />
        <Dialog.Content className="kore-user-menu__sheet" aria-describedby={undefined}>
          <Dialog.Title className="kore-user-menu__title">{label}</Dialog.Title>
          <div className="kore-user-menu__handle" aria-hidden="true">
            <span className="kore-user-menu__handle-bar" />
          </div>
          <Header user={user} activeProfile={activeProfile} />
          {groups.map((group) => (
            <Fragment key={group.map((item) => item.id).join()}>
              <Divider />
              {group.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="kore-user-menu__item"
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                >
                  <ItemContent item={item} />
                </button>
              ))}
            </Fragment>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
