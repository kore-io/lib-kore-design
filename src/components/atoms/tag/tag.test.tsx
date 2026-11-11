import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { tagColorNames } from '../../../tokens/semantic';
import { Tag } from './tag';

describe('Tag', () => {
  it('sem cor é o padrão (null)', () => {
    render(<Tag>Igreja</Tag>);
    expect(screen.getByText('Igreja')).toHaveClass('kore-tag', 'kore-tag--none');
  });

  it.each(tagColorNames)('cor %s vira o modificador do token', (color) => {
    render(<Tag color={color}>Padrinhos</Tag>);
    expect(screen.getByText('Padrinhos')).toHaveClass(`kore-tag--${color}`);
  });

  it('null explícito também é sem cor', () => {
    render(<Tag color={null}>Igreja</Tag>);
    expect(screen.getByText('Igreja')).toHaveClass('kore-tag--none');
  });

  it('é acessível', async () => {
    const { container } = render(
      <p>
        {tagColorNames.map((color) => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
        <Tag>Sem cor</Tag>
      </p>,
    );
    await expectNoA11yViolations({ container });
  });
});
