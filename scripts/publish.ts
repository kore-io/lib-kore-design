import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isNotFound, planRelease } from './release';

/** Executa a regra de `release.ts` no CI. Espera o build pronto em `dist/`. */
function run({ command, args }: { command: string; args: string[] }) {
  execFileSync(command, args, { stdio: 'inherit' });
}

/**
 * Pergunta ao registro se a versão já existe. Só o 404 quer dizer "não publicada"; erro
 * de rede ou de autenticação para o job com a mensagem real.
 */
function isPublished({ name, version }: { name: string; version: string }): boolean {
  try {
    const output = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return output.trim() === version;
  } catch (error) {
    const stderr = String((error as { stderr?: unknown }).stderr ?? '');
    if (isNotFound({ stderr })) return false;
    throw new Error(`Não deu para consultar ${name}@${version} no registro:\n${stderr}`, {
      cause: error,
    });
  }
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { name: string; version: string };
const release = planRelease({
  branch: process.env.GITHUB_REF_NAME ?? '',
  baseVersion: pkg.version,
  runNumber: process.env.GITHUB_RUN_NUMBER ?? '0',
});

if (!release) {
  console.log('Branch sem publicação.');
} else if (release.onlyIfUnpublished && isPublished({ name: pkg.name, version: release.version })) {
  console.log(`${pkg.name}@${release.version} já está publicado; nada a fazer.`);
} else {
  run({ command: 'npm', args: ['version', release.version, '--no-git-tag-version'] });
  run({
    command: 'pnpm',
    args: ['publish', '--tag', release.distTag, '--no-git-checks', '--ignore-scripts'],
  });
  console.log(`Publicado ${pkg.name}@${release.version} (${release.distTag}).`);
}
