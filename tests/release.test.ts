import { describe, expect, it } from 'vitest';
import { isNotFound, planRelease } from '../scripts/release';

describe('regra de publicação (decisão 145)', () => {
  it('homolog: pré-release com o número do run e dist-tag homolog', () => {
    expect(planRelease({ branch: 'homolog', baseVersion: '0.1.0', runNumber: '42' })).toEqual({
      version: '0.1.0-homolog.42',
      distTag: 'homolog',
      onlyIfUnpublished: false,
    });
  });

  it('production: a versão do package.json, latest, só se não estiver publicada', () => {
    expect(planRelease({ branch: 'production', baseVersion: '0.2.0', runNumber: '7' })).toEqual({
      version: '0.2.0',
      distTag: 'latest',
      onlyIfUnpublished: true,
    });
  });

  it.each(['feature/59-ci', 'main', ''])('não publica na branch "%s"', (branch) => {
    expect(planRelease({ branch, baseVersion: '0.1.0', runNumber: '1' })).toBeNull();
  });
});

describe('consulta ao registro', () => {
  it('só o E404 quer dizer versão não publicada', () => {
    expect(isNotFound({ stderr: 'npm error code E404\nnpm error 404 Not Found' })).toBe(true);
    expect(isNotFound({ stderr: 'npm error code E401\nUnable to authenticate' })).toBe(false);
    expect(isNotFound({ stderr: 'npm error code ECONNRESET' })).toBe(false);
  });
});
