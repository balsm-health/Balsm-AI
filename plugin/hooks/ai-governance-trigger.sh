#!/usr/bin/env bash
# Balsm AI-governance trigger (UserPromptSubmit hook).
# Reads the prompt payload on stdin; if the prompt is about AI/LLM/ML work,
# force-injects a governance reminder pointing at the balsm-ai-governance skill.
# Deterministic, harness-run — fires regardless of model discretion.
# Silent (exit 0, no output) for non-AI prompts, so normal work is unaffected.

set -euo pipefail

input="$(cat)"

# Extract the user prompt from the JSON payload; fall back to the whole payload
# if python3 is unavailable or parsing fails.
prompt="$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    print(json.load(sys.stdin).get("prompt", ""))
except Exception:
    pass' 2>/dev/null || true)"
haystack="${prompt:-$input}"

# Curated keyword set. Uses word boundaries so bare "AI"/"ML" do not match
# inside email/detail/domain/HTML/XML. Case-insensitive.
pattern='(\bA\.?I\.?\b|\bLLM\b|\bML\b|\bGPT\b|chatbot|copilot|\bCDSS\b|clinical decision support|ambient scrib|\bscribe\b|prompt injection|machine learning|large language model|AI-?assist|AI feature|AI model|AI chat|AI governance|AI suggestion|inference|embedding|RAG\b|fine-?tun)'

if printf '%s' "$haystack" | grep -iEq "$pattern"; then
  cat <<'EOF'
[Balsm AI Governance — auto-injected] AI/clinical-AI work detected in this request.

Balsm AI governance applies (Constitution X + Principle I, LOCKED). BEFORE you
design, plan, or write code, load the `balsm-ai-governance` skill and honor it.

Non-negotiables:
- Assistive only — no autonomous clinical decisions, no AI writes to patient records, human-in-the-loop mandatory.
- AI must never bypass rule-based safety checks (drug interaction / allergy / dosage).
- AI chat with patient data IS PHI — encrypt at rest, audit-log, RBAC-scope, redact secrets, honor retention/deletion.
- No PHI to external AI in identifiable form; log all external calls; entities can opt out entirely.
- Kill switch + model registry + pre-deployment bias evaluation required.
- Platform must work fully without AI (enhancement, not dependency).

If writing a phase spec: cite the applicable AI01–AI16 threat IDs from
Balsm-Core/SYSTEM_THREAT_MODEL.md and confirm all BLOCKING mitigations are covered.
EOF
fi

exit 0
