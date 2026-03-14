import os
import requests

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")

PAYPAL_API = "https://api-m.paypal.com"


def get_access_token():

    url = f"{PAYPAL_API}/v1/oauth2/token"

    response = requests.post(
        url,
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"}
    )

    data = response.json()

    return data["access_token"]


def create_order(amount):

    access_token = get_access_token()

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

    response = requests.post(url, headers=headers, json=body)

    data = response.json()

    return data["id"]


def capture_order(order_id):

    access_token = get_access_token()

    url = f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.post(url, headers=headers)

    return response.json()
