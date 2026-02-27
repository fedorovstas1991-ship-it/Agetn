# ClawHub Skill Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add safe, agent-driven skill discovery/creation flow with ClawHub guidance, while preserving the existing memory/MCP/bootstrap behavior.

**Architecture:** Keep the product-specific bootstrap and memory changes, add a bundled operating skill, route "create skill" through the agent chat instead of a brittle modal path, and teach the agent to use ClawHub CLI plus web search before offering custom skill creation. Do not register a broken MCP server entry for `clawhub` unless a real MCP transport exists.

**Tech Stack:** TypeScript, Vitest, Lit UI, gateway config templates

---

### Task 1: Add failing tests for the new agent-facing flow

**Files:**
- Modify: `src/onboarding/onboarding-wizard.test.ts`
- Modify: `src/agents/workspace.test.ts`
- Modify: `src/agents/skills.test.ts`
- Create: `src/auto-reply/reply/get-reply-run.first-turn-hints.test.ts`
- Modify: `ui/src/ui/app-render-product.test.ts`
- Create: `ui/src/ui/app-view-state.skills-flow.test.ts`

**Step 1: Write failing tests**

Add tests for:
- bootstrap/tools text mentioning memory, one-search, ClawHub CLI, and Telegram command hints
- shipped bundled skill visibility
- first Telegram direct-message hint
- skill creation chat prompt and button label

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/agents/workspace.test.ts src/agents/skills.test.ts src/onboarding/onboarding-wizard.test.ts src/auto-reply/reply/get-reply-run.first-turn-hints.test.ts ui/src/ui/app-render-product.test.ts ui/src/ui/app-view-state.skills-flow.test.ts`

Expected: failures for missing files, missing exports, and missing text.

### Task 2: Implement safe runtime and prompt changes

**Files:**
- Modify: `docs/reference/templates/BOOTSTRAP.md`
- Modify: `docs/reference/templates/TOOLS.md`
- Create: `skills/yagent-operating-rhythm/SKILL.md`
- Modify: `src/auto-reply/reply/get-reply-run.ts`
- Modify: `src/onboarding/onboarding-wizard.ts`
- Modify: `src/agents/system-prompt.ts`
- Modify: `ui/src/ui/app-render-product.ts`
- Modify: `ui/src/ui/app-view-state.ts`

**Step 1: Write minimal implementation**

- Port the earlier memory/bootstrap changes
- Add ClawHub CLI guidance for community skills
- Replace direct "create skill" modal entrypoint with a chat-driven flow
- Keep `one-search` MCP config intact
- Do not add a fake `clawhub` MCP server config if the published package is only a CLI

**Step 2: Run targeted tests to verify they pass**

Run the same Vitest command from Task 1.

### Task 3: Verify branch state and prepare PR

**Files:**
- Review only

**Step 1: Inspect final diff**

Run: `git diff --stat origin/main...HEAD && git diff -- origin/main...HEAD`

**Step 2: Push branch and open replacement PR**

Use `gh` if available; otherwise stop with exact blocker.
