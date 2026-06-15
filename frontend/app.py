from __future__ import annotations

import os

import streamlit as st

from frontend.components.recommendation_panel import approve_recommendation, recommendation_summary
from frontend.components.shipment_table import shipment_rows
from frontend.services.wastewatchers_client import WasteWatchersClient


def main() -> None:
    st.set_page_config(page_title="WasteWatchers", layout="wide")
    st.title("WasteWatchers Salvage Rerouting")

    client = WasteWatchersClient(os.getenv("WASTEWATCHERS_API_BASE_URL", "http://127.0.0.1:8000"))
    shipments = client.list_at_risk_shipments()
    st.dataframe(shipment_rows(shipments), use_container_width=True)

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
