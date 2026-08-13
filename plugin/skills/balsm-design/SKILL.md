---
name: balsm-design
description: Use this skill to generate well-branded interfaces and assets for Balsm.health (بلسم) — the community-owned healthcare OS for the Arab world. Includes the official five-petal flower mark, the five-color petal palette, cool navy-slate neutrals, type system (Montserrat / IBM Plex Sans / IBM Plex Sans Arabic / Cairo / IBM Plex Mono), Lucide iconography, a Balsm Pharmacy POS UI kit, and a Balsm Care app prototype. Brand promise: "Your care. Your data. Your system." Three words: Open. Arab. Owned.
user-invocable: true
---

## Where the design system lives

This skill carries **no copy** of the design system. The canonical files live in
the Balsm-Core repo:

```
Balsm-Core/brand/                       logos, icons, wordmark, og-images, watercolor bg
Balsm-Core/brand/balsm-brand-canvas.md  LOCKED brand canvas — mission, voice, values
Balsm-Core/brand/design-system/         the system itself
  README.md               the manual — read first for anything non-trivial
  colors_and_type.css     every token: petals, ink, type, spacing, radii, motion
  component-tokens.css    per-component sizing + elevation scale
  components.css          .b-btn / .b-badge / .b-input / .b-select / .b-logomark …
  adaptive.css            container-query layer (.cq, .adaptive-*, touch targets)
  styles.css              single entry point — imports all four in order
  components/             26 React components, each .jsx + .d.ts + preview
  fonts/ + fonts.css      Self-hosted type — no CDN at runtime
  preview/                per-token preview cards
Balsm-Core/design.md                    the design contract (how Balsm looks)
```

**Read `Balsm-Core/brand/design-system/README.md` first.** For brand and voice
decisions read `Balsm-Core/brand/balsm-brand-canvas.md` (locked, v1.0).

**If `Balsm-Core/` is not in the current workspace**, say so plainly and ask
whether to proceed from the rules below alone. Do not invent token values, and
do not reconstruct assets from memory — the flower mark in particular must never
be redrawn. The rules here are enough to review and critique work; they are not
enough to reproduce the system.

Minimum starter for a new artifact:

```html
<link rel="stylesheet" href="path/to/colors_and_type.css">
```

For production code, copy `colors_and_type.css` into the codebase — it is the
single source of truth for all design tokens.

---

## Non-negotiables

These travel with the skill so they hold even when the files are out of reach.

1. **Brand promise** — every care-recipient-facing surface must embody: "Your care. Your data. Your system." Care recipient data sovereignty is non-negotiable. Never imply data goes anywhere the user didn't choose.

2. **Brand name** — `Balsm.health` in product surfaces (`.health` one weight lighter). Arabic: `بلسم` — plain spelling, no diacritics.

3. **The flower mark has FIVE colors** — aqua `#02BBB5`, emerald `#01C4A2`, blue `#1283FF`, mint `#55D77F`, violet `#724DD0`. Never recolor to a single hue outside the documented mono / reverse lockups.

4. **Wordmark is navy slate `#1F2D3D`**; the `.health` TLD is the same hue one step lighter, `#526174`. One colour at two lightnesses — restate one and you restate the other. The `--balsm-ink-*` ramp is keyed to them: `ink-800` **is** the wordmark, `ink-600` **is** the TLD. Creams stay warm on purpose — cool ink on warm paper.

5. **No medical-cliché iconography** for brand symbols (no cross, syringe, heart as logo). Lucide `pill` / `stethoscope` are fine inside the product; never as a logo replacement.

6. **No emoji in product UI.** The five-petal flower is our emoji. Unicode arrows and bullets in copy are fine.

7. **Arabic is first-class.** Every surface must work with `dir="rtl"` and `--font-arabic`. Designed Arabic-first, not localized after the fact.

8. **Voice passes all three experience tests before shipping:** frictionless (works without making the user think about infrastructure) · warm (a trusted colleague, not a cold system) · trustworthy (reinforces confidence in Balsm).

9. **Two voice registers — use the right one:**
   - 🩺 **Clinical / technical:** precise, one meaning per sentence, never softens a hard truth, error messages explain and never blame. Active words: Trustworthy · Reliable · Honest · Clear.
   - 🌿 **Product / care recipient / community:** warm colleague tone, sovereignty language (the care recipient is always in control), optimism is earned not assumed. Active words: Warm · Caring · Empowering · Human.

10. **Sovereignty language in care-recipient-facing copy:**
    - ✅ "On your device, by design." / "Syncs only when you choose." / "Your details. Yours alone."
    - ❌ "Saved locally. Will sync when you reconnect." *(apologetic framing)*
    - ❌ "A copy reaches your doctor…" *(implies automatic data transfer)*

11. **What Balsm never sounds like:** cold & corporate · hyped & startup-bro · preachy & self-righteous · timid & apologetic.

12. **Egyptian formatting:** dates `DD/MM/YYYY` · currency `LE 245.00` · phones `+20 1X XXXX XXXX` · NID 14-digit grouped `2 9912 22 12345 6`.

13. **No glassmorphism, no frosted-glass cards, no bouncy animations.** Healthcare deserves stillness. `--ease-out cubic-bezier(0.16,1,0.3,1)` only; 120 / 200 / 320 ms.

14. **Adaptive and responsive on every device.** No fixed-width-only output. Mobile 320–480 (full-viewport, touch targets ≥44px, safe-area insets) · large phone 480–768 · tablet 768–1024 (two-column, side panels emerge) · desktop 1024+ (sidebar nav, hover states) · wide 1280+ (max-width container). Use the `colors_and_type.css` utilities (`.container`, `.grid`, `.card-grid`, `.row-md`, `.show-mobile` / `.hide-mobile`) and the `adaptive.css` container queries. `clamp()` for fluid type. For phone prototypes: iOS/Android frame on tablet and up, full-viewport on real phones. Never leave desktop a stretched phone layout.

---

## Brand personality quick-check

- Is this context **clinical** (serious, precise, trustworthy) or **care-recipient / community** (warm, empowering, optimistic)?
- Does it reinforce that the user — not Balsm, not a vendor — is in control?
- Would a trusted healthcare professional say it this way?
- Would it land the same in Arabic as in English?

---

## When invoked with no other guidance

Ask what they want to build:

- Which surface — Balsm Pharmacy POS · Balsm Care app · Doctor encounter · Balsm Network? All are built from `components/`.
- What format — deck, clickable prototype, marketing page, single-screen mock, production code?
- English, Arabic, or bilingual?
- Real content, or placeholder data from the UI kit / care app?

Then act as an expert designer who outputs HTML artifacts (or production code if
requested). Pull tokens from `colors_and_type.css`, components from the UI kits,
and the flower mark from `Balsm-Core/brand/`. Stay calm in tone, generous in
spacing, warm in surface treatment — and always pass the frictionless + warm +
trustworthy test.

---

## Maintainer note

Upstream is the Claude Design project `51cdbf29-13b7-4206-9328-125fade14cc3`.
Pull changes into `Balsm-Core/brand/design-system/` — never into this skill. See
that directory's `RELOCATION.md` for the deltas from upstream and for the product
token files that still duplicate these values by hand.

The rules above are a **copy** of the design system's own non-negotiables. If
they change upstream, update this file too. It is the one place duplication is
deliberate, because the skill must work without the repo present.

**This plugin installs as a copy** into `~/.claude/plugins/cache/…`. Edits here
do not reach agents until the plugin is bumped and reinstalled.
