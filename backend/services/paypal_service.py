import os
import requests

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")

PAYPAL_API = "https://api-m.paypal.com"


def get_access_token():
    url = f"{PAYPAL_API}/v1/oauth2/token"

    try:
        response = requests.post(
            url,
            auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
            data={"grant_type": "client_credentials"}
        )

        data = response.json()

        return data.get("access_token")

    except Exception as e:
        print("PayPal token error:", e)
        return None


def create_order(amount):
    access_token = get_access_token()

    if not access_token:
        return None

    url = f"{PAYPAL_API}/v2/checkout/orders"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    body = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": amount
                }
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=body)

        data = response.json()

        return data.get("id")

    except Exception as e:
        print("PayPal create order error:", e)
        return None


def capture_order(order_id):
    access_token = get_access_token()

    if not access_token:
        return {"status": "error"}

    url = f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.post(url, headers=headers)

        data = response.json()

        return data

    except Exception as e:
        print("PayPal capture error:", e)
        return {"status": "error"}
