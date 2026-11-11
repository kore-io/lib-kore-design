import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../tests/a11y';
import { FileUpload } from './file-upload';

const xlsx = () =>
  new File(['x'], 'convidados.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

function renderUpload({ onFile = vi.fn(), disabled = false } = {}) {
  const view = render(
    <FileUpload
      title="Arrastem a planilha ou cliquem para escolher"
      hint="Excel (.xlsx) com até 1.000 linhas"
      accept=".xlsx"
      disabled={disabled}
      onFile={onFile}
    />,
  );
  return { ...view, onFile };
}

describe('FileUpload', () => {
  it('é um input de arquivo nativo, com o título e a linha de apoio como nome', () => {
    renderUpload();
    const input = screen.getByLabelText(/Arrastem a planilha ou cliquem para escolher/);
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', '.xlsx');
    expect(input).toHaveAccessibleName(
      'Arrastem a planilha ou cliquem para escolher Excel (.xlsx) com até 1.000 linhas',
    );
  });

  it('escolher pelo seletor entrega o arquivo', async () => {
    const user = userEvent.setup();
    const { onFile } = renderUpload();
    const file = xlsx();
    await user.upload(screen.getByLabelText(/Arrastem/), file);
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('soltar um arquivo na área entrega o primeiro e marca a área enquanto arrasta', () => {
    const { onFile, container } = renderUpload();
    const zone = container.querySelector('.kore-file-upload') as HTMLElement;
    const file = xlsx();
    fireEvent.dragOver(zone, { dataTransfer: { files: [file] } });
    expect(zone).toHaveClass('kore-file-upload--dragging');
    fireEvent.drop(zone, { dataTransfer: { files: [file, xlsx()] } });
    expect(onFile).toHaveBeenCalledOnce();
    expect(onFile).toHaveBeenCalledWith(file);
    expect(zone).not.toHaveClass('kore-file-upload--dragging');
  });

  it('passar por cima do ícone ou do texto não apaga a marca; sair da área apaga', () => {
    const { container } = renderUpload();
    const zone = container.querySelector('.kore-file-upload') as HTMLElement;
    const title = zone.querySelector('.kore-file-upload__title') as HTMLElement;
    // O jsdom não tem DragEvent; o relatedTarget entra direto no evento.
    const leave = (to: Element) => {
      const event = createEvent.dragLeave(zone);
      Object.defineProperty(event, 'relatedTarget', { value: to });
      fireEvent(zone, event);
    };
    fireEvent.dragOver(zone);
    leave(title);
    expect(zone).toHaveClass('kore-file-upload--dragging');
    leave(document.body);
    expect(zone).not.toHaveClass('kore-file-upload--dragging');
  });

  it('desabilitado não aceita soltar nem escolher', () => {
    const { onFile, container } = renderUpload({ disabled: true });
    const zone = container.querySelector('.kore-file-upload') as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [xlsx()] } });
    expect(onFile).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Arrastem/)).toBeDisabled();
  });

  it('é acessível', async () => {
    const { container } = renderUpload();
    await expectNoA11yViolations({ container });
  });
});
