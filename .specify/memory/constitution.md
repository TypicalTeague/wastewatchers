<!--
Sync Impact Report
Version change: 1.0.0 -> 2.0.0
Modified principles:
- I. User-Value Slices -> I. Decision Clarity Over Data Overload
- II. Test-First Confidence -> II. Preserve Working Product Strengths
- III. Explicit Data and Privacy Boundaries -> III. Truthful Data Provenance
- IV. Observable and Recoverable Operations -> IV. Transparent Calculations
- V. Simplicity and Spec Traceability -> V. Celsius Internally, Fahrenheit for Managers
- Added: VI. Type Safety
- Added: VII. Practical Backward Compatibility
- Added: VIII. Testable Requirements
- Added: IX. Simplicity Over Cleverness
- Added: X. Human Approval for Consequential Decisions
- Added: XI. No Secrets in Source Control
- Added: XII. Brownfield Discipline
Added sections:
- Protected Product Strengths
- Data, Calculation, and Approval Standards
- Testing Standards
Removed sections:
- Generic Product and Technical Constraints wording replaced by WasteWatchers-specific constraints
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/spec-template.md
- Updated: .specify/templates/tasks-template.md
- Not present: .specify/templates/commands/*.md
- Updated: README.md
- Updated: AGENTS.md
Follow-up TODOs:
- None
-->
# WasteWatchers Constitution

## Core Principles

### I. Decision Clarity Over Data Overload
WasteWatchers MUST help logistics and site managers quickly understand what is
wrong, why it matters, what action is recommended, and what that action costs.
Interfaces, APIs, and reports MUST prioritize actionable decisions over raw data
volume. Every manager workflow MUST expose the shipment state, business impact,
recommended next step, and cost or recovery tradeoff in plain operational terms.
Rationale: the product exists to speed consequential cold-chain decisions, not
to make managers interpret unfiltered telemetry.

### II. Preserve Working Product Strengths
The current truck and pallet visualization, shipment queue, emerald visual
identity, simulation workflow, responsive behavior, and dark mode MUST NOT be
removed or materially weakened without explicit approval recorded in the plan.
Changes MAY refine these areas, but the plan MUST identify how the existing
strength is preserved and how regressions will be tested. Rationale: this is a
brownfield product with useful working surfaces that should be improved in
place rather than replaced.

### III. Truthful Data Provenance
Every operational and financial value displayed, persisted, or returned by an
API MUST identify whether it is measured, calculated, simulated, a demo
assumption, manager entered, or unavailable. The system MUST NOT silently
fabricate sensor readings, prices, capacity, weather, traffic, partner
availability, or financial outcomes. Unavailable values MUST be shown as
unavailable or excluded with an explanation. Rationale: managers can only trust
recommendations when they can distinguish fact, calculation, and assumption.

### IV. Transparent Calculations
Financial recovery estimates, spoilage risk, shelf-life calculations,
recommendation rankings, reroute option comparisons, and confidence scores MUST
use centralized, documented, and testable formulas. UI components MUST NOT
duplicate business formulas. Each material formula MUST define inputs,
provenance expectations, boundary behavior, and failure behavior. Rationale:
opaque or scattered calculations make recommendation quality impossible to
audit or improve.

### V. Celsius Internally, Fahrenheit for Managers
Celsius is the canonical internal unit for backend calculations, thresholds,
telemetry storage, and commodity rules. All manager-facing temperature values
MUST be converted to Fahrenheit through a shared utility and clearly labeled
with degrees Fahrenheit. APIs MAY expose Celsius for internal contracts, but UI
view models and copy intended for managers MUST use Fahrenheit. Rationale:
stable internal units protect calculations while Fahrenheit matches the target
manager workflow.

### VI. Type Safety
Stable domain data, API requests, API responses, simulation events,
recommendation inputs, and recommendation outputs MUST use typed TypeScript
interfaces on the Next.js frontend and Pydantic models on the FastAPI backend.
Unstructured dictionaries or loose objects MUST NOT be used where a stable
typed model is appropriate. Rationale: typed contracts prevent silent shape
drift between operational data, calculations, and manager-facing displays.

### VII. Practical Backward Compatibility
Existing APIs, demo behavior, seeded scenarios, and manager workflows SHOULD
remain backward compatible when practical. Breaking changes MUST be documented
in the implementation plan with affected endpoints, UI workflows, tests, and
migration or compatibility handling. Rationale: WasteWatchers is evolving from
working demo and pilot flows; unnecessary breaks slow validation and obscure
regressions.

### VIII. Testable Requirements
Every material calculation and manager workflow MUST have happy path, boundary,
and failure path tests. Required coverage includes temperature conversion,
financial calculations, recommendation eligibility, spoilage risk changes,
simulation behavior, approval state transitions, and UI-preservation behavior
when affected. Rationale: the product's decisions are only credible when the
rules and workflows can be reproduced under normal and adverse conditions.

### IX. Simplicity Over Cleverness
Implementation MUST extend the existing architecture unless the plan documents
why the current services, models, components, or storage boundaries cannot meet
the requirement. New frameworks, services, databases, queues, or abstractions
MUST have a specific operational need and a simpler rejected alternative.
Rationale: WasteWatchers needs dependable decision support, not speculative
architecture.

### X. Human Approval for Consequential Decisions
Recommendations MAY be generated automatically, but reroutes, manual reviews,
rejections, and other consequential decisions MUST require explicit manager
confirmation and an audit record. The audit record MUST capture who or what
confirmed the action, when it happened, the selected option, relevant
recommendation context, and any manager-entered note when supported. Rationale:
automated advice can support decisions, but operational accountability remains
human.

### XI. No Secrets in Source Control
Credentials, API keys, customer data, private partner data, and production
operational data MUST NOT be committed. Configuration examples MUST use safe
placeholder values. Any feature requiring secrets MUST document environment
variables and local setup without exposing real values. Rationale: repository
history is not an appropriate place for private operational access.

### XII. Brownfield Discipline
Plans and implementations MUST inspect existing code before modifying it and
MUST reuse existing services, models, components, utilities, tests, and approval
workflows when practical. Existing user-visible behavior MUST be treated as a
contract unless the plan explicitly changes it. Rationale: disciplined
brownfield work protects working value and keeps changes scoped.

## Protected Product Strengths

WasteWatchers is an agriculture logistics decision support platform for
refrigerated produce shipments. The protected product strengths are:

- Truck and pallet visualization for shipment condition and trailer state.
- Risk-ordered shipment queue and shipment detail workspace.
- Emerald visual identity, responsive behavior, and dark mode.
- Live and deterministic demo simulation workflows.
- Recommendation logic for rerouting at-risk loads.
- FastAPI backend with centralized rules, services, persistence, and Pydantic
  models.
- Current Next.js dashboard implementation and any maintained legacy Streamlit
  demo surfaces until explicitly retired.

Any plan that touches these areas MUST include preservation checks and tests or
manual verification steps.

## Data, Calculation, and Approval Standards

Operational values MUST carry provenance metadata or be derived from typed
models that document provenance. Financial language MUST use transparent terms
such as estimated load value, estimated spoilage loss, reroute cost, estimated
recovered value, and net recovery estimate. Vague wording such as "protected
value" MUST NOT be introduced in new manager-facing copy unless it is defined
with the underlying calculation.

Spoilage logic MUST account for all modeled risk factors relevant to the
feature, not temperature alone, when the data is available. When only
temperature is available, the UI and recommendation rationale MUST make that
limitation clear.

Reroute recommendations MUST explain eligibility, ranking, tradeoffs, and
confidence using centralized formulas. Option comparisons MUST show the cost
breakdown required for a manager to approve, reject, or request review.

## Testing Standards

Frontend changes MUST run linting and a production build before completion.
Backend changes MUST run all available backend tests before completion. A task
or implementation MUST NOT be marked complete while required tests fail unless
the failure is unrelated, documented, and explicitly accepted.

New or changed material behavior MUST include tests for:

- Temperature conversion and Fahrenheit display utilities.
- Financial recovery, spoilage loss, reroute cost, and net estimate formulas.
- Recommendation eligibility, ranking, confidence, and rejection paths.
- Risk changes from temperature and other modeled spoilage factors.
- Simulation state transitions, reset behavior, and outage or invalid-input
  handling.
- Approval, rejection, manual review, and audit state transitions.
- Preservation of protected dashboard surfaces when those surfaces are touched.

## Governance

This constitution governs all WasteWatchers specifications, plans, tasks, and
implementations. It supersedes conflicting project practices, templates, and
informal workflow notes. Any exception MUST be documented in the implementation
plan with its rationale, affected principles, risk, verification plan, and a
simpler or safer alternative that was considered.

Amendments MUST update this file, include a Sync Impact Report, propagate
changed requirements to affected templates and runtime guidance, and preserve
the original ratification date. Reviewers MUST block work that lacks required
data provenance, transparent calculations, approval records, tests, protected
surface preservation, or complexity justification.

Versioning follows semantic versioning:

- MAJOR for removing or redefining principles in a way that invalidates prior
  compliant work.
- MINOR for adding principles, sections, or materially expanded governance.
- PATCH for clarifications, wording improvements, and non-semantic corrections.

**Version**: 2.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-16
