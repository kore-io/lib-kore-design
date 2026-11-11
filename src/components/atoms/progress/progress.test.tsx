import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { Progress } from './progress';

describe('Progress', () => {
  it('é uma barra de progresso com o nome, o valor e o texto do valor', () => {
    const { container } = render(
      <Progress label="Respostas recebidas" value={68} valueText="68%" />,
    );
    const bar = screen.getByRole('progressbar', { name: 'Respostas recebidas' });
    expect(bar).toHaveAttribute('aria-valuenow', '68');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '68%');
    expect(container.querySelector('.kore-progress__header')).toHaveTextContent(
      'Respostas recebidas68%',
    );
    expect(container.querySelector<HTMLElement>('.kore-progress__bar')?.style.width).toBe('68%');
  });

  it('com max, a largura é a fração; fora do intervalo, fica nas pontas', () => {
    const { container, rerender } = render(<Progress label="Enviando 1 de 3" value={1} max={4} />);
    const bar = () => container.querySelector<HTMLElement>('.kore-progress__bar');
    expect(bar()?.style.width).toBe('25%');
    rerender(<Progress label="Enviando 1 de 3" value={9} max={4} />);
    expect(bar()?.style.width).toBe('100%');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
    rerender(<Progress label="Enviando 1 de 3" value={-1} max={4} />);
    expect(bar()?.style.width).toBe('0%');
  });

  it('só a barra: sem a linha do rótulo, com o nome para o leitor de tela', () => {
    const { container } = render(<Progress label="Enviando a foto 1" value={60} hideHeader />);
    expect(container.querySelector('.kore-progress__header')).toBeNull();
    expect(screen.getByRole('progressbar', { name: 'Enviando a foto 1' })).toBeInTheDocument();
  });

  it('é acessível', async () => {
    const { container } = render(
      <Progress label="Respostas recebidas" value={68} valueText="68%" />,
    );
    await expectNoA11yViolations({ container });
  });
});
