import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export async function generateCommitMessage(diff, config) {
  if (config.provider === 'openai') {
    const client = new OpenAI({ apiKey: config.apiKey });
    const res = await client.chat.completions.create({
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [{
        role: 'user',
        content: `Gere uma mensagem de commit seguindo Conventional Commits para este diff. Responda só com a mensagem.\n\n${diff}`
      }]
    });
    return res.choices[0].message.content.trim();
  }

  const client = new Anthropic({ apiKey: config.apiKey });
  const msg = await client.messages.create({
    model: config.model,
    max_tokens: config.maxTokens,
    messages: [{
      role: 'user',
      content: `Gere uma mensagem de commit seguindo Conventional Commits para este diff. Responda só com a mensagem.\n\n${diff}`
    }]
  });
  return msg.content[0].text.trim();
}
