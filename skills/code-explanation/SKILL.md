---
name: code-explanation
description: Use when the user asks to explain what a piece of ADVPL/TLPP code does in plain language, adapting the explanation depth for a junior developer (line-by-line), a senior developer (business logic, design decisions, risks), or a functional consultant (no technical terms) -- e.g. understanding legacy code, filling in missing documentation, or assessing the impact of a customization. Also triggers on Portuguese phrasing like "explicar fonte", "explicar codigo", "o que essa rotina faz", "explicar para o consultor funcional", or requests for a --level junior/senior/funcional explanation.
---

# ADVPL/TLPP Code Explanation

This skill provides a methodology for explaining existing ADVPL/TLPP code in plain language, tailored to three audience levels: a junior developer needing line-by-line detail, a senior developer needing a business-logic summary with risks and technical debt, and a functional consultant needing a non-technical description of what the routine does from a business perspective.

Activate this skill when the user wants an existing routine, function, or snippet explained -- e.g. onboarding a new developer, understanding legacy code with no documentation, or briefing a functional consultant on a customization. It reads the target code, determines the requested (or asked) explanation level, and structures the output accordingly, optionally pulling in native-function meanings, business-process context, or SQL details as needed.

It does not cover generating formal documentation artifacts like Protheus.doc headers or full routine specs (see `documentation-patterns`), looking up native function syntax in isolation (see `protheus-reference`), or explaining embedded SQL macro semantics in depth (see `embedded-sql`).

| Reference file | Read when |
|---|---|
| reference.md | Always -- explanation levels, structure per level (junior/senior/funcional), and the analysis process |
