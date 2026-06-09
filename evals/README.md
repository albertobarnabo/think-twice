# Skill evals

Behavioral evals for the lazy-cat skills. Unlike `tests/install.test.js` (deterministic
plumbing), these measure whether the skill actually changes Claude's *judgment* — which is
non-deterministic, so we score on proxies and rates, not exact output.

## Run

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run eval          # or: npx promptfoo@latest eval -c evals/promptfooconfig.yaml --repeat 3
npx promptfoo@latest view   # open the results matrix in a browser
```

`--repeat 3` runs each scenario 3× because the model is non-deterministic — read the
pass-rate, not a single pass/fail.

## How to read it

Each scenario runs under two prompts, side by side:

- **baseline** — no skill
- **with-skill** — the lazy-cat rules in the system prompt

The skill's value is the **delta** between the two columns. For the `should-fire` scenario
you expect baseline to fail the rubric and with-skill to pass — that gap *is* the result.

## Scenario types (keep the suite small and high-signal)

- **should-fire** — the skill must kick in (existing package beats hardcoding, etc.).
- **should-stay-silent** — a false-positive guard: trivial task where firing would be overkill.
- **mid-process** — carries prior context so the skill is tested inside an already-running
  task, not just a cold one-line prompt (this is where the skills actually matter).

## Scoring

- `javascript` assertions — cheap deterministic proxies (output length, presence of a keyword).
- `llm-rubric` assertions — binary, specific judgments for the fuzzy parts, graded by Claude.

Grow this into a gated CI check (e.g. fail under a pass-rate threshold) once the scenario set
is stable.
