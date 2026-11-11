import type { ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

export interface GroupTableProps {
  /** Nome da tabela para o leitor de tela (texto do app). */
  label: string;
  /** O GroupTableHeader (só aparece no computador). */
  header: ReactNode;
  /** As linhas (GroupRow). */
  children: ReactNode;
  className?: string;
}

/**
 * Tabela de grupos da tela Grupos e convidados (DS v0.18). No computador (≥ 1024 px), a
 * tabela com o Group Table Header; no tablet, cartões em duas colunas; no celular, uma.
 * O DOM é um só, com os papéis de tabela do ARIA, e o CSS muda a forma.
 */
export function GroupTable({ label, header, children, className }: GroupTableProps) {
  return (
    <div
      role="table"
      aria-label={label}
      className={joinClassNames({ names: ['kore-group-table', className] })}
    >
      {header}
      <div role="rowgroup" className="kore-group-table__body">
        {children}
      </div>
    </div>
  );
}

export interface GroupTableHeaderProps {
  /** O Checkbox de marcar todos (com o indeterminado). */
  selectAll: ReactNode;
  /** Rótulos das colunas, vindos do app. */
  labels: {
    group: string;
    people: string;
    responses: string;
    delivery: string;
    respondedAt: string;
    tags: string;
  };
}

/** Group Table Header do DS: fundo gray.100 e os rótulos em type.overline. */
export function GroupTableHeader({ selectAll, labels }: GroupTableHeaderProps) {
  return (
    <div role="row" className="kore-group-table-header">
      <div role="columnheader" className="kore-group-table-header__select">
        {selectAll}
      </div>
      <div role="columnheader" className="kore-group-table-header__group">
        {labels.group}
      </div>
      <div role="columnheader" className="kore-group-table-header__people">
        {labels.people}
      </div>
      <div role="columnheader" className="kore-group-table-header__responses">
        {labels.responses}
      </div>
      <div role="columnheader" className="kore-group-table-header__delivery">
        {labels.delivery}
      </div>
      <div role="columnheader" className="kore-group-table-header__responded-at">
        {labels.respondedAt}
      </div>
      <div role="columnheader" className="kore-group-table-header__tags">
        {labels.tags}
      </div>
      {/* A coluna do menu ⋮ não tem rótulo no DS. */}
      <div role="none" className="kore-group-table-header__actions" />
    </div>
  );
}

/** Duas linhas de texto: a principal em body.md e a de apoio em caption. */
export interface GroupRowLines {
  primary: ReactNode;
  secondary?: ReactNode;
}

export interface GroupRowProps {
  /** O Checkbox da linha. */
  select: ReactNode;
  /** Nome do grupo (o app passa o link para o Painel do grupo). */
  name: ReactNode;
  /** Linha do contato (ex.: "Célia Moreira · (19) 9****-3310"). */
  contact: ReactNode;
  /** Pessoas: o número (computador) e o texto do cartão ("3 pessoas"). */
  people: { value: ReactNode; label: ReactNode };
  responses: GroupRowLines;
  /** O Badge do envio. */
  delivery: ReactNode;
  /** Respondido em; `null` mostra o traço. */
  respondedAt: GroupRowLines | null;
  /** As Tags do grupo. */
  tags: ReactNode;
  /** O ActionMenu do grupo. */
  actions: ReactNode;
  className?: string;
}

function Lines({ lines }: { lines: GroupRowLines }) {
  return (
    <>
      <span className="kore-group-row__primary">{lines.primary}</span>
      {lines.secondary !== undefined && (
        <span className="kore-group-row__secondary">{lines.secondary}</span>
      )}
    </>
  );
}

/**
 * Group Row do DS: no computador, a linha da tabela (check, grupo, pessoas, respostas,
 * envio, respondido em, tags e ⋮); no tablet e no celular, o cartão (topo com check,
 * grupo e ⋮; pessoas e respostas; envio e respondido em; tags).
 */
export function GroupRow({
  select,
  name,
  contact,
  people,
  responses,
  delivery,
  respondedAt,
  tags,
  actions,
  className,
}: GroupRowProps) {
  return (
    <div role="row" className={joinClassNames({ names: ['kore-group-row', className] })}>
      <div role="none" className="kore-group-row__top">
        <div role="cell" className="kore-group-row__select">
          {select}
        </div>
        <div role="cell" className="kore-group-row__group">
          <span className="kore-group-row__name">{name}</span>
          <span className="kore-group-row__contact">{contact}</span>
        </div>
        <div role="cell" className="kore-group-row__actions">
          {actions}
        </div>
      </div>
      <div role="none" className="kore-group-row__summary">
        <div role="cell" className="kore-group-row__people">
          <span className="kore-group-row__people-value">{people.value}</span>
          <span className="kore-group-row__people-label">{people.label}</span>
        </div>
        <div role="cell" className="kore-group-row__responses">
          <Lines lines={responses} />
        </div>
      </div>
      <div role="none" className="kore-group-row__status">
        <div role="cell" className="kore-group-row__delivery">
          {delivery}
        </div>
        <div role="cell" className="kore-group-row__responded-at">
          {respondedAt === null ? (
            <span className="kore-group-row__empty" aria-hidden="true">
              —
            </span>
          ) : (
            <Lines lines={respondedAt} />
          )}
        </div>
      </div>
      <div role="cell" className="kore-group-row__tags">
        {tags}
      </div>
    </div>
  );
}
