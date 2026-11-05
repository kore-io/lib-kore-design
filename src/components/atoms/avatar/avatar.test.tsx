import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Avatar, type AvatarSize } from './avatar';

describe('Avatar', () => {
  it.each<AvatarSize>(['sm', 'md', 'lg'])('tamanho %s como modificador', (size) => {
    render(<Avatar initials="AM" size={size} />);
    expect(screen.getByText('AM')).toHaveClass('kore-avatar', `kore-avatar--${size}`);
  });

  it('decorativo por padrão (o nome está ao lado)', () => {
    render(<Avatar initials="AM" />);
    expect(screen.getByText('AM')).toHaveAttribute('aria-hidden', 'true');
  });

  it('com label vira imagem com nome acessível', () => {
    render(<Avatar initials="AM" label="Ana Moreira" />);
    expect(screen.getByRole('img', { name: 'Ana Moreira' })).toHaveTextContent('AM');
  });

  it('é acessível', async () => {
    const { container } = render(
      <div>
        <Avatar initials="AM" />
        <Avatar initials="CM" label="Célia Moreira" size="lg" />
      </div>,
    );
    await expectNoA11yViolations({ container });
  });
});
