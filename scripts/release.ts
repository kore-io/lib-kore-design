/**
 * Regra de publicação do @kore-io/design (decisão 145):
 * - merge em homolog: pré-release `<versão>-homolog.<run>`, dist-tag `homolog`;
 * - merge em production: a versão do package.json, dist-tag `latest`, só se ainda não
 *   estiver publicada;
 * - outras branches: não publica.
 */
export interface Release {
  version: string;
  distTag: 'homolog' | 'latest';
  /** Em production, publica só se a versão ainda não existir no registro. */
  onlyIfUnpublished: boolean;
}

export function planRelease({
  branch,
  baseVersion,
  runNumber,
}: {
  branch: string;
  baseVersion: string;
  runNumber: string;
}): Release | null {
  if (branch === 'homolog') {
    return {
      version: `${baseVersion}-homolog.${runNumber}`,
      distTag: 'homolog',
      onlyIfUnpublished: false,
    };
  }
  if (branch === 'production') {
    return { version: baseVersion, distTag: 'latest', onlyIfUnpublished: true };
  }
  return null;
}

/** O `npm view` de uma versão que não existe termina com o código E404. */
export function isNotFound({ stderr }: { stderr: string }): boolean {
  return /\bE404\b/.test(stderr);
}
