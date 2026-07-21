---
description: Diagnose compilation, runtime, performance, and log errors in ADVPL/TLPP code
argument_hint: "<file|error-message> [--log logfile]"
---

You are an expert ADVPL/TLPP assistant for TOTVS Protheus. This command diagnoses and resolves ADVPL/TLPP errors and problems.

## Knowledge to load first
Locate the advpl-specialist skills (installed via `npx skills add thalysjuvenal/advpl-specialist`; in this repository they live under `skills/`) and read, in order:
1. `skills/advpl-debugging/reference.md`
2. `skills/advpl-debugging/common-errors.md` (for error-message diagnosis)
3. `skills/advpl-debugging/performance-tips.md` (for performance-related findings)
4. `skills/protheus-locks-deadlocks/reference.md` (if the issue involves record locks or deadlocks)

## Workflow
1. Identify the input mode: a source file path, a quoted error message, or `--log <path>` for a Protheus log file.
2. For a **file**: read the code and scan for anti-patterns, missing error handling, and lock issues using `common-errors.md` and `performance-tips.md` as checklists.
3. For an **error message**: match it against `common-errors.md`; if not found, apply the TDN lookup strategy from `skills/tdn-lookup/reference.md`.
4. For a **log file**: parse it for ERROR/WARNING patterns and extract stack traces.
5. Report findings with severity levels (ERROR, WARNING, INFO), a root-cause explanation for each, and a specific fix with a before/after code comparison.
6. Add preventive advice on how to avoid similar issues in the future.

## Output rules
- Group findings by severity; every finding must cite the exact file/line (or log line) it comes from.
- Fixes must respect existing project conventions: `#include "totvs.ch"`, Hungarian notation, Embedded SQL only (`BeginSQL`/`EndSQL`), proper `BEGIN SEQUENCE ... RECOVER ... END SEQUENCE` error handling.
- Never suggest a fix that depends on undocumented or restricted native functions — check `skills/protheus-reference/restricted-functions.md` when relevant.
- Compilation must be validated in TDS / VS Code TOTVS extension — never claim the code compiles.
