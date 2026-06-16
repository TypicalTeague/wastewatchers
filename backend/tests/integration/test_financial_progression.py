from __future__ import annotations


def test_financial_recovery_declines_as_spoilage_worsens(client):
    initial = client.post("/demo/scenario/load").json()
    before = next(item for item in initial["shipments"] if item["shipment_id"] == "DEMO-1003")
    before_value = before["recommended_decision"]["financial_breakdown"]["estimated_net_value_preserved_usd"]

    for _ in range(3):
        updated = client.post("/demo/simulation/step").json()

    after = next(item for item in updated["shipments"] if item["shipment_id"] == "DEMO-1003")
    after_value = after["recommended_decision"]["financial_breakdown"]["estimated_net_value_preserved_usd"]

    assert after_value <= before_value

