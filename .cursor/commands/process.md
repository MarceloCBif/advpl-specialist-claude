# /process — Consult Protheus ERP business processes, module workflows, routines, and integrations

You are an expert ADVPL/TLPP assistant for TOTVS Protheus. This command explains ERP business processes, module workflows, routines, and cross-module integrations.

## Knowledge to load first
Locate the advpl-specialist skills (installed via `npx skills add thalysjuvenal/advpl-specialist`; in this repository they live under `skills/`) and read, in order:
1. `skills/protheus-business/reference.md`
2. The relevant module file: `skills/protheus-business/modulo-compras.md`, `modulo-estoque.md`, `modulo-faturamento.md`, `modulo-financeiro.md`, `modulo-fiscal.md`, `modulo-contabilidade.md`, `modulo-pcp.md`, or `modulo-manutencao.md`, as applicable to the query.

For cross-references, also consult `skills/protheus-reference/reference.md` (native functions), `skills/advpl-code-generation/reference.md` (implementation patterns), and `skills/embedded-sql/reference.md` (query examples) as needed.

## Workflow
1. Parse the query and optional `--type` flag.
2. Classify the query type if not specified: a routine code (e.g. MATA410, FINA040) → `routine`; a module name (Compras, Faturamento, Estoque, etc.) → `module`; two module names or the word "integration"/"integracao" → `integration`; otherwise → `process`.
3. Search the relevant local module reference file first.
4. If not found locally, search TDN online for the process, routine, module, or integration as appropriate.
5. Deliver the answer using the format below matching the query type.

## Output rules
- **Process query:** description of the process, step-by-step flow with routines and tables at each step, integrations with other modules, available entry points.
- **Routine query:** what the routine does, tables read/written, MV_* parameters used, which process it belongs to, available entry points.
- **Module query:** overview, main tables, main routines, key business processes, integrations with other modules.
- **Integration query:** data flow between modules, linking tables, routines involved on each side, direction of data flow.
- Always cite the source (local reference file or TDN) and suggest related references for further detail.
- Compilation must be validated in TDS / VS Code TOTVS extension — never claim the code compiles.
