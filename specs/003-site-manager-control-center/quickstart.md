# Quickstart: WasteWatchers Site Manager Control Center

## Purpose

Validate the planned Site Manager Control Center implementation once tasks are
generated and completed. Do not treat this quickstart as implementation work.

## Prerequisites

- Backend dependencies installed for the existing FastAPI app.
- Frontend dependencies installed for the existing Next.js app.
- No external paid services, credentials, real partner data, or real customer
  data required.

## Run the Application

Start the backend:

```powershell
uvicorn backend.src.main:app --reload
```

Start the Next.js dashboard:

```powershell
npm run dev
```

Open the dashboard route:

```text
http://localhost:3000/dashboard
```

## Manual Validation Flow

1. Load the demo scenario.
2. Confirm the shipment queue is still visible, ordered worst first, and shows
   risk status, commodity, decision deadline, remaining shelf life, latest
   update, freshness, and what changed.
3. Open the highest-risk shipment.
4. Confirm the existing truck and pallet visualization remains intact and
   interactive.
5. Confirm all manager-facing temperatures and safe ranges display in degrees
   Fahrenheit with the degrees Fahrenheit label.
6. Confirm Celsius remains visible only in technical/internal contexts where
   intentionally exposed.
7. Confirm stale, missing, simulated, calculated, demo-assumption, and
   manager-entered values are labeled by provenance.
8. Confirm the central workspace contains the full Recommended Decision, not
   only a right-sidebar summary.
9. Confirm the recommendation includes destination, rationale, deadline, travel
   time, expected condition at arrival, financial effect, confidence, and
   expected post-action risk.
10. Compare response options and confirm continuing delivery, secondary market,
    processor, compost, manual review, and rejection/disposal are represented
    when applicable.
11. Confirm options are labeled Recommended, Viable alternative, or Not viable.
12. Confirm options arriving after usable shelf life expires cannot be
    recommended.
13. Confirm food safety restrictions outrank financial recovery.
14. Confirm composting does not treat original retail cargo value as recovered
    unless a paid-material assumption is visible.
15. Review the financial estimate and confirm the label is Estimated net value
    preserved, with value recovery and cost avoidance shown separately.
16. Start or step the simulation and confirm worsening conditions update risk,
    option eligibility, acceptance rate, financial estimates, confidence, and
    recommended destination where applicable.
17. Confirm approved recommendations stop appearing as unapproved suggestions.
18. Confirm no fake route map appears when real coordinates are unavailable;
    route, ETA, delay, and destination cards are used instead.
19. Confirm responsive behavior and dark mode remain acceptable where currently
    supported.

Visual verification notes are captured in
`specs/003-site-manager-control-center/visual-verification.md`.

## Automated Verification

Frontend:

```powershell
npm run lint
npm run build
```

Backend:

```powershell
pytest backend/tests
```

Latest implementation verification on 2026-06-16:

- `pytest backend/tests`: passed, 53 tests.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed after allowing the build to fetch configured
  Next.js Google font assets.

Required new or updated automated coverage:

- Frontend temperature conversion and display formatting tests.
- Backend financial calculation tests.
- Destination eligibility tests.
- Compost zero resale revenue test.
- Shelf life at arrival tests.
- Risk progression tests.
- Estimated net value deterioration tests.
- Recommendation ranking tests.
- API schema/contract tests.
- Manager approval, manual review, rejection, and audit state tests.

## Documentation Verification

Implementation must add or update documentation covering:

- Celsius internal handling and Fahrenheit manager display.
- Financial formulas and calculation boundaries.
- Centralized demo destination assumptions.
- Provenance labels and unavailable-value behavior.
- Supported spoilage signals and unavailable integrations.
- Recommendation eligibility and ranking.
- Replacement path for demo assumptions with real customer data.
