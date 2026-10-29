# WhatsApp lead alerts — setup

Lead capture works without this. Alerts are an add-on: when they are not
configured, leads are still stored and visible at `/admin`, and the server just
logs that it skipped the notification.

Alerts go out through the **Meta WhatsApp Cloud API**. WhatsApp requires an
approved template for any message a business sends first, so there is a one-time
approval step before alerts can work.

---

## 1. Create a Meta app and get a WhatsApp number

1. Go to <https://developers.facebook.com/apps> and create an app of type
   **Business**.
2. Add the **WhatsApp** product to it.
3. Open **WhatsApp → API Setup**. You get:
   - a **test number** that works immediately, but only sends to up to 5
     recipient numbers you verify by OTP
   - a **Phone number ID** — this is `WHATSAPP_PHONE_NUMBER_ID`
   - a **temporary access token**, valid 24 hours
4. For production, add your own business number under **WhatsApp → Phone
   numbers** and complete Meta Business verification.

### Get a token that does not expire

The 24-hour token is only good for testing. For a permanent one:

1. <https://business.facebook.com/settings/system-users> → create a System User
   with the **Admin** role.
2. **Add Assets** → your app → enable **Manage app**.
3. **Generate New Token** → select your app → tick `whatsapp_business_messaging`
   and `whatsapp_business_management` → choose **Never expires**.
4. That value is `WHATSAPP_ACCESS_TOKEN`.

---

## 2. Create the message template

In **WhatsApp Manager → Account tools → Message templates → Create template**:

| Field | Value |
|---|---|
| Name | `new_lead_alert` |
| Category | **Utility** |
| Language | English (`en`) |

Paste this exactly as the **Body**, with no header, footer or buttons:

```
{{1}} lead from the Digital Dude website.

Name: {{2}}
Contact: {{3}}
Interested in: {{4}}
Details: {{5}}
```

Sample values for the approval form (Meta requires examples):

| Variable | Sample |
|---|---|
| `{{1}}` | `HOT` |
| `{{2}}` | `Ravi Kumar` |
| `{{3}}` | `+91 9876543210` |
| `{{4}}` | `Website & Web App Development` |
| `{{5}}` | `Runs a bakery, budget 75,000, timeline ASAP` |

**The five variables must stay in this order** — the server fills them positionally
from `buildParams()` in [api/_lib/whatsapp.ts](api/_lib/whatsapp.ts). If you reorder
the template, reorder that function to match.

Approval is usually under an hour for Utility templates.

> Template parameters cannot contain newlines, tabs, or four or more consecutive
> spaces — Meta rejects the whole message if they do. The server already strips
> these, which is why the line breaks live in the template rather than in a value.

---

## 3. Set the environment variables

In **Vercel → Project Settings → Environment Variables** (Production), then
redeploy:

```
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_ALERT_TO=919787097006,918939651525
```

`WHATSAPP_ALERT_TO` is comma separated, with country code and no `+` or spaces.
Every number listed gets every alert.

Optional:

| Variable | Default | What it does |
|---|---|---|
| `WHATSAPP_TEMPLATE_NAME` | `new_lead_alert` | Template to send |
| `WHATSAPP_TEMPLATE_LANG` | `en` | Template language code |
| `WHATSAPP_ALERT_MIN_TEMPERATURE` | `warm` | Minimum lead temperature that triggers an alert — `hot` for fewer, higher-intent alerts |
| `WHATSAPP_API_VERSION` | `v21.0` | Graph API version |
| `WHATSAPP_USE_TEXT` | `false` | Send plain text instead of a template. Only delivers inside the 24-hour customer-service window, so leave it off for lead alerts |

---

## 4. Verify

Open `/admin` → **Settings**. The WhatsApp row shows **READY** once all three
required variables are set. Click **Send test alert** — a sample notification
goes to every configured number.

If it fails, the error from Meta is shown in full. The usual causes:

| Error | Cause |
|---|---|
| `template name does not exist` | Template not approved yet, or the name/language does not match |
| `(#131030) recipient not in allowed list` | Using the test number — add the recipient under **API Setup → To** |
| `(#190) access token expired` | Still using the 24-hour token; create a System User token |
| `(#132000) number of parameters mismatch` | Template body does not have exactly 5 variables |

---

## When alerts fire

- Only for a **newly created** lead, never on later updates — so one lead means
  one alert, no matter how long the conversation runs.
- Only if the lead's temperature is at or above `WHATSAPP_ALERT_MIN_TEMPERATURE`.
- Only if the lead has a **phone or email**. A lead with no contact details
  cannot be acted on, so alerting would be noise; it is still recorded and
  visible in the dashboard.
- If the database write fails, the alert is sent anyway, so an enquiry is never
  lost to an outage.

Every attempt is recorded in the `notification_log` table, successes and
failures alike.
