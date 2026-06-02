import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const DEFAULTS = {
  provider:     'anthropic',
  model:        null,       // resolvido por provider abaixo
  language:     'en',
  maxTokens:    256,
  emoji:        false,
  conventional: true,
};

const PROVIDER_MODELS = {
  anthropic: 'claude-haiku-4-5',
  openai:    'gpt-4o-mini',
  ollama:    'llama3.2',
};

function readJson(filepath) {
  try {
    return JSON.parse(readFileSync(filepath, 'utf8'));
  } catch {
    return {};
  }
}

export function loadConfig(cliFlags = {}) {
  const globalRc = readJson(join(homedir(), '.commitpilotrc.json'));
  const localRc  = readJson(join(process.cwd(), '.commitpilotrc.json'));

  // prioridade: defaults < global < local < flags da CLI
  const config = { ...DEFAULTS, ...globalRc, ...localRc, ...cliFlags };

  // modelo padrão por provider se não foi definido
  if (!config.model) {
    config.model = PROVIDER_MODELS[config.provider] ?? 'claude-haiku-4-5';
  }

  // resolve API key: config > env var > 'ollama' (roda local, não precisa de key)
  const envKey = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai:    process.env.OPENAI_API_KEY,
    ollama:    'ollama',
  }[config.provider];

  config.apiKey = config.apiKey ?? envKey;

  if (!config.apiKey) {
    const hint = config.provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
    throw new Error(`API key não encontrada. Defina ${hint} no ambiente ou adicione "apiKey" em ~/.commitpilotrc.json`);
  }

  return config;
}