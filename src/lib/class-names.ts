/** Junta classes semânticas, ignorando as vazias (decisão 131: nada de utilitárias no JSX). */
export function joinClassNames({ names }: { names: (string | false | null | undefined)[] }) {
  return names.filter(Boolean).join(' ');
}
