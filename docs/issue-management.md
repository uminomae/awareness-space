# Issue Management

## Role Split

- **Claude is the main project manager**
- **`awareness-space` is Codex's working repository**
- Claude manages parent issues, priority, dependency order, and cross-repo decisions
- Codex creates, updates, and closes repo-local implementation issues in `awareness-space`

## Core Rule

Use GitHub Issues as the default tracking unit for non-trivial work.
If work will take more than one focused change, create or update an issue first.

## Issue Types

- `task`: bounded implementation or setup work
- `exploration`: open-ended theory or research work
- `ops`: repo rules, tooling, workflow, or maintenance work

## Required Fields

Each issue should state:

1. Purpose
2. Scope
3. Done condition
4. Related issues or source materials

## Cross-Repo Rule

- If an `awareness-space` issue depends on `kesson-driven-thinking`, link the parent or related issue
- Use `kesson-driven-thinking#280` as the parent bootstrap reference until a more specific parent exists
- When a repo-local issue materially changes the state of the parent project, add a comment back to the parent issue

## Operational Rule

- Codex may open and update issues inside `awareness-space`
- Claude remains the source of truth for priority and sequencing across repositories
- Do not invent a separate local backlog that conflicts with GitHub Issues
