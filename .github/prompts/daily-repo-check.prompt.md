---
name: "Daily Repo Check"
description: "Use when running a brief daily cleanup and integration health review for this website repository."
agent: "repo-auditor"
argument-hint: "Optional focus area (for example: forms, scheduling, payments, or homepage)"
---
Run a brief daily repository check for this project.

## Goals
- Identify obvious cleanup candidates (orphan/malformed files, stale references).
- Verify integration touchpoints for Calendly, FormBold, Stripe, and Canva references in code.
- Report what was validated automatically and what requires manual login checks.

## Output format
1. Findings
2. Safe fixes applied
3. Manual follow-up checks
4. Suggested next 60-minute maintenance block
