import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { CodeInput, type CodeInputProps } from './code-input';

const digitLabel = ({ index, length }: { index: number; length: number }) =>
  `Dígito ${index + 1} de ${length}`;

function renderCode(props: Partial<CodeInputProps> = {}) {
  return render(<CodeInput aria-label="Código" digitLabel={digitLabel} {...props} />);
}

const cells = () => screen.getAllByRole('textbox');

describe('CodeInput', () => {
  it('tem 6 casas rotuladas pelo app, num grupo, com one-time-code na primeira', () => {
    renderCode();
    expect(screen.getByRole('group', { name: 'Código' })).toHaveClass('kore-code-input');
    expect(cells()).toHaveLength(6);
    expect(cells()[0]).toHaveAccessibleName('Dígito 1 de 6');
    expect(cells()[0]).toHaveAttribute('autocomplete', 'one-time-code');
    expect(cells()[0]).toHaveAttribute('inputmode', 'numeric');
  });

  it('digitar avança, ignora o que não é número e avisa ao completar', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    renderCode({ onValueChange, onComplete });
    await user.click(cells()[0] as HTMLElement);
    await user.keyboard('4a8 1905');
    expect(cells().map((cell) => (cell as HTMLInputElement).value)).toEqual([
      '4',
      '8',
      '1',
      '9',
      '0',
      '5',
    ]);
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '481905' });
    expect(onComplete).toHaveBeenCalledWith({ value: '481905' });
    expect(cells()[5]).toHaveFocus();
  });

  it('colar distribui os dígitos', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderCode({ onComplete });
    await user.click(cells()[0] as HTMLElement);
    await user.paste('48-19 05');
    expect(onComplete).toHaveBeenCalledWith({ value: '481905' });
  });

  it('Backspace apaga e volta; as setas andam entre as casas', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '481', onValueChange });
    await user.click(cells()[3] as HTMLElement);
    await user.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '48' });
    expect(cells()[2]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(cells()[1]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(cells()[2]).toHaveFocus();
  });

  it('Android: casa esvaziada pelo change apaga o dígito e fica nela', () => {
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '481', onValueChange });
    fireEvent.change(cells()[2] as HTMLElement, { target: { value: '' } });
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '48' });
    expect(cells()[2]).toHaveFocus();
  });

  it('Android: beforeinput de apagar numa casa vazia apaga a anterior', () => {
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '48', onValueChange });
    const empty = cells()[2] as HTMLElement;
    const event = new InputEvent('beforeinput', {
      inputType: 'deleteContentBackward',
      bubbles: true,
      cancelable: true,
    });
    empty.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '4' });
    expect(cells()[1]).toHaveFocus();
  });

  it('beforeinput numa casa preenchida segue para o change', () => {
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '48', onValueChange });
    const event = new InputEvent('beforeinput', {
      inputType: 'deleteContentBackward',
      bubbles: true,
      cancelable: true,
    });
    (cells()[1] as HTMLElement).dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('não deixa buraco: digitar numa casa adiante escreve na próxima vazia', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCode({ onValueChange });
    await user.click(cells()[4] as HTMLElement);
    await user.keyboard('7');
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '7' });
    expect((cells()[0] as HTMLInputElement).value).toBe('7');
  });

  it('trocar um dígito no meio mantém os seguintes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '481905', onValueChange });
    await user.click(cells()[2] as HTMLElement);
    await user.keyboard('7');
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '487905' });
    expect(cells()[3]).toHaveFocus();
  });

  it('casa preenchida sem seleção: vale o dígito novo', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCode({ defaultValue: '481905', onValueChange });
    const third = cells()[2] as HTMLInputElement;
    await user.click(third);
    third.setSelectionRange(1, 1);
    await user.keyboard('7');
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '487905' });
  });

  it('controlado e com campo oculto para o formulário', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('12');
      return (
        <form aria-label="Entrar">
          <CodeInput
            aria-label="Código"
            digitLabel={digitLabel}
            name="code"
            value={value}
            onValueChange={({ value: next }) => setValue(next)}
          />
        </form>
      );
    }
    const { container } = render(<Controlled />);
    await user.click(cells()[2] as HTMLElement);
    await user.keyboard('3');
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('123');
  });

  it('Erro e Desabilitado', () => {
    renderCode({ invalid: true, disabled: true });
    expect(screen.getByRole('group')).toHaveClass('kore-code-input--invalid');
    for (const cell of cells()) {
      expect(cell).toBeDisabled();
      expect(cell).toHaveAttribute('aria-invalid', 'true');
    }
  });

  it('é acessível', async () => {
    const { container } = renderCode({ defaultValue: '48' });
    await expectNoA11yViolations({ container });
  });
});
