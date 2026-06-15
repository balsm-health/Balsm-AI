# Balsm-AI

Shared AI toolkit for all Balsm repos — **skills**, **slash commands**, and **subagents** in one place, installed once and visible from every project.

Packaged as a Claude Code **plugin marketplace** so a single install (user scope) surfaces everything in any repo on the machine.

## Layout

```
Balsm-AI/
├── .claude-plugin/
│   └── marketplace.json        # marketplace manifest (lists the plugin)
└── plugin/                     # the plugin itself
    ├── .claude-plugin/
    │   └── plugin.json         # plugin manifest (name, version)
    ├── skills/                 # 49 security skills + your own
    ├── commands/               # slash commands (e.g. /balsm-context)
    └── agents/                 # subagents (e.g. balsm-reviewer)
```

## Install (once, user scope → all projects)

```bash
claude plugin marketplace add .
claude plugin install balsm-ai@balsm-ai --scope user
```

After push to GitHub, others install with the repo slug instead of the path:

```bash
claude plugin marketplace add <org>/Balsm-AI
claude plugin install balsm-ai@balsm-ai --scope user
```

## Add capabilities

- **Skill** → new folder under `plugin/skills/<name>/SKILL.md` with frontmatter (`name`, `description`).
- **Command** → `plugin/commands/<name>.md` → invokes as `/<name>`. `$ARGUMENTS` available.
- **Agent** → `plugin/agents/<name>.md` with frontmatter (`name`, `description`, `tools`).

Edit, commit, then `claude plugin update balsm-ai` (or restart) — changes flow to every project.

## Cross-tool sharing (Cursor, Copilot, Windsurf, OpenCode, Antigravity, Gemini…)

Claude skills/subagents are Claude-native — other tools don't load `SKILL.md`. So the **content** is shared via a generated `AGENTS.md` (the format most agents read natively), built from one source by `sync.mjs`.

```
canonical/rules/      # shared rules → AGENTS.md
plugin/skills/        # Claude skills, also indexed on-demand into AGENTS.md
plugin/commands/      # listed in AGENTS.md
sync.mjs              # generator
AGENTS.md             # generated universal baseline (do not hand-edit)
```

The skill index in `AGENTS.md` is **on-demand**: agents read a skill file only when the task matches — zero prompt bloat. Paths assume the Balsm repos sit side-by-side in one workspace folder.

```bash
node sync.mjs                # regenerate Balsm-AI/AGENTS.md
node sync.mjs --distribute   # also write AGENTS.md into every sibling Balsm repo root
node sync.mjs --check        # CI guard: fail if AGENTS.md is stale
```

Per-tool adapters (`.github/prompts`, `.cursor/commands`, `.windsurf/workflows`, `.opencode/command`) can be added to `sync.mjs` later — same canonical source.

## Token cost

Every enabled skill/command/agent adds its description to context in all sessions. Keep `plugin/skills/` curated; bump `version` in `plugin/.claude-plugin/plugin.json` on releases.

## Toggle

```bash
claude plugin disable balsm-ai      # turn everything off
claude plugin enable balsm-ai       # back on
claude plugin details balsm-ai      # token-cost inventory
```
