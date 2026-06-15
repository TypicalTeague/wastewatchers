from __future__ import annotations

import pytest

from frontend.services.wastewatchers_client import ClientError, WasteWatchersClient


class FakeResponse:
    status_code = 409
    text = "conflict"

    def json(self):
        return {"code": "conflict"}


def test_approval_client_raises_for_conflict(monkeypatch):
    class FakeHTTPClient:
        def __init__(self, *args, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return None

        def request(self, *args, **kwargs):
            return FakeResponse()

    monkeypatch.setattr("frontend.services.wastewatchers_client.httpx.Client", FakeHTTPClient)

    with pytest.raises(ClientError):
        WasteWatchersClient()._request("POST", "/recommendations/REC-1/approve")

