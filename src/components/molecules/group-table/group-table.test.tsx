import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Badge } from '../../atoms/badge/badge';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { Tag } from '../../atoms/tag/tag';
import { GroupRow, GroupTable, GroupTableHeader, type GroupRowProps } from './group-table';

const labels = {
  group: 'Grupo',
  people: 'Pessoas',
  responses: 'Respostas',
  delivery: 'Envio',
  respondedAt: 'Respondido em',
  tags: 'Tags',
};

function row(overrides: Partial<GroupRowProps> = {}) {
  return (
    <GroupRow
      select={<Checkbox aria-label="Selecionar Família Moreira" />}
      name={<a href="/app/convidados/grupos/1">Família Moreira</a>}
      contact="Célia Moreira · (19) 9****-3310"
      people={{ value: 3, label: '3 pessoas' }}
      responses={{ primary: '3 confirmados', secondary: 'nenhum recusado ou pendente' }}
      delivery={<Badge tone="success">Respondido</Badge>}
      respondedAt={{ primary: '12/09 às 20h14', secondary: 'por Célia' }}
      tags={<Tag color="wine">Família da Ana</Tag>}
      actions={<button type="button">Ações de Família Moreira</button>}
      {...overrides}
    />
  );
}

function renderTable(children = row()) {
  return render(
    <GroupTable
      label="Grupos"
      header={
        <GroupTableHeader
          selectAll={<Checkbox aria-label="Selecionar todos os grupos" />}
          labels={labels}
        />
      }
    >
      {children}
    </GroupTable>,
  );
}

describe('GroupTable, GroupTableHeader e GroupRow', () => {
  it('é uma tabela com o nome do app, os cabeçalhos e uma linha por grupo', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'Grupos' });
    const headers = within(table).getAllByRole('columnheader');
    expect(headers.map((header) => header.textContent)).toEqual([
      '',
      'Grupo',
      'Pessoas',
      'Respostas',
      'Envio',
      'Respondido em',
      'Tags',
    ]);
    expect(within(headers[0] as HTMLElement).getByRole('checkbox')).toHaveAccessibleName(
      'Selecionar todos os grupos',
    );
    expect(within(table).getAllByRole('row')).toHaveLength(2);
  });

  it('a linha tem as células na ordem do cartão, com os textos do app', () => {
    renderTable();
    const [, groupRow] = screen.getAllByRole('row');
    const cells = within(groupRow as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      '',
      'Família MoreiraCélia Moreira · (19) 9****-3310',
      'Ações de Família Moreira',
      '33 pessoas',
      '3 confirmadosnenhum recusado ou pendente',
      'Respondido',
      '12/09 às 20h14por Célia',
      'Família da Ana',
    ]);
    expect(screen.getByRole('link', { name: 'Família Moreira' })).toBeVisible();
  });

  it('sem resposta, o traço é decorativo', () => {
    const { container } = renderTable(row({ respondedAt: null }));
    const empty = container.querySelector('.kore-group-row__empty');
    expect(empty).toHaveTextContent('—');
    expect(empty).toHaveAttribute('aria-hidden', 'true');
  });

  it('sem linha de apoio, só a principal', () => {
    const { container } = renderTable(row({ responses: { primary: '1 confirmado' } }));
    const responses = container.querySelector('.kore-group-row__responses');
    expect(responses?.querySelector('.kore-group-row__secondary')).toBeNull();
  });

  it('é acessível', async () => {
    const { container } = renderTable(
      <>
        {row()}
        {row({ respondedAt: null })}
      </>,
    );
    await expectNoA11yViolations({ container });
  });
});
