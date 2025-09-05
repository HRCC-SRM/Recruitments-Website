#!/usr/bin/env python3
"""
Send HTML emails to all users with status "shortlisted" from the MongoDB database.

Usage (recommended - using a Python virtualenv):
  1) python3 -m venv .venv && source .venv/bin/activate
  2) pip install -r scripts/requirements.txt
  3) Create a .env file (or export env vars) with:
       MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
       MONGO_DB=<your_database_name>
       MONGO_USERS_COLLECTION=users
       SENDER_EMAIL=hrccsrm@gmail.com
       SENDER_PASSWORD=<gmail_app_password>
       EMAIL_SUBJECT=HRCC Recruitment Update
       EMAIL_TEMPLATE_PATH=scripts/email_template.html
  4) python scripts/send_shortlisted_emails.py --dry-run   # Preview
     python scripts/send_shortlisted_emails.py             # Send

Notes:
  - Gmail requires an App Password if 2FA is enabled: https://support.google.com/accounts/answer/185833
  - We send emails individually (not BCC) to personalize with the recipient name.
  - The script is idempotent; no state is stored. Consider tagging users once mailed if needed.
"""

import os
import sys
import time
import argparse
from typing import Dict, Any, List

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl

try:
    from pymongo import MongoClient
except ImportError:
    print("Missing dependency: pymongo. Run: pip install -r scripts/requirements.txt", file=sys.stderr)
    raise

try:
    from dotenv import load_dotenv
except ImportError:
    # Optional; proceed without .env support if not installed
    def load_dotenv(*args, **kwargs):
        return False


def load_config() -> Dict[str, str]:
    load_dotenv()  # Loads from .env if present

    cfg = {
        "MONGO_URI": os.getenv("MONGO_URI", ""),
        "MONGO_DB": os.getenv("MONGO_DB", "hrcc"),
        "MONGO_USERS_COLLECTION": os.getenv("MONGO_USERS_COLLECTION", "users"),
        "SENDER_EMAIL": os.getenv("SENDER_EMAIL", "hrccsrm@gmail.com"),
        "SENDER_PASSWORD": os.getenv("SENDER_PASSWORD", ""),
        "EMAIL_SUBJECT": os.getenv("EMAIL_SUBJECT", "HRCC Recruitment Update"),
        "EMAIL_TEMPLATE_PATH": os.getenv("EMAIL_TEMPLATE_PATH", "scripts/email_template.html"),
        "SMTP_HOST": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "SMTP_PORT": os.getenv("SMTP_PORT", "465"),
        "RATE_LIMIT_SECS": os.getenv("RATE_LIMIT_SECS", "0.5"),
    }

    missing = [k for k in ["MONGO_URI", "SENDER_PASSWORD"] if not cfg.get(k)]
    if missing:
        print(f"ERROR: Missing required env vars: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

    return cfg


def get_shortlisted_users(client: MongoClient, db_name: str, collection: str) -> List[Dict[str, Any]]:
    db = client[db_name]
    users = db[collection]
    # Status values: active, shortlisted, rejected, holded
    cursor = users.find({"status": "shortlisted"}, {
        "name": 1,
        "email": 1,
        "srmEmail": 1,
        "regNo": 1,
    })
    return list(cursor)


def render_html(template_path: str, variables: Dict[str, str]) -> str:
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()
    # Very simple templating: replace {{key}} with value
    for k, v in variables.items():
        html = html.replace(f"{{{{{k}}}}}", v)
    return html


def send_email(smtp_host: str, smtp_port: int, sender_email: str, sender_password: str,
               recipient_email: str, subject: str, html_body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_body, "html", _charset="utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, [recipient_email], msg.as_string())


def main() -> None:
    parser = argparse.ArgumentParser(description="Send HTML email to all shortlisted users.")
    parser.add_argument("--dry-run", action="store_true", help="Do not send emails, just print recipients")
    args = parser.parse_args()

    cfg = load_config()

    client = MongoClient(cfg["MONGO_URI"])  # uses SRV or standard URI
    try:
        recipients = get_shortlisted_users(client, cfg["MONGO_DB"], cfg["MONGO_USERS_COLLECTION"])
    finally:
        client.close()

    if not recipients:
        print("No shortlisted users found.")
        return

    print(f"Found {len(recipients)} shortlisted users.")

    if args.dry_run:
        for u in recipients[:10]:
            print(f"- {u.get('name','')} <{u.get('email','')}> (regNo={u.get('regNo','')})")
        if len(recipients) > 10:
            print(f"... and {len(recipients) - 10} more")
        return

    sent = 0
    failed = 0
    rate_limit = float(cfg["RATE_LIMIT_SECS"]) or 0.0

    for u in recipients:
        to_email = (u.get("email") or u.get("srmEmail") or "").strip()
        if not to_email:
            print(f"[skip] Missing email for user id={u.get('_id')} name={u.get('name','')}")
            continue

        vars = {
            "name": u.get("name", "Applicant"),
            "regNo": u.get("regNo", ""),
        }
        try:
            html = render_html(cfg["EMAIL_TEMPLATE_PATH"], vars)
            send_email(
                cfg["SMTP_HOST"], int(cfg["SMTP_PORT"]), cfg["SENDER_EMAIL"], cfg["SENDER_PASSWORD"],
                to_email, cfg["EMAIL_SUBJECT"], html,
            )
            sent += 1
            print(f"[sent] {to_email}")
            if rate_limit > 0:
                time.sleep(rate_limit)
        except Exception as e:
            failed += 1
            print(f"[fail] {to_email}: {e}", file=sys.stderr)

    print(f"Done. Sent={sent}, Failed={failed}")


if __name__ == "__main__":
    main()


