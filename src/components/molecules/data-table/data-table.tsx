import type { CSSProperties, ReactNode } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/**
 * A largura de uma coluna no computador: `fill` divide o que sobra; as outras são fixas,
 * nos passos da GroupTable do DS v0.18 (72, 140, 220 px). `xs` cabe um número ou um ⋮.
 */
export type DataTableColumnSize = 'fill' | 'xs' | 'sm' | 'md' | 'lg';

export interface DataTableColumn {
  /** A chave da coluna, que as células usam em `column`. */
  id: string;
  /** O rótulo do cabeçalho (texto do app). No cartão, vira o rótulo da célula. */
  header: string;
  size?: DataTableColumnSize;
  /** Valores em dinheiro e números alinham à direita na tabela. */
  align?: 'start' | 'end';
  /** Só para o leitor de tela (ex.: a coluna do ⋮); o cabeçalho não mostra. */
  hideHeader?: boolean;
}

const TRACKS: Record<DataTableColumnSize, string> = {
  fill: 'minmax(0, 1fr)',
  xs: '72px',
  sm: '140px',
  md: '220px',
  lg: '300px',
};

export interface DataTableProps {
  /** Nome da tabela para o leitor de tela (texto do app). */
  label: string;
  columns: DataTableColumn[];
  /** As linhas (DataTableRow). */
  children: ReactNode;
  className?: string;
}

/**
 * Tabela de dados genérica, no molde da GroupTable do DS v0.18: no computador (≥ 1024 px),
 * a tabela num painel branco, com o cabeçalho em gray.100; no tablet e no celular, cartões
 * (o 1º campo no topo e os outros com o rótulo da coluna). O DOM é um só, com os papéis de
 * tabela do ARIA, e o CSS muda a forma. As colunas vão num grid; a largura de cada uma sai
 * do `size`.
 */
export function DataTable({ label, columns, children, className }: DataTableProps) {
  const style = {
    '--kore-data-table-columns': columns.map((column) => TRACKS[column.size ?? 'fill']).join(' '),
  } as CSSProperties;
  return (
    <div
      role="table"
      aria-label={label}
      aria-colcount={columns.length}
      style={style}
      className={joinClassNames({ names: ['kore-data-table', className] })}
    >
      <div role="rowgroup" className="kore-data-table__head">
        <div role="row" className="kore-data-table__header-row">
          {columns.map((column) => (
            <div
              key={column.id}
              role="columnheader"
              className={joinClassNames({
                names: [
                  'kore-data-table__header',
                  column.align === 'end' && 'kore-data-table__header--end',
                ],
              })}
            >
              {column.hideHeader === true ? (
                <span className="kore-data-table__sr-only">{column.header}</span>
              ) : (
                column.header
              )}
            </div>
          ))}
        </div>
      </div>
      <div role="rowgroup" className="kore-data-table__body">
        {children}
      </div>
    </div>
  );
}

export interface DataTableRowProps {
  /** As células (DataTableCell), na ordem das colunas. */
  children: ReactNode;
  /**
   * A linha leva a um detalhe: o app põe `data-row-link` no link da 1ª célula, e a linha
   * inteira fica clicável (o link cobre a linha), com o hover do DS.
   */
  interactive?: boolean;
  /**
   * O conteúdo aberto da linha expansível (ex.: o Log da aplicação), numa faixa de largura
   * inteira abaixo das células. O app controla o botão (com `aria-expanded`) numa célula.
   */
  details?: ReactNode;
  className?: string;
}

export function DataTableRow({
  children,
  interactive = false,
  details,
  className,
}: DataTableRowProps) {
  return (
    <div
      role="row"
      className={joinClassNames({
        names: [
          'kore-data-table__row',
          interactive && 'kore-data-table__row--interactive',
          className,
        ],
      })}
    >
      {children}
      {details !== undefined && details !== null && details !== false && (
        <div role="cell" className="kore-data-table__details">
          {details}
        </div>
      )}
    </div>
  );
}

export interface DataTableCellProps {
  /** O rótulo da coluna, mostrado só no cartão (o cabeçalho da tabela já o diz). */
  label?: string;
  /** O título do cartão: no topo, sem rótulo, em type.label. */
  primary?: boolean;
  /** As ações da linha (o ⋮): no cartão, no topo, ao lado do título, sem rótulo. */
  actions?: boolean;
  align?: 'start' | 'end';
  children?: ReactNode;
  className?: string;
}

/** Uma célula; vazia (`null` ou `undefined`), mostra o traço em gray.500. */
export function DataTableCell({
  label,
  primary = false,
  actions = false,
  align = 'start',
  children,
  className,
}: DataTableCellProps) {
  const empty = children === null || children === undefined || children === '';
  return (
    <div
      role="cell"
      className={joinClassNames({
        names: [
          'kore-data-table__cell',
          primary && 'kore-data-table__cell--primary',
          actions && 'kore-data-table__cell--actions',
          align === 'end' && 'kore-data-table__cell--end',
          className,
        ],
      })}
    >
      {!primary && !actions && label !== undefined && (
        <span className="kore-data-table__cell-label" aria-hidden="true">
          {label}
        </span>
      )}
      <span className="kore-data-table__cell-value">
        {empty ? (
          <span className="kore-data-table__empty" aria-hidden="true">
            —
          </span>
        ) : (
          children
        )}
      </span>
    </div>
  );
}
