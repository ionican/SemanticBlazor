# SemanticBlazor Project Guidelines

This project is a shared UI component library aligned with Semantic UI and used by IMS36 and potentially other applications in this repository.

## Scope and hierarchy
- Precedence: this file (project) → ancestor folders → repository root.

## Platform and language
- Respect TargetFramework(s) declared in SemanticBlazor.csproj.

## UI framework alignment
- Adhere to Semantic UI semantics and styling guidelines.
- Avoid adding dependencies that conflict with Semantic UI (e.g., MudBlazor). Do not introduce MudBlazor components or styles here.

## Notes
- Follow repo-wide security, performance, and code style guidance.
- Keep the public surface area stable; propose breaking changes before implementation.
