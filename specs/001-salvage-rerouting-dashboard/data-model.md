# Data Model: Salvage Rerouting Dashboard

## Shipment

Represents a crop load in transit.

**Fields**:
- `shipment_id`: stable unique identifier.
- `trailer_id`: trailer reporting telemetry.
- `commodity_id`: linked commodity thermal profile.
- `origin`: farm or shipping origin label.
- `planned_destination`: original warehouse or receiver.
- `current_destination`: current intended destination after any reroute.
- `transit_state`: `in_transit`, `arrived`, `cancelled`.
- `decision_state`: `healthy`, `watch`, `at_risk`, `salvage_recommended`,
  `reroute_approved`, `manual_follow_up_required`.
- `expected_arrival_at`: expected dock arrival time.
- `created_at`, `updated_at`: audit timestamps.

**Validation rules**:
- `shipment_id`, `trailer_id`, and `commodity_id` are required.
- `expected_arrival_at` must be present for in-transit shipments.
- `current_destination` defaults to `planned_destination`.

**Relationships**:
- Has many `TrailerTelemetryReading` records.
- Has many `ShelfLifeAssessment` records.
- Has zero or more `RerouteRecommendation` records.
- Has zero or more `ApprovalRecord` records.

## TrailerTelemetryReading

Represents a time-stamped temperature observation.

**Fields**:
- `reading_id`: unique reading identifier.
- `shipment_id`: associated shipment.
- `trailer_id`: trailer source.
- `recorded_at`: telemetry observation time.
- `received_at`: time WasteWatchers received the reading.
- `temperature_c`: observed trailer temperature in Celsius.
- `source`: telemetry provider or simulator label.

**Validation rules**:
- `temperature_c` must be numeric and within a plausible refrigerated transport
  range of -40 to 60 degrees Celsius.
- `recorded_at` must not be after `received_at`.
- Duplicate `shipment_id`, `trailer_id`, and `recorded_at` readings are
  idempotent and do not create duplicate risk calculations.

**Relationships**:
- Belongs to one `Shipment`.
- Feeds one or more `ShelfLifeAssessment` calculations over time.

## CommodityThermalProfile

Defines safe handling thresholds and shelf-life sensitivity for a commodity.

**Fields**:
- `commodity_id`: stable profile identifier.
- `name`: commodity name.
- `min_temp_c`: minimum acceptable transport temperature.
- `max_temp_c`: maximum acceptable transport temperature.
- `baseline_shelf_life_hours`: expected shelf life under acceptable transport.
- `excursion_penalty_per_hour`: shelf-life reduction applied while out of range.
- `critical_temp_c`: severe excursion threshold.
- `critical_penalty_multiplier`: multiplier for severe excursions.

**Validation rules**:
- `min_temp_c` must be lower than `max_temp_c`.
- `baseline_shelf_life_hours` must be positive.
- Penalty values must be zero or positive.

**Relationships**:
- Referenced by one or more `Shipment` records.
- Used by shelf-life rules to create `ShelfLifeAssessment` records.

## ShelfLifeAssessment

Captures the current risk and estimated remaining shelf life for a shipment.

**Fields**:
- `assessment_id`: unique assessment identifier.
- `shipment_id`: assessed shipment.
- `calculated_at`: calculation time.
- `remaining_shelf_life_hours`: estimated viable shelf life.
- `risk_status`: `healthy`, `watch`, `at_risk`, `manual_follow_up_required`.
- `temperature_excursion_minutes`: total recent time outside acceptable range.
- `reason_codes`: structured reasons such as `missing_profile`,
  `telemetry_gap`, `severe_excursion`, `stale_reading`.

**Validation rules**:
- Remaining shelf life cannot be negative; exhausted shelf life is represented
  as `0`.
- `manual_follow_up_required` must include at least one reason code.
- Assessments must reference the profile version used for calculation when
  profiles become versioned.

**Relationships**:
- Belongs to one `Shipment`.
- May trigger one `RerouteRecommendation`.

## RerouteRecommendation

Represents a proposed salvage action for an at-risk shipment.

**Fields**:
- `recommendation_id`: unique recommendation identifier.
- `shipment_id`: affected shipment.
- `assessment_id`: shelf-life assessment that produced the recommendation.
- `recommended_destination`: salvage destination or resolution target.
- `urgency`: `low`, `medium`, `high`, `critical`.
- `expires_at`: time after which the recommendation must be recalculated.
- `status`: `available`, `expired`, `not_viable`, `approved`.
- `rationale`: manager-facing explanation.

**Validation rules**:
- Recommendations require a non-expired at-risk or salvage assessment.
- `recommended_destination` is required when status is `available` or
  `approved`.
- Expired recommendations cannot be approved.

**Relationships**:
- Belongs to one `Shipment`.
- References one `ShelfLifeAssessment`.
- May have one `ApprovalRecord`.

## ApprovalRecord

Records a manager's salvage reroute decision.

**Fields**:
- `approval_id`: unique decision identifier.
- `recommendation_id`: approved recommendation.
- `shipment_id`: affected shipment.
- `approved_by`: manager identity or display name.
- `approved_at`: decision timestamp.
- `decision`: `approved`, `rejected`, `manual_follow_up`.
- `resulting_destination`: destination after approval, if applicable.
- `decision_note`: optional manager note.

**Validation rules**:
- Approvals require an available recommendation.
- A recommendation can be approved once.
- `approved_at` must be before shipment arrival for one-click reroute approval.
- `resulting_destination` is required for approved reroutes.

**Relationships**:
- Belongs to one `Shipment`.
- Belongs to one `RerouteRecommendation`.

## State Transitions

```text
healthy -> watch -> at_risk -> salvage_recommended -> reroute_approved
                         |             |
                         |             `-> manual_follow_up_required
                         `-> manual_follow_up_required
```

**Rules**:
- `healthy` moves to `watch` when readings approach profile thresholds.
- `watch` moves to `at_risk` when remaining shelf life crosses the review
  threshold or a severe excursion occurs.
- `at_risk` moves to `salvage_recommended` only when a viable destination is
  available before arrival.
- Any state can move to `manual_follow_up_required` when data is missing, stale,
  contradictory, or no safe automated recommendation exists.
- `salvage_recommended` moves to `reroute_approved` after a valid manager
  approval.
