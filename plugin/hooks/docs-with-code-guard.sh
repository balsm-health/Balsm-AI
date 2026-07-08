#!/usr/bin/env bash
# Balsm "docs travel with code" guard (PreToolUse on `git commit`).
#
# Blocks a git commit when *significant* source changes are staged without any
# matching documentation update, enforcing the Constitution Development-Workflow
# rule: "code changes without corresponding documentation updates are incomplete."
#
# Deliberately NOT dumb:
#   - only source extensions count; tests / config / generated / assets excluded
#   - staging ANY doc (.md, docs/, AGENTS.md, CLAUDE.md, .cursorrules, .mdc) clears it
#   - overridable with a skip token in the commit message: [skip-docs] / [docs-na] / [no-docs]
# Silent (exit 0) for every non-commit Bash call and every compliant commit.

set -euo pipefail

input="$(cat)"

read_field() {
  printf '%s' "$input" | python3 -c "import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
v = d
for k in '$1'.split('.'):
    v = v.get(k) if isinstance(v, dict) else None
    if v is None:
        break
print(v if v is not None else '')" 2>/dev/null || true
}

tool="$(read_field tool_name)"
[ "$tool" = "Bash" ] || exit 0

cmd="$(read_field tool_input.command)"
cwd="$(read_field cwd)"
[ -n "$cwd" ] || cwd="$(pwd)"

# Only gate git commits.
printf '%s' "$cmd" | grep -Eq '(^|[;&|] *)git( +-[^ ]+| +-C +[^ ]+)* +commit\b' || exit 0

# Escape hatch in the commit message.
if printf '%s' "$cmd" | grep -Eiq '\[(skip-docs|docs-na|no-docs)\]'; then exit 0; fi

# Honor an explicit repo target (git -C <dir>), else the tool cwd.
gitdir="$cwd"
tgt="$(printf '%s' "$cmd" | grep -Eo '\-C +[^ ]+' | head -1 | awk '{print $2}' || true)"
if [ -n "$tgt" ]; then gitdir="$tgt"; fi
cd "$gitdir" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Staged files (+ tracked working-tree mods when the commit uses -a / --all).
staged="$(git diff --cached --name-only 2>/dev/null || true)"
if printf '%s' "$cmd" | grep -Eq 'commit +(-[a-zA-Z]*a|--all)'; then
  staged="$staged
$(git diff --name-only 2>/dev/null || true)"
fi
staged="$(printf '%s\n' "$staged" | sed '/^$/d' | sort -u)"
[ -n "$staged" ] || exit 0

# Any documentation touched? Then treat docs as handled.
docs_re='(\.md$|(^|/)docs/|AGENTS\.md$|CLAUDE\.md$|\.cursorrules$|\.mdc$)'
if printf '%s\n' "$staged" | grep -Eiq "$docs_re"; then exit 0; fi

# Any *significant* source changed? (exclude tests / specs)
code_re='\.(cs|dart|ts|tsx|js|jsx|sql|py|go|rb|java|kt|swift)$'
test_re='(^|/)(tests?|__tests__|spec)/|(_test|\.test|\.spec|Tests)\.'
code="$(printf '%s\n' "$staged" | grep -Ei "$code_re" | grep -Eiv "$test_re" || true)"
[ -n "$code" ] || exit 0

# Significant code, no docs, no skip token -> block with actionable guidance.
files_list="$(printf '%s\n' "$code" | head -8 | sed 's/^/  - /')"
python3 - "$files_list" <<'PY'
import json, sys
files = sys.argv[1]
reason = (
    "Docs-with-code guard (Constitution — Development Workflow): source is "
    "staged but no documentation was.\n\nChanged code:\n" + files + "\n\n"
    "Before committing, update or explicitly confirm the docs this change "
    "affects:\n"
    "  BUSINESS_FEATURES.md, GLOSSARY.md, PHASED_DELIVERY_STEPS.md,\n"
    "  NON_FUNCTIONAL_REQUIREMENTS.md, CERTIFICATIONS.md (if standards change),\n"
    "  SECURITY.md (if the threat surface changes), and the relevant repo\n"
    "  AGENTS.md / rules.\n\n"
    "Then stage the doc change and re-commit. If this change genuinely needs no "
    "docs (refactor, test-only, formatting), add [skip-docs] to the commit message."
)
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }
}))
PY
exit 0
