#!/usr/bin/env python3
"""
Fetch Tuya devices via Tuya Cloud OpenAPI.

Requirements:
- Python 3.8+
- requests

Usage:
  python fetch_devices.py \
    --api-key YOUR_ACCESS_ID \
    --api-secret YOUR_ACCESS_SECRET \
    --region eu|us|in|cn

Alternatively set environment variables:
  TUYA_API_KEY, TUYA_API_SECRET, TUYA_REGION

The script will:
  1) Authenticate and obtain an access token
  2) List all devices
  3) For each device, fetch details including local key, IP, and product/model
  4) Save pretty JSON to tuya_devices.json

Notes:
- Local key and IP retrieval uses device detail endpoint; availability depends on account/app permissions.
- Region determines base URL per Tuya docs.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any, Dict, List, Optional, Tuple

import requests

# Try to load python-dotenv, fallback gracefully if not installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Note: python-dotenv not installed. Install with: pip install python-dotenv")
    print("Or set environment variables manually.")


REGION_TO_BASE = {
    # Per Tuya Cloud docs
    "cn": "https://openapi.tuyacn.com",
    "us": "https://openapi.tuyaus.com",
    "eu": "https://openapi.tuyaeu.com",
    "in": "https://openapi.tuyain.com",
}


def now_ms() -> int:
    return int(time.time() * 1000)


def calc_sign(access_id: str, access_secret: str, t: str, 
              sign_str: str, sign_method: str = "HMAC-SHA256") -> str:
    """Compute Tuya OpenAPI signature.

    sign = base64(hmac_sha256(access_secret, content)).hexdigest().upper()
    Content pattern depends on which endpoint and whether a token is present.
    """
    message = sign_str.encode("utf-8")
    secret = access_secret.encode("utf-8")
    sign = hmac.new(secret, msg=message, digestmod=hashlib.sha256).hexdigest().upper()
    return sign


class TuyaClient:
    def __init__(self, access_id: str, access_secret: str, region: str) -> None:
        if region not in REGION_TO_BASE:
            raise ValueError(f"Unsupported region '{region}'. Use one of: {', '.join(REGION_TO_BASE.keys())}")
        self.access_id = access_id
        self.access_secret = access_secret
        self.base_url = REGION_TO_BASE[region]
        self.session = requests.Session()
        self.token: Optional[str] = None
        self.refresh_token: Optional[str] = None

    def _headers(self, path: str, method: str = "GET", 
                 query: str = "", body: Optional[str] = None,
                 need_token: bool = False) -> Dict[str, str]:
        """Build headers with HMAC-SHA256 signature.

        Tuya signature string formats (simplified):
        - Get token: signStr = access_id + str(t)
        - Other calls: signStr = access_id + access_token + str(t)
        body is JSON string for POST when present, else ''.
        """
        t = str(now_ms())

        # Tuya requires: Content-SHA256 of body (lowercase hex) for signing
        body_str = body or ""
        content_sha256 = hashlib.sha256(body_str.encode("utf-8")).hexdigest()

        # Canonical string to sign per Tuya 2.0: method\ncontent-sha256\n\n\n/path
        string_to_sign = "\n".join([
            method.upper(),
            content_sha256,
            "",
            f"{path}{('?' + query) if query else ''}",
        ])

        if need_token and self.token:
            sign_str = self.access_id + self.token + t + string_to_sign
        else:
            sign_str = self.access_id + t + string_to_sign

        sign = calc_sign(self.access_id, self.access_secret, t, sign_str)

        headers = {
            "t": t,
            "sign_method": "HMAC-SHA256",
            "client_id": self.access_id,
            "sign": sign,
            "mode": "cors",
        }
        if need_token and self.token:
            headers["access_token"] = self.token
        if method.upper() in ("POST", "PUT"):
            headers["Content-Type"] = "application/json; charset=utf-8"
        return headers

    def get_token(self) -> Tuple[str, str]:
        path = "/v1.0/token?grant_type=1"
        url = f"{self.base_url}{path}"
        headers = self._headers(path=path, method="GET", need_token=False)
        print("[1/4] Requesting access token...")
        resp = self.session.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("success"):
            raise RuntimeError(f"Failed to get token: {data}")
        result = data.get("result", {})
        self.token = result.get("access_token")
        self.refresh_token = result.get("refresh_token")
        if not self.token:
            raise RuntimeError("No access_token returned")
        print("    ✔ Access token received")
        return self.token, self.refresh_token or ""

    def list_devices(self) -> List[Dict[str, Any]]:
        path = "/v1.3/iot-03/devices"
        url = f"{self.base_url}{path}"
        headers = self._headers(path=path, method="GET", need_token=True)
        print("[2/4] Fetching device list...")
        resp = self.session.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("success"):
            raise RuntimeError(f"Failed to list devices: {data}")
        result = data.get("result") or {}
        devices = result.get("list") or []
        print(f"    ✔ Found {len(devices)} devices")
        return devices

    def device_detail(self, device_id: str) -> Dict[str, Any]:
        path = f"/v1.3/iot-03/devices/{device_id}"
        url = f"{self.base_url}{path}"
        headers = self._headers(path=path, method="GET", need_token=True)
        resp = self.session.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("success"):
            raise RuntimeError(f"Failed to get device detail for {device_id}: {data}")
        return data.get("result") or {}

    def device_network(self, device_id: str) -> Dict[str, Any]:
        path = f"/v1.2/iot-03/devices/{device_id}/network"
        url = f"{self.base_url}{path}"
        headers = self._headers(path=path, method="GET", need_token=True)
        resp = self.session.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("success"):
            # Some accounts may not have access; return empty gracefully
            return {}
        return data.get("result") or {}


def fetch_all_devices(access_id: str, access_secret: str, region: str) -> List[Dict[str, Any]]:
    client = TuyaClient(access_id, access_secret, region)
    client.get_token()
    devices = client.list_devices()
    out: List[Dict[str, Any]] = []

    print("[3/4] Fetching details for each device...")
    for idx, d in enumerate(devices, start=1):
        dev_id = d.get("id") or d.get("device_id") or ""
        name = d.get("name") or d.get("device_name") or ""
        try:
            detail = client.device_detail(dev_id) if dev_id else {}
            network = client.device_network(dev_id) if dev_id else {}
        except Exception as e:
            print(f"    ! Failed to fetch details for {dev_id}: {e}")
            detail, network = {}, {}

        local_key = detail.get("local_key") or detail.get("localKey") or ""
        product_name = (detail.get("product_name") or detail.get("productName") or
                        detail.get("model") or d.get("model") or "")
        ip = network.get("ip") or network.get("local_ip") or ""

        item = {
            "name": name,
            "id": dev_id,
            "local_key": local_key,
            "ip": ip,
            "model": product_name,
        }
        print(f"    ✔ [{idx}/{len(devices)}] {name or dev_id}")
        out.append(item)

    return out


def save_json(filename: str, data: Any) -> None:
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[4/4] Saved {len(data) if isinstance(data, list) else 1} record(s) to {filename}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch Tuya devices to JSON")
    parser.add_argument("--api-key", default=os.getenv("TUYA_API_KEY"), required=False, help="Tuya Access ID")
    parser.add_argument("--api-secret", default=os.getenv("TUYA_API_SECRET"), required=False, help="Tuya Access Secret")
    parser.add_argument("--region", default=os.getenv("TUYA_REGION", "eu"), choices=list(REGION_TO_BASE.keys()), help="API Region")
    parser.add_argument("--output", default="tuya_devices.json", help="Output JSON filename")
    args = parser.parse_args()
    if not args.api_key or not args.api_secret:
        parser.error("--api-key and --api-secret are required (or set TUYA_API_KEY/TUYA_API_SECRET)")
    return args


def main() -> None:
    args = parse_args()
    print("Tuya Cloud Device Fetcher")
    print(f"Region: {args.region}")
    try:
        devices = fetch_all_devices(args.api_key, args.api_secret, args.region)
        save_json(args.output, devices)
        print("Done.")
    except requests.HTTPError as http_err:
        print(f"HTTP error: {http_err}")
        if http_err.response is not None:
            try:
                print("Response:", http_err.response.text)
            except Exception:
                pass
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise


if __name__ == "__main__":
    main()


