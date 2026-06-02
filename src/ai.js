import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

function truncate(diff) {
  const lines = diff.split('\n');
  return lines.length > 150 ? lines.slice(0, 150).join('\n') + '\n...' : diff;
}

const SYSTEM = 'You are a commit message generator. Output ONLY a single line in Conventional Commits format like "feat: add login". No explanations, no markdown, no lists.';

export async function generateCommitMessage(diff, config) {
  const content = truncate(diff);

  if (config.provider === 'openai' || config.provider === 'ollama') {
    const client = new OpenAI({
      apiKey: config.provider === 'ollama' ? 'ollama' : config.apiKey,
      baseURL: config.provider === 'ollama' ? 'http://localhost:11434/v1' : undefined,
    });
    const res = await client.chat.completions.create({
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content }
      ]
    });
    return res.choices[0].message.content.trim();
  }

  const client = new Anthropic({ apiKey: config.apiKey });
  const msg = await client.messages.create({
    model: config.model,
    max_tokens: config.maxTokens,
    system: SYSTEM,
    messages: [{ role: 'user', content }]
  });
  return msg.content[0].text.trim();
}
