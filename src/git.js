import { execa } from 'execa';

export async function getStagedDiff() {
  const { stdout } = await execa('git', ['diff', '--staged']);
  if (!stdout) throw new Error('Nada staged. Rode git add primeiro.');
  return stdout;
}