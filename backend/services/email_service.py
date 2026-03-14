import os
import secrets

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig


conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("EMAIL_USER"),
    MAIL_PASSWORD = os.getenv("EMAIL_PASS"),
    MAIL_FROM = os.getenv("EMAIL_USER"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME = "BeatSignal",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False
)


def generate_verify_token():

    return secrets.token_urlsafe(32)



async def send_verification_email(email, token):

    link = f"{os.getenv('FRONTEND_URL')}/verify?token={token}"

    message = MessageSchema(
        subject="Verify your BeatSignal account",
        recipients=[email],
        body=f"""
Welcome to BeatSignal.

Click this link to verify your account:

{link}

If you didn't create this account you can ignore this email.
""",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)
