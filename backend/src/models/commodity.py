from __future__ import annotations

from pydantic import BaseModel, Field, model_validator


class CommodityThermalProfile(BaseModel):
    commodity_id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    min_temp_c: float
    max_temp_c: float
    baseline_shelf_life_hours: float = Field(gt=0)
    excursion_penalty_per_hour: float = Field(ge=0)
    critical_temp_c: float
    critical_penalty_multiplier: float = Field(ge=1)

    @model_validator(mode="after")
    def validate_temperature_window(self) -> "CommodityThermalProfile":
        if self.min_temp_c >= self.max_temp_c:
            raise ValueError("min_temp_c must be lower than max_temp_c")
        return self

