# commitpilot ✈️

> Gere mensagens de commit inteligentes com IA direto do terminal — sem sair do fluxo de trabalho.

---

## O que é?

**commitpilot** é uma CLI que lê o seu `git diff --staged` e usa inteligência artificial para gerar uma mensagem de commit seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/), com uma interface interativa que te deixa aceitar, editar, regenerar ou cancelar antes de commitar.

Chega de:
- `git commit -m "fix"`
- `git commit -m "ajustes"`
- `git commit -m "wip tentativa 3"`

---

## Como funciona

```
git add .
commitpilot
```

A ferramenta:
1. Lê tudo que foi staged com `git diff --staged`
2. Envia o diff para um modelo de IA
3. Exibe a mensagem gerada no terminal
4. Aguarda sua decisão: aceitar, editar, regenerar ou cancelar
5. Executa o `git commit -m "..."` automaticamente

---

## Instalação

**Pré-requisitos:** Node.js 18+

```bash
git clone https://github.com/httpweez/commitpilot.git
cd commitpilot
npm install
npm link
```

Depois de linkar, o comando `commitpilot` fica disponível globalmente no terminal.

---

## Configuração

O commitpilot lê configurações em cascata (menor para maior prioridade):

```
defaults → ~/.commitpilotrc.json → .commitpilotrc.json (projeto) → flags da CLI
```

### Campos disponíveis

| Campo | Padrão | Descrição |
|---|---|---|
| `provider` | `anthropic` | Provider de IA: `anthropic`, `openai` ou `ollama` |
| `model` | depende do provider | Modelo a ser usado |
| `language` | `en` | Idioma da mensagem gerada |
| `maxTokens` | `256` | Limite de tokens na resposta |
| `emoji` | `false` | Adicionar emoji ao tipo do commit |
| `conventional` | `true` | Forçar formato Conventional Commits |

### Exemplo: configuração global

Crie `~/.commitpilotrc.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-6",
  "language": "pt",
  "emoji": true
}
```

### Exemplo: configuração por projeto

Crie `.commitpilotrc.json` na raiz do projeto para sobrescrever as configurações globais:

```json
{
  "language": "en",
  "model": "claude-haiku-4-5-20251001"
}
```

---

## Providers suportados

### Anthropic (recomendado)

```json
{ "provider": "anthropic" }
```

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Modelos sugeridos: `claude-haiku-4-5-20251001` (rápido e barato) ou `claude-sonnet-4-6` (mais preciso).

### OpenAI

```json
{ "provider": "openai" }
```

```bash
export OPENAI_API_KEY=sk-proj-...
```

Modelos sugeridos: `gpt-4o-mini` (barato) ou `gpt-4o` (mais preciso).

### Ollama (local, gratuito)

Ideal para quem não quer depender de APIs pagas. Roda 100% na sua máquina.

```bash
# instala o ollama
curl -fsSL https://ollama.com/install.sh | sh

# baixa um modelo (recomendado: llama3.2 para máquinas com 8GB+ de RAM)
ollama pull llama3.2
```

```json
{ "provider": "ollama", "model": "llama3.2" }
```

Não precisa de API key.

---

## Uso no dia a dia

### Fluxo básico

```bash
# faz suas alterações...
git add .
commitpilot
```

### Não gostou da mensagem? Regenera

Na interface interativa, selecione **↻ Gerar novamente**. O commitpilot chama a IA de novo com o mesmo diff.

### Quer ajustar o texto? Edita

Selecione **✎ Editar** para modificar a mensagem antes de commitar.

### Configuração rápida por projeto

Projetos com padrões específicos (inglês obrigatório, modelo mais barato, etc.) podem ter um `.commitpilotrc.json` próprio na raiz. Esse arquivo pode ser commitado para padronizar o uso em equipe.

---

## Problemas conhecidos e roadmap

### Diffs muito grandes

Quando muitos arquivos são staged de uma vez, o diff enviado à IA pode ser grande demais e o modelo perde o foco, gerando mensagens genéricas ou extensas. O commitpilot já aplica um truncamento automático de 150 linhas para contornar isso.

**Solução futura:** dividir o diff por arquivo e deixar o usuário escolher o escopo do commit.

### Modelos locais menores (llama3.2:1b)

Modelos com menos de 3B parâmetros tendem a ignorar as instruções de formato e geram texto livre em vez de uma linha no padrão Conventional Commits.

**Recomendação:** use `llama3.2` (3B) ou superior com Ollama.

### Sem suporte a flags de CLI ainda

Ainda não é possível passar `--model` ou `--provider` direto no comando. Por enquanto, use o `.commitpilotrc.json` local.

**Solução planejada:** integração com `commander` para aceitar flags na linha de comando.

### API key não persistida entre sessões

O `export ANTHROPIC_API_KEY=...` no terminal dura apenas até fechar a sessão.

**Solução:** adicionar ao `~/.zshrc` ou `~/.bashrc`:

```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.zshrc
source ~/.zshrc
```

---

## Estrutura do projeto

```
commitpilot/
├── bin/
│   └── commitpilot.js    ← entry point da CLI
├── src/
│   ├── ai.js             ← integração com os providers de IA
│   ├── config.js         ← carrega e mescla configurações
│   └── git.js            ← lê o git diff staged
└── package.json
```

---

## Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

## Licença

MIT
