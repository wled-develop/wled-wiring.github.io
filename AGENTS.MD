## Project knowledge
- **Tech Stack:** React, TypeScript, Vite, @xyflow/react, AntD
- **File Structure:**
  - `src\` – Application source code
  - `dist\` – Build files for distribution (you dont need them)

## Project scope
- web application that allow users create wiring diagrams
- user can check the diagram using Diagram Checks (Concept description:DIAGRAMM_CHECKS_CONCEPT.MD)
- user can simulate diagramm electrically (Concept description: SIMUL_CONCEPT.MD, Solver in particular: SOLVER.MD)

## Documentation practices
- When working on diagram checks, keep DIAGRAMM_CHECKS_CONCEPT.MD up to date
- When working on simulation, keep SIMUL_CONCEPT.MD up to date
- When working on solver for simulation, keep SOLVER.MD up to date

## Boundaries
- **Never do:** Implement heuristic techniques if not explecitely asked
- **Never do:** read or write anything outside of wled-wiring.github.io directory
- **Always do:** Keep concept files up to date
- **Take care of:** Correct translations in src/translations/