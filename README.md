```
   ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗██████╗ ██╗██╗      ██████╗ ████████╗
  ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝██╔══██╗██║██║     ██╔═══██╗╚══██╔══╝
  ██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║   ██████╔╝██║██║     ██║   ██║   ██║   
  ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║   ██╔═══╝ ██║██║     ██║   ██║   ██║   
  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║   ██║     ██║███████╗╚██████╔╝   ██║   
   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ╚═╝     ╚═╝╚══════╝ ╚═════╝   ╚═╝   
```

<div align="center">

**AI-powered commit messages. Right in your terminal.**

[![license](https://img.shields.io/github/license/httpweez/commitpilot?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-black?style=flat-square)](https://nodejs.org)

</div>

---

## ▍ what it does

`commitpilot` reads your staged changes and uses AI to generate a commit message following the [Conventional Commits](https://www.conventionalcommits.org/) spec — so you never have to think about `feat:` vs `fix:` again.

No more:

```
git commit -m "fix"
git commit -m "ajustes"
git commit -m "wip tentativa 3"
```

```bash
$ git add .
$ commitpilot
```

```
┌─────────────────────────────────────────────────────────┐
│  ✦ commitpilot                                          │
│─────────────────────────────────────────────────────────│
│  analyzing staged changes...                            │
│                                                         │
│  ➜  feat(auth): add JWT refresh token support           │
│                                                         │
│  [ ✔ accept ]  [ ✎ edit ]  [ ↺ regenerate ]  [ ✕ cancel ]  │
└─────────────────────────────────────────────────────────┘
```

---

## ▍ how it works

1. reads everything staged via `git diff --staged`
2. sends the diff to an AI model
3. displays the generated message in the terminal
4. waits for your decision: accept, edit, regenerate or cancel
5. runs `git commit -m "..."` automatically

---

## ▍ install

**requirements:** Node.js 18+

```bash
git clone https://github.com/httpweez/commitpilot.git
cd commitpilot
npm install
npm link
```

After linking, the `commitpilot` command is available globally in your terminal.

---

## ▍ interactive prompt

| key | action |
|-----|--------|
| `a` | ✔ accept and commit |
| `e` | ✎ edit the message manually |
| `r` | ↺ regenerate a new suggestion |
| `c` | ✕ cancel without committing |

---

## ▍ configuration

commitpilot reads config in cascade (lowest to highest priority):

```
defaults → ~/.commitpilotrc.json → .commitpilotrc.json (project) → CLI flags
```

| field | default | description |
|-------|---------|-------------|
| `provider` | `anthropic` | AI provider: `anthropic`, `openai` or `ollama` |
| `model` | provider default | model to use |
| `language` | `en` | language of the generated message |
| `maxTokens` | `256` | response token limit |
| `emoji` | `false` | add emoji to commit type |
| `conventional` | `true` | enforce Conventional Commits format |

**global config** — create `~/.commitpilotrc.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-6",
  "language": "pt",
  "emoji": true
}
```

**per-project config** — create `.commitpilotrc.json` at the project root:

```json
{
  "language": "en",
  "model": "claude-haiku-4-5-20251001"
}
```

---

## ▍ providers

### anthropic (recommended)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

```json
{ "provider": "anthropic", "model": "claude-haiku-4-5-20251001" }
```

### openai

```bash
export OPENAI_API_KEY=sk-proj-...
```

```json
{ "provider": "openai", "model": "gpt-4o-mini" }
```

### ollama (local, free)

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2
```

```json
{ "provider": "ollama", "model": "llama3.2" }
```

No API key needed. Runs 100% on your machine.

> ⚠️ models with less than 3B parameters tend to ignore format instructions. use `llama3.2` (3B) or higher.

---

## ▍ project structure

```
commitpilot/
├── bin/
│   └── commitpilot.js    ← CLI entry point
├── src/
│   ├── ai.js             ← AI provider integration
│   ├── config.js         ← config loader and merger
│   └── git.js            ← reads git diff --staged
└── package.json
```

---

## ▍ known issues

**large diffs** — when too many files are staged, the diff sent to the AI can lose focus. commitpilot already applies a 150-line auto-truncation. a per-file diff selector is planned.

**no CLI flags yet** — `--model` and `--provider` flags are not supported yet. use `.commitpilotrc.json` for now. `commander` integration is planned.

**API key not persisted** — `export ANTHROPIC_API_KEY=...` only lasts until the session ends. add it to your shell config:

```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.zshrc
source ~/.zshrc
```

---

## ▍ contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## ▍ license

MIT © [httpweez](https://github.com/httpweez)