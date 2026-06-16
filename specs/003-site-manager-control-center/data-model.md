# Data Model: WasteWatchers Site Manager Control Center

## Overview

The feature extends the existing demo dashboard payload with richer typed
decision-support models. Backend ownership remains Pydantic; frontend ownership
remains TypeScript interfaces aligned to those Pydantic models. Existing fields
such as `temperature_c`, `safe_temp_min_c`, `safe_temp_max_c`,
`value_protected_usd`, and `recommended_destination` should be preserved during
transition for backward compatibility, but new manager-facing views should use
the richer typed fields.

## Enumerations

### DataProvenance

Values:

- `measured`
- `calculated`
- `simulated`
- `demo_assumption`
- `manager_entered`
- `unavailable`

Validation:

- Every manager-facing operational or financial value must carry one of these
  provenance values.
- `unavailable` values must not be used as normal numeric inputs without an
  explicit fallback rule.

### DestinationType

Values:

- `continue_delivery`
- `secondary_market`
- `food_processor`
- `compost_facility`
- `reject_dispose`
- `manual_review`

Validation:

- Compost options must not recover original retail cargo value unless a positive
  paid-material assumption is explicit.
- Reject/dispose options may include avoided disposal cost only when the
  assumption is present and disclosed.

### OptionViability

Values:

- `recommended`
- `viable_alternative`
- `not_viable`

Validation:

- Only one option may be `recommended` for a shipment at a time.
- An option arriving after usable shelf life expires must be `not_viable`.
- Any food-safety failure must force `not_viable` regardless of financial value.

### SensorStatus

Values:

- `fresh`
- `stale`
- `missing`
- `simulated`

Validation:

- `stale` and `missing` must reduce confidence or trigger manual review.
- `simulated` must be visible as simulated in manager-facing displays.

### ConfidenceLevel

Values:

- `high`
- `medium`
- `low`
- `manual_review_required`

Validation:

- Missing safety-critical data cannot produce `high` confidence.
- Manual review is required when confidence cannot support a recommended
  operational action.

### ManagerDecisionAction

Existing values:

- `approve_reroute`
- `send_manual_review`
- `reject_shipment`

Extended meaning:

- Approval may select any viable response option, not just a generic reroute.
- Manual review and rejection must be explicit confirmed decisions.

## Entities

### ProvenancedValue

Generic value wrapper used conceptually by typed models. Implementations may use
specific typed fields rather than a generic class when stronger typing is
clearer.

Fields:

- `label`: Display label.
- `value`: String, number, percentage, money, duration, or null.
- `unit`: Optional unit such as `USD`, `%`, `minutes`, `hours`, or `Celsius`.
- `provenance`: `DataProvenance`.
- `source`: Human-readable source such as telemetry, simulation, destination
  assumption, manager entry, or formula.
- `unavailable_reason`: Required when provenance is `unavailable`.

Validation:

- `unavailable_reason` is required for unavailable values.
- Manager-facing temperatures should not expose Celsius through this wrapper;
  Celsius remains internal and is converted in frontend display formatting.

### DestinationAssumption

Centralized demo configuration for a destination type.

Fields:

- `destination_type`: `DestinationType`.
- `destination_name`: Fictional demo destination name.
- `acceptance_percentage`: Percent accepted at destination.
- `base_travel_minutes`: Estimated travel duration.
- `rerouting_cost_usd`: Additional transportation cost.
- `sorting_handling_cost_usd`: Sorting and handling cost.
- `processing_or_destination_fee_usd`: Processing, destination, compost, or
  disposal fee.
- `avoided_disposal_cost_usd`: Cost avoided by salvage or diversion.
- `paid_material_value_usd`: Optional paid value for compost or byproduct
  material.
- `operational_risk`: Low/medium/high display value.
- `capacity_status`: Available, constrained, unavailable, or unknown.
- `provenance`: Usually `demo_assumption` for seeded demo data.
- `notes`: Visible assumption details for managers.

Validation:

- Acceptance percentage must be 0 to 100.
- All costs must be non-negative.
- Compost assumptions default to zero paid material value unless explicitly set.
- Reject/dispose assumptions cannot be recommended for financial recovery.

### FinancialBreakdown

Transparent financial estimate for an option.

Fields:

- `original_cargo_value_usd`.
- `destination_acceptance_percentage`.
- `expected_gross_recovery_usd`.
- `value_recovery_usd`.
- `avoided_disposal_cost_usd`.
- `rerouting_cost_usd`.
- `sorting_handling_cost_usd`.
- `processing_or_destination_fee_usd`.
- `incremental_cost_usd`.
- `expected_unrecovered_value_usd`.
- `estimated_net_value_preserved_usd`.
- `is_estimate`: Always true for this feature.
- `not_guaranteed_message`.
- `inputs`: List of provenanced financial inputs.

Formula:

- Estimated net value preserved = expected salvage revenue + avoided disposal
  cost - additional rerouting transportation cost - sorting and handling cost -
  processing or destination fees.
- Expected unrecovered value = original cargo value - expected gross recovery
  value.

Validation:

- Expected unrecovered value cannot be negative unless a manager-entered
  adjustment explicitly explains the exception.
- Missing required financial inputs produce an incomplete estimate, not a
  fabricated zero.
- Value recovery and cost avoidance remain separate fields.

### RiskDriver

One factor materially influencing risk or recommendation.

Fields:

- `driver_id`.
- `label`.
- `description`.
- `impact`: Low/medium/high/critical.
- `direction`: Improving, stable, worsening, or unknown.
- `provenance`: `DataProvenance`.
- `source_value`: Optional provenanced value.

Validation:

- A shipment assessment should expose the three strongest drivers when
  available.
- Unavailable drivers must explain why they are unavailable.

### SensorFreshness

Telemetry status for a shipment.

Fields:

- `status`: `SensorStatus`.
- `latest_update_at`.
- `minutes_since_update`.
- `message`.
- `provenance`.

Validation:

- `missing` requires no latest update.
- `stale` requires a latest update and age beyond freshness threshold.

### ConfidenceScore

Confidence in the recommendation or assessment.

Fields:

- `level`: `ConfidenceLevel`.
- `score_percent`: 0 to 100 when calculable.
- `reason_codes`: List of reason strings.
- `provenance`: Usually `calculated`.
- `manual_review_required`: Boolean.

Validation:

- Stale or missing telemetry must add a reason code and lower confidence or
  require manual review.
- Score cannot be high when safety-critical signals are unavailable.

### ResponseOption

One possible manager response.

Fields:

- `option_id`.
- `destination_type`: `DestinationType`.
- `destination_name`.
- `label`.
- `travel_time_minutes`.
- `condition_at_arrival`.
- `shelf_life_at_arrival_hours`.
- `acceptance_percentage`.
- `financial_breakdown`: `FinancialBreakdown`.
- `expected_waste_diversion_percent`.
- `operational_risk`.
- `viability`: `OptionViability`.
- `viability_reasons`.
- `food_safety_passed`.
- `confidence`: `ConfidenceScore`.
- `assumptions`: List of visible destination assumptions.

Validation:

- Recommended options must be viable, food-safety passing, and arrive before
  usable shelf life expires.
- Not viable options must include at least one reason.
- Compost cannot count original retail cargo value as recovered unless paid
  material value is explicit.

### RecommendedDecision

The single promoted action in the shipment workspace.

Fields:

- `recommendation_id`.
- `title`: Action-oriented text.
- `option_id`.
- `destination_name`.
- `deadline_at` or `deadline_minutes`.
- `rationale`.
- `travel_time_minutes`.
- `expected_condition_at_arrival`.
- `financial_effect`: `FinancialBreakdown`.
- `confidence`: `ConfidenceScore`.
- `expected_post_action_risk`.
- `status`: Available, approved, manual review, rejected, not viable, or
  unavailable.

Validation:

- Available recommendations require a destination and linked response option.
- Approved recommendations must stop appearing as unapproved suggestions.
- Unavailable recommendations must explain missing or disqualifying conditions.

### ControlCenterShipmentState

Extended demo shipment state returned to the dashboard.

Fields:

- Existing `DemoShipmentState` fields for backward compatibility.
- `decision_deadline_at` or `time_remaining_to_act_minutes`.
- `sensor_freshness`: `SensorFreshness`.
- `latest_update_at`.
- `change_summary`.
- `risk_drivers`: List of `RiskDriver`.
- `confidence`: `ConfidenceScore`.
- `expected_shelf_life_at_arrival_hours`.
- `response_options`: List of `ResponseOption`.
- `recommended_decision`: Optional `RecommendedDecision`.
- `event_timeline`: List of condition, simulation, recommendation, and decision
  events.
- `technical_details`: Provenance and calculation details for advanced review.

Validation:

- Queue ordering must have enough fields to sort by risk, decision deadline,
  shelf life, and freshness.
- Missing data must be explicitly represented rather than omitted when it
  affects decisions.

### ManagerDecisionRequest

Confirmed manager action request.

Fields:

- `action`: `ManagerDecisionAction`.
- `actor_label`.
- `shipment_id`.
- `option_id`: Required for approval, optional for manual review or rejection.
- `decision_note`: Optional.
- `confirmation_acknowledged`: Boolean.

Validation:

- Confirmation must be true for approve, manual review, and reject actions.
- Approval requires a viable option.
- Rejection and manual review may include no destination but must record current
  recommendation context.

### ManagerDecisionEvent

Audit record for confirmed decisions.

Fields:

- Existing demo decision fields.
- `option_id`.
- `destination_name`.
- `estimated_net_value_preserved_usd`.
- `recommendation_context`.
- `decision_note`.
- `prior_status`.
- `resulting_status`.

Validation:

- Event is immutable once persisted.
- Approved decisions update shipment status and remove unapproved suggestion
  status.

### SimulationUpdate

Extension of existing simulation step context.

Fields:

- Existing `SimulationStep` fields.
- `changed_shipments`.
- `change_summary_by_shipment`.
- `financial_changes`.
- `option_viability_changes`.
- `confidence_changes`.
- `recommended_destination_changes`.

Validation:

- Worsening spoilage should generally reduce expected recovery unless a visible
  assumption explains otherwise.
- Approved recommendations must not be regenerated as unapproved suggestions.

## State Transitions

### Shipment Decision State

```text
healthy/watch/at_risk/critical
  -> manual_review       (manager confirms review or confidence requires review)
  -> reroute_approved    (manager confirms viable option approval)
  -> rejected            (manager confirms rejection/disposal)

reroute_approved/manual_review/rejected
  -> remains terminal for unapproved recommendation display
  -> may still receive telemetry and simulation timeline updates
```

### Response Option Viability

```text
viable_alternative -> recommended     (highest-ranked eligible option)
recommended        -> viable_alternative (another eligible option ranks higher)
recommended        -> not_viable      (shelf life, food safety, capacity, or confidence failure)
viable_alternative -> not_viable      (eligibility failure)
not_viable         -> viable_alternative (only if new measured/entered data restores eligibility)
```

### Sensor Freshness

```text
fresh -> stale      (latest reading exceeds freshness threshold)
fresh -> missing    (telemetry unavailable)
stale -> fresh      (new reading arrives)
missing -> fresh    (reading arrives)
fresh/stale/missing -> simulated (demo mode when values are generated)
```
