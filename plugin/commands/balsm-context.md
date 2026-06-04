---
description: Summarize which Balsm repo you're in and its role in the wider workspace.
argument-hint: "[optional: focus area]"
---

You are working inside the Balsm multi-repo workspace at `/Volumes/Dev/Balsm`. The repos and their roles:

- **Balsm-API-DotNet** — backend API (.NET)
- **balsm_app_flutter** — mobile app (Flutter)
- **website** — marketing / web frontend
- **OpenWA** — WhatsApp integration
- **docs** — documentation
- **Balsm-Roadmap**, **Balsm-Draft**, **specs** — planning & specs
- **assets** — shared assets
- **Balsm-AI** — this shared AI toolkit (skills, commands, agents)

Task:
1. Detect the current working repo from CWD.
2. State its role from the list above.
3. If `$ARGUMENTS` is given, focus the summary on that area.
4. List sibling repos likely relevant to the current task.

Keep it short.
