---
name: "End of Day (my-website changed files)"
description: "Use when running a final daily check scoped to my-website and only files changed today."
agent: "project-cleaner"
argument-hint: "Optional emphasis (for example: integrations, homepage, forms, or logs)"
---
Run an end-of-day review for **my-website** with strict scope control.

## Scope rules (required)
1. Treat `C:\Users\Authorized User\OneDrive\Desktop\my-website` as the only repository in scope.
2. Build the file scope from **today's changed files only** by combining:
   - Uncommitted changes from `git status --porcelain`
   - Files touched by commits since local midnight using:
     - `git --no-pager log --since="today 00:00" --name-only --pretty=format:`
3. Deduplicate and ignore empty lines.
4. Analyze and report **only** on files in that resulting list.
5. If the resulting list is empty, return `No changed files today in my-website.` and stop.

## Tasks
1. Flag critical errors/warnings found in the scoped files.
2. Extract open action items from today's changes.
3. Summarize progress made today in concise professional language.
4. Recommend tomorrow's first 3 actions.

## Output format
1. Scoped files reviewed
2. Critical issues
3. Open action items
4. Progress summary
5. Next 3 actions for tomorrow
