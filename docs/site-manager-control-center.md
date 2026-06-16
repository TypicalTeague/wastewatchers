# WasteWatchers Site Manager Control Center

## Unit Handling

Celsius remains the backend canonical unit for shipment state, thresholds,
simulation, and calculations. Manager-facing dashboard temperature displays use
the shared frontend helpers in `src/lib/api/display.ts`, which convert Celsius
to Fahrenheit and label values with `°F`.

## Financial Formula

Estimated net value preserved equals expected salvage revenue plus avoided
disposal cost minus rerouting transportation cost minus sorting and handling
cost minus processing or destination fees.

Expected unrecovered value equals original cargo value minus expected gross
recovery value. Value recovery and cost avoidance are shown separately so demo
assumptions are not presented as guaranteed savings.

## Centralized Assumptions

Demo destination assumptions live in
`backend/src/config/destination_assumptions.py`. This module is the only source
for demo recovery percentages, travel times, rerouting costs, handling costs,
destination fees, avoided disposal costs, paid-material behavior, and capacity
availability.

Compost is modeled as waste diversion and cost avoidance. It does not recover
original retail cargo value unless the destination assumption explicitly pays
for material.

## Provenance Labels

Operational and financial values use provenance labels from the backend model:
measured, calculated, simulated, demo assumption, manager entered, or
unavailable. Missing integrations are shown as Data unavailable rather than
normal-looking invented values.

## Spoilage Signals

The demo currently uses available simulated temperature, safe range, duration
outside range, cumulative exposure, temperature trend, remaining shelf life,
route time, ETA/deadline, commodity tolerance implied by safe band, sensor
freshness, destination acceptance, and capacity assumptions. Weather, traffic,
and GPS coordinates are explicitly unavailable in this demo.

## Recommendation Ranking

Response options are built in `backend/src/rules/reroute.py` from centralized
destination assumptions and financial calculations. Food safety blocks market
recovery before financial ranking. Options that arrive after usable shelf life
expires are not viable. Among viable recovery options, ranking considers net
value preserved, shelf life at arrival, and route time.

## Real Data Replacement

Customer deployments should replace demo assumptions with measured or partner
provided values through typed backend models. Do not add credentials, partner
availability, pricing, weather, traffic, capacity, or GPS coordinates until
those integrations are configured and their provenance can be shown.

## Verification Results

- `pytest backend/tests`: passed, 53 tests.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed after allowing the build to fetch configured
  Next.js Google font assets.

