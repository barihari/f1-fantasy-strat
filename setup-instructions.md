# Setup Instructions

Everything you need to do before deploying the F1 Fantasy SMS + Chatbot system.

## 1. Anthropic Claude API Key

**Where:** https://console.anthropic.com

1. Sign up or log in with your personal email
2. Go to **Settings > Billing** and add your card
3. Go to **Settings > Limits** and set the monthly spending limit to **$5**
4. Go to **Settings > API Keys** and click **Create Key**
5. Copy the key (starts with `sk-ant-...`) — you only see it once
6. Save it somewhere safe temporarily (you'll add it to Vercel + GitHub later)

## 2. GitHub Personal Access Token

**Where:** https://github.com/settings/tokens

1. Click **Generate new token (classic)**
2. Name it `f1-fantasy-bot`
3. Set expiration to **Dec 2026**
4. Check the `repo` scope (full control of private repositories)
5. Click **Generate token**
6. Copy the token (starts with `ghp_...`) — you only see it once

## 3. Gmail App Password

**Prerequisite:** 2-Step Verification must be enabled on your Google account.
If it's not, go to https://myaccount.google.com/security and turn it on first.

**Where:** https://myaccount.google.com/apppasswords

1. Enter a name like `f1-fantasy-reminder`
2. Click **Create**
3. Copy the 16-character password it gives you
4. This is NOT your Gmail password — it can only send email

## 4. Vercel Account

**Where:** https://vercel.com

1. Sign up with your **GitHub account** (connects them automatically)
2. That's it for now — deployment happens later

## Adding Secrets

Once you have all 4 items above, add them to two places:

### Vercel Environment Variables

Go to your Vercel project > Settings > Environment Variables and add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your `sk-ant-...` key |
| `GITHUB_TOKEN` | Your `ghp_...` token |
| `GMAIL_ADDRESS` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | The 16-char app password |
| `PHONE_NUMBER` | Your Verizon number (digits only, e.g. `5551234567`) |
| `CARRIER_GATEWAY` | `vtext.com` |
| `TIMEZONE` | `America/New_York` |
| `GITHUB_OWNER` | Your GitHub username |
| `GITHUB_REPO` | `f1-fantasy-strat` |
| `CRON_SECRET` | Any random string (protects API routes from unauthorized calls) |

### GitHub Repository Secrets

Go to your repo on GitHub > Settings > Secrets and variables > Actions and add:

| Name | Value |
|------|-------|
| `VERCEL_APP_URL` | Your Vercel app URL (e.g. `https://f1-fantasy-strat.vercel.app`) |
| `CRON_SECRET` | Same random string you used in Vercel |

## Testing the 3 Workflow Buttons

After deployment, go to your repo on GitHub > **Actions** tab. You'll see 3 workflows:

1. **Tuesday Reminder** — sends the early-week briefing SMS
2. **Friday Update** — sends the pre-lock update SMS (if changes exist)
3. **Safety Net** — sends the 2-hour nag SMS (if not locked in)

To test any workflow:
1. Click the workflow name
2. Click **Run workflow** (dropdown on the right)
3. Select the branch (`main`)
4. Click the green **Run workflow** button
5. Check your phone for the SMS

### Australia Dry Run

To test the full flow with Race 1 Australia:
1. Trigger **Tuesday Reminder** — verify you receive the SMS with brief + chat links
2. Open the brief link — verify the race brief page loads with the Australia recommendation
3. Open the chat link — verify the chatbot responds to messages
4. Type "locked in" in the chatbot — verify it asks for a screenshot
5. Upload a screenshot — verify it analyzes and shows green confirmation
6. Trigger **Safety Net** — verify it does NOT send a nag (since you already locked in)
7. Check GitHub — verify `season/team-state.md` and `season/decision-log.md` were updated
