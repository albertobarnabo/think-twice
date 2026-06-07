# think-twice

> Forces Claude to pause before any high-cost task and ask: "Is there a cleverer, cheaper way to do this?"

Part of the **lean** plugin — [albertobarnabo/think-twice](https://github.com/albertobarnabo/think-twice)

---

## What it does

LLMs default to the most obvious path. Given "build city autocomplete for all cities worldwide", Claude will start writing a 10,000-entry JSON array — when `npm install world-cities` would have done it in 25 lines at 500x fewer tokens.

think-twice rewires that instinct. Before any expensive implementation, Claude runs a 6-checkpoint checklist to find the cheap path first.

---

## The 6 Checkpoints

1. **Am I solving the right problem?** — Fully understood, or assuming?
2. **Is there an existing solution?** — Public API, npm/pip package, open dataset, stdlib?
3. **Am I doing too much?** — Does the user need all of this, or just a slice?
4. **Is my approach the most direct?** — Simpler data structure? One-liner replacement?
5. **Can I do this lazily?** — Generate on demand, paginate, cache, render visible-only?
6. **Only then: proceed** — Commit to the minimum that solves the problem today.

If any checkpoint reveals a better path — take it. Explain what was chosen and why.

---

## Token Savings

| Task | Without skill | With skill | Saved |
|---|---|---|---|
| City autocomplete (worldwide) | ~201,000 tokens | ~400 tokens | **500x** |
| 500 fake staging profiles | ~50,500 tokens | ~200 tokens | **250x** |
| Live currency conversion | ~5,500 tokens | ~350 tokens | **16x** |
| PDF invoice generation | ~6,000 tokens | ~650 tokens | **9x** |
| Sliding window rate limiter | ~3,500 tokens | ~300 tokens | **12x** |

---

## Examples

<details>
<summary><strong>"Build city autocomplete for our shipping form — all major cities worldwide"</strong></summary>
<br/>

| | Greedy | Think-Twice |
|---|---|---|
| **Approach** | Hardcodes 10,000 cities as a JSON array | `npm install world-cities` + 25-line component |
| **Tokens** | ~201,000 | ~400 — **500x fewer** |
| **Accuracy** | Frozen at generation time | 130,000 cities, maintained upstream |
| **Checkpoint** | — | Checkpoint 2 — existing package |

</details>

<details>
<summary><strong>"Generate 500 realistic user profiles for our staging database"</strong></summary>
<br/>

| | Greedy | Think-Twice |
|---|---|---|
| **Approach** | Writes 500 JSON records inline | 15-line `faker` script, seeded |
| **Tokens** | ~50,500 | ~200 — **250x fewer** |
| **Re-runnability** | Zero — ephemeral output | Parameterized, version-controlled |
| **Checkpoints** | — | Checkpoint 3 (scope) + Checkpoint 2 (faker) |

</details>

<details>
<summary><strong>"Implement rate limiting — 100 req per 15-min sliding window"</strong></summary>
<br/>

| | Greedy | Think-Twice |
|---|---|---|
| **Approach** | Custom Redis sorted sets + Lua script | `rate-limiter-flexible` |
| **Tokens** | ~3,500 | ~300 — **12x fewer** |
| **Lines of code** | ~250 | 5–15 |
| **Checkpoints** | — | Checkpoint 1 + 2 + 4 |

</details>

---

## Install

**This skill only:**
```bash
curl -sL https://raw.githubusercontent.com/albertobarnabo/think-twice/main/skills/think-twice/SKILL.md \
  -o ~/.claude/skills/think-twice/SKILL.md --create-dirs
```

**Full lean plugin (think-twice + surgical):**
```
/plugin install albertobarnabo/think-twice
```

---

## When NOT to apply

- Task is trivially small (under ~10 lines, no data, no new dependencies)
- User explicitly described custom logic no library could cover
- Security-critical code — always use stdlib or a widely-audited library, never hand-roll
- Adding a library would be overkill for 5 trivial lines
- Latency-sensitive hot path where a runtime API call is unacceptable
