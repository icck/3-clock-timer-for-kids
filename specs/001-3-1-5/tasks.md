# Tasks: 子供向け3分タイマー

**Input**: Design documents from `/specs/001-3-1-5/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [x] T001 Create project structure with HTML, CSS, JS files
- [x] T002 Create index.html with basic structure and meta tags
- [x] T003 [P] Create styles.css with responsive design foundation

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Manual test: Timer starts when start button is clicked
- [x] T005 [P] Manual test: Blocks disappear every 5 seconds
- [x] T006 [P] Manual test: Block colors change every 1 minute
- [x] T007 [P] Manual test: Timer shows completion after 3 minutes

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T008 [P] Timer state management in src/js/timer.js
- [x] T009 [P] Block rendering system in src/js/blocks.js
- [x] T010 [P] Color management system in src/js/colors.js
- [x] T011 Start button functionality in src/js/controls.js
- [x] T012 Timer completion handling in src/js/timer.js
- [x] T013 Block animation system in src/js/animations.js
- [x] T014 Responsive layout implementation in styles.css

## Phase 3.4: Integration
- [x] T015 Connect timer to block rendering system
- [x] T016 Connect color system to block updates
- [x] T017 Connect animations to block removal
- [x] T018 Connect completion handling to UI updates

## Phase 3.5: Polish
- [x] T019 [P] Add smooth transitions and animations
- [x] T020 [P] Optimize for mobile devices
- [x] T021 [P] Add accessibility features (ARIA labels)
- [x] T022 [P] Add sound effects for completion
- [x] T023 [P] Add restart functionality
- [x] T024 [P] Add progress indicator
- [x] T025 [P] Test across different browsers
- [x] T026 [P] Create README.md with usage instructions

## Dependencies
- Tests (T004-T007) before implementation (T008-T014)
- T008 blocks T015
- T009 blocks T015
- T010 blocks T016
- T011 blocks T015
- T012 blocks T018
- T013 blocks T017
- T014 blocks T015
- Implementation before polish (T019-T026)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Manual test: Timer starts when start button is clicked"
Task: "Manual test: Blocks disappear every 5 seconds"
Task: "Manual test: Block colors change every 1 minute"
Task: "Manual test: Timer shows completion after 3 minutes"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
