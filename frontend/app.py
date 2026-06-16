from __future__ import annotations

import os

import streamlit as st

from frontend.components.control_center import empty_state_message, metric_cards, shipment_card_rows
from frontend.components.demo_controls import confirmation_message, load_button_label, simulation_mode_label
from frontend.components.pallet_visualization import pallet_summary
from frontend.components.recommendation_panel import approve_recommendation, recommendation_summary
from frontend.components.shipment_table import shipment_rows
from frontend.components.telemetry_charts import temperature_chart_rows
from backend.src.models.demo import SimulationConfig
from frontend.services.wastewatchers_client import WasteWatchersClient


def main() -> None:
    st.set_page_config(page_title="WasteWatchers", layout="wide")
    st.title("WasteWatchers Salvage Rerouting")

    client = WasteWatchersClient(os.getenv("WASTEWATCHERS_API_BASE_URL", "http://127.0.0.1:8000"))
    demo_state = client.get_demo_dashboard()

    st.subheader("Demo Operations Control Center")
    message = confirmation_message(demo_state)
    if message:
        st.info(message)
    if st.button(load_button_label(demo_state)):
        demo_state = client.load_demo_scenario()
        st.success(demo_state.message)
        st.rerun()
    if not demo_state.empty_state and st.button("Reset Demo Scenario"):
        demo_state = client.reset_demo_scenario()
        st.warning(demo_state.message)
        st.rerun()

    empty_message = empty_state_message(demo_state)
    if empty_message:
        st.caption(empty_message)
    else:
        st.caption(simulation_mode_label(demo_state))
        interval = st.number_input("Simulation interval seconds", min_value=1, max_value=60, value=5, step=1)
        simulation_columns = st.columns(3)
        if simulation_columns[0].button("Start Live Simulation"):
            demo_state = client.start_demo_simulation(SimulationConfig(interval_seconds=int(interval)))
            st.success(demo_state.message)
            st.rerun()
        if simulation_columns[1].button("Pause Simulation"):
            demo_state = client.pause_demo_simulation()
            st.info(demo_state.message)
            st.rerun()
        if simulation_columns[2].button("Advance One Step"):
            demo_state = client.advance_demo_simulation_step()
            st.info(demo_state.message)
            st.rerun()
        metric_columns = st.columns(4)
        for column, (label, value) in zip(metric_columns, metric_cards(demo_state.metrics), strict=True):
            column.metric(label, value)
        st.dataframe(shipment_card_rows(demo_state.shipments), use_container_width=True)
        for shipment in demo_state.shipments:
            st.caption(pallet_summary(shipment))
            st.line_chart(temperature_chart_rows(shipment), x="recorded_at", y="temperature_c")

    st.divider()
    st.subheader("Salvage Rerouting Queue")
    shipments = client.list_at_risk_shipments()
    if shipments:
        st.dataframe(shipment_rows(shipments), use_container_width=True)
    else:
        st.caption("No at-risk production shipments are currently queued.")

    if shipments:
        selected = st.selectbox("Shipment", [shipment.shipment_id for shipment in shipments])
        detail = client.get_shipment_detail(selected)
        st.subheader("Recommendation")
        st.write(recommendation_summary(detail.recommendation))
        if detail.recommendation and detail.recommendation.get("status") == "available":
            approved_by = st.text_input("Approver", value="farm.logistics@example.com")
            if st.button("Approve salvage reroute"):
                st.success(approve_recommendation(client, detail.recommendation, approved_by))
                st.rerun()


if __name__ == "__main__":
    main()
