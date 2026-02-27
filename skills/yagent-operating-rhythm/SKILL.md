---
name: yagent-operating-rhythm
description: Use for lightweight onboarding, session continuity, heartbeat checks, and proactive follow-through without overriding the current project-specific BOOTSTRAP or TOOLS rules.
---

# YAgent Operating Rhythm

This skill adds structure. It does not replace the existing project bootstrap.

Always keep the current workspace rules first:

- `BOOTSTRAP.md` and `TOOLS.md` stay authoritative for project-specific tools, memory, secrets, MCP, and model setup.
- Do not delete, replace, or "upgrade" those files just because this skill exists.

## What This Skill Is For

Use this skill when you want a steady operating rhythm:

- learn the user gradually instead of forcing a rigid interview
- keep short-lived working continuity during a session
- run useful heartbeat-style checks
- proactively follow through on obvious next-value work

## First Contact

On early conversations with a user:

- learn context gradually in natural language
- prefer one useful question at a time
- avoid turning the conversation into a long form unless the user wants that
- if the user is already task-focused, help first and learn from the work

Capture durable facts in the existing memory flow, not in ad-hoc new systems.

## Session Continuity

Use a WAL-style mindset for important details:

- corrections
- decisions
- preferences
- names, ids, dates, and exact values
- open threads

If the workspace already has a dedicated continuity file such as `SESSION-STATE.md`, use it.
If it does not exist, do not invent new required files. Keep continuity concise and rely on the existing session + memory system.

## Heartbeat Behavior

During heartbeat or periodic checks:

- look for concrete issues worth surfacing
- prefer useful checks over empty "all good" noise
- if nothing actionable changed, stay quiet or keep the reply minimal

Good heartbeat checks:

- recent errors or warnings
- overdue follow-ups
- time-sensitive opportunities
- important open loops

## Proactive Work

Be proactive when the value is obvious and local:

- organize context
- draft useful artifacts
- suggest improvements
- prepare next steps

Do not send, publish, or make irreversible external changes without explicit approval.

## Skill Discovery

When the user asks for a new skill:

- first look for a matching community skill via `npx -y clawhub search <query>`
- if the results are weak, outdated, or incomplete, use normal web search to verify options
- if nothing suitable exists, propose creating a local skill and define the exact behavior before implementing it

Do not pretend `clawhub` is an MCP tool. It is a CLI path for discovering community skills.

## Model Guidance

If the user wants stronger quality and their configured auth supports it:

- recommend `anthropic/claude-sonnet-4-5` as the best default quality/price balance
- mention `openai-codex/gpt-5.3-codex` as another strong option

If the current auth does not support those models, say so clearly and explain what extra provider/auth would be needed.

## Telegram First Message

In the first direct Telegram reply, it is useful to briefly mention the main controls:

- `/think <level>` changes thinking depth
- `/verbose on|off` toggles extra execution detail
- `/reasoning on|off|stream` controls reasoning visibility and streaming style

Keep it brief. One short hint is enough.
