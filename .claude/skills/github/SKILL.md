---
name: github
description: >
  Manage GitHub repositories, PRs, issues, releases, and org settings using gh CLI.
  Trigger: When user asks about GitHub operations, PRs, issues, releases, or org management.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Grep, Glob
---

## When to Use

- Creating or managing repositories under Craftiacol org
- Working with pull requests (create, review, merge)
- Managing issues (create, label, close)
- Creating releases and tags
- Checking CI/CD workflow status
- Organization-level operations

## Critical Patterns

### Organization Context

| Key | Value |
|-----|-------|
| Org | `Craftiacol` |
| Owner | `asepulvedadev` |
| CLI | `gh` (authenticated) |
| Default branch | `main` |
| Visibility | Private (default) |

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/{description}` | `feat/crm-pipeline` |
| Bug fix | `fix/{description}` | `fix/auth-redirect` |
| Chore | `chore/{description}` | `chore/update-deps` |
| Docs | `docs/{description}` | `docs/api-guide` |

### Commit Messages — Conventional Commits

```
feat: add CRM pipeline kanban board
fix: resolve auth redirect loop on expired session
chore: update supabase to v2.45
docs: add API integration guide
```

### PR Rules

- PRs always target `main`
- Never push directly to `main`
- Never force push to `main`
- Squash merge for features, merge commit for releases
- PR title follows conventional commits format

## Commands

```bash
# Repository
gh repo create Craftiacol/{name} --private --description "{desc}"
gh repo list Craftiacol
gh repo clone Craftiacol/{name}
gh repo view Craftiacol/{name} --web

# Pull Requests
gh pr create --title "feat: {title}" --body "{body}"
gh pr list
gh pr view {number}
gh pr review {number} --approve
gh pr merge {number} --squash --delete-branch
gh pr checkout {number}
gh pr status

# Issues
gh issue create --title "{title}" --label "{label}" --assignee "@me"
gh issue list --label "{label}"
gh issue close {number} --comment "Fixed in #{pr-number}"
gh issue view {number}

# Releases
gh release create v{version} --generate-notes --title "v{version}"
gh release list
gh release view v{version}

# CI/CD Workflows
gh run list
gh run view {id}
gh run view {id} --log
gh run rerun {id}
gh workflow list

# Organization
gh api orgs/Craftiacol/members
gh api orgs/Craftiacol/repos
```

## Code Examples

### Create a feature PR with linked issue

```bash
# Create branch
git checkout -b feat/crm-pipeline

# ... make changes, commit ...

# Push and create PR
git push -u origin feat/crm-pipeline
gh pr create \
  --title "feat: add CRM pipeline kanban board" \
  --body "Closes #12" \
  --assignee "@me"
```

### Create release with changelog

```bash
gh release create v1.2.0 \
  --generate-notes \
  --title "v1.2.0 — CRM Pipeline" \
  --notes-start-tag v1.1.0
```

### Check failed CI and view logs

```bash
gh run list --status failure --limit 5
gh run view {id} --log-failed
gh run rerun {id} --failed
```
