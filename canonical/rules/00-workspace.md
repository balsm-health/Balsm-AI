# Balsm workspace

This repo is part of the Balsm multi-repo workspace. Repos and their roles:

- **Balsm-API-DotNet** — backend API (.NET). Source of truth for endpoints, DTOs, auth.
- **balsm_app_flutter** — mobile app (Flutter). Consumes the API.
- **website** — marketing / web frontend. Consumes the API.
- **Balsm-Core** — planning, specs, architecture, product docs, and brand assets (merged from the former Balsm-Roadmap + docs + assets repos).
- **Balsm-Draft**, **specs** — planning & specs.
- **Balsm-AI** — shared AI toolkit (this content's source of truth).

## Cross-repo rule

When you change an API endpoint, DTO, or auth contract in **Balsm-API-DotNet**, check whether **balsm_app_flutter** and **website** consume it and would break. Flag drift.

## Security posture

Balsm handles health data. Treat auth, input validation, secrets, and PII handling as first-class. When working on auth, APIs, mobile storage, cloud, or CI/CD, consult the on-demand security skill index below and read the relevant skill file before implementing.
