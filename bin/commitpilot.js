#!/usr/bin/env node
import ora from 'ora';
import chalk from 'chalk';
import { select, input } from '@inquirer/prompts';
import { execa } from 'execa';
import { getStagedDiff } from '../src/git.js';
import { generateCommitMessage } from '../src/ai.js';
import { loadConfig } from '../src/config.js';

const config = loadConfig();
const diff = await getStagedDiff();
let message;

while (true) {
  const spinner = ora('Gerando mensagem...').start();
  message = await generateCommitMessage(diff, config);
  spinner.stop();

  console.log('\n' + chalk.green('→') + ' ' + chalk.bold(message) + '\n');

  const action = await select({
    message: 'O que fazer?',
    choices: [
      { name: '✓ Aceitar', value: 'accept' },
      { name: '✎ Editar', value: 'edit' },
      { name: '↻ Gerar novamente', value: 'regen' },
      { name: '✗ Cancelar', value: 'cancel' },
    ]
  });

  if (action === 'accept') break;
  if (action === 'edit') {
    message = await input({ message: 'Edite:', default: message });
    break;
  }
  if (action === 'cancel') process.exit(0);
}

await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
