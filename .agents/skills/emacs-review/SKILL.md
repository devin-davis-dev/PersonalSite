---
name: emacs-review
description: Analyze the codebase for improvements, dead code, bugs, or refactorings and send structured findings directly to Emacs via llm-review.el.
---

# Emacs Review Skill (`emacs-review`)

This skill inspects your codebase according to your review prompt or target files, extracts actionable code quality findings, and transmits them directly into an interactive Magit-style review buffer in GNU Emacs powered by `llm-review.el`.

Within Emacs, each finding is rendered as a collapsible section with live buffer markers, letting you preview, navigate, dismiss (`x`), visit (`RET`), or cleanly delete the target code block (`d`) without line drift.

---

## When to Use

Invoke this skill whenever you want to:
- Review code quality, unused functions, or dead imports across the repository.
- Perform targeted refactoring or cleanup on specific files or git diffs.
- Inspect and delete deprecated APIs or legacy blocks interactively inside Emacs.

---

## Workflow Instructions

### Step 1: Analyze Codebase & Enclose Complete Syntactic Blocks

1. Examine `$ARGUMENTS` to determine the review scope:
   - Specific files or paths (e.g., `src/core/`, `lib/auth.py`).
   - Git diffs or branch comparisons (e.g., `git diff main`).
   - Thematic focus: dead code, anti-patterns, security, performance, or styling.
   - If `$ARGUMENTS` is empty or general, inspect recently modified files or core source trees.

2. Inspect the source files using file reading or code search tools.
   > [!IMPORTANT]
   > **Line Number Accuracy & Syntactic Enclosure:**
   > - You MUST verify exact 1-indexed line numbers by inspecting actual file contents. Never hallucinate or estimate line numbers.
   > - Line ranges (`start_line` to `end_line`) MUST enclose **complete syntactic blocks** (e.g., the entire function including decorators/docstrings, complete class definitions, whole conditional branches, or complete import statements).
   > - This is critical because pressing `d` in `llm-review` deletes the entire designated block. If line bounds cut across expressions or leave orphaned braces/indentation, the source file will be broken.

### Step 2: Write Findings JSON to `/tmp/llm-review.json`

Structure your analysis as a JSON array of objects and write it to `/tmp/llm-review.json`.

Each finding object must include the following keys:
- `file`: Path to the file (relative to repository root or absolute).
- `start_line`: 1-indexed starting line number (integer).
- `end_line`: 1-indexed ending line number (integer, inclusive).
- `title`: Concise title summarizing the finding.
- `reason`: Explanation of why this code should be removed, refactored, or fixed.
- `action`: Recommended action string (e.g., `"delete"`, `"refactor"`, `"fix"`, or `"review"`).

#### JSON Schema Example:
```json
[
  {
    "file": "lisp/sample.el",
    "start_line": 42,
    "end_line": 56,
    "title": "Unused legacy helper `sample--old-calc`",
    "reason": "Superseded by `sample-calc-v2`; not referenced anywhere in the repository.",
    "action": "delete"
  },
  {
    "file": "lisp/sample.el",
    "start_line": 88,
    "end_line": 95,
    "title": "Redundant nil-check guard",
    "reason": "`when-let` already handles nil values; inner `(when val ...)` is redundant.",
    "action": "refactor"
  }
]
```

### Step 3: Trigger the Emacs Review Buffer

Execute the following command via `run_command` in the project root:

```bash
emacsclient -n -e "(llm-review-load-file \"/tmp/llm-review.json\" \"$(pwd)/\")"
```

#### Troubleshooting & Fallbacks:
- **Emacs server not running:** If `emacsclient` reports "can't find socket; have you started the server?", notify the user to run `M-x server-start` inside Emacs or start Emacs with `emacs --daemon`.
- **Package not loaded:** If Emacs reports `void-function llm-review-load-file`, ensure `llm-review.el` is in Emacs's `load-path` or loaded via:
  ```bash
  emacsclient -n -e "(progn (load \"$(pwd)/llm-review.el\") (llm-review-load-file \"/tmp/llm-review.json\" \"$(pwd)/\"))"
  ```

---

## Emacs Review Keybindings Reference

Inform the user that findings are ready in their `*llm-review*` Emacs buffer with the following keybindings:

| Key | Command | Description |
| :--- | :--- | :--- |
| `TAB` | `magit-section-toggle` | Toggle collapsible code snippet preview |
| `d` | `llm-review-delete` | Delete target code block in source buffer & refresh UI |
| `x` | `llm-review-dismiss` | Dismiss finding without touching source file |
| `RET` | `llm-review-visit` | Jump directly to target location in source buffer |
| `n` / `p` | `llm-review-next/prev` | Navigate to next / previous finding heading |
| `g` | `llm-review-refresh` | Re-render UI with dynamically updated line numbers |
| `q` | `quit-window` | Bury or close the `*llm-review*` window |

