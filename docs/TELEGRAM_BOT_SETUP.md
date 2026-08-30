# B2CSolution Telegram Bot — Setup Guide

## Overview

This Telegram bot runs as a **Supabase Edge Function** (no separate server required).
It uses **Gemini AI** for intelligent conversations and stores all data in your existing Supabase PostgreSQL database.

---

## Step 1: Create Your Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name: `B2CSolution Assistant`
4. Choose a username: `b2csolution_bot` (must end in `_bot`)
5. Copy your **Bot Token** — looks like: `7123456789:AAFxxx...`
6. Set bot commands (send `/setcommands` to BotFather):

```
start - Welcome message & main menu
help - List all commands
services - View all services
pricing - Pricing guide
portfolio - Our work
contact - Contact details
order - Start a new project
support - Talk to our team
status - Check your session status
faq - Frequently asked questions
```

7. (Optional) Set a description and profile photo:
   - `/setdescription` → "AI-powered business assistant for B2CSolution"
   - `/setuserpic` → upload your logo

---

## Step 2: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Copy the key (starts with `AIza...`)

---

## Step 3: Get Your Admin Telegram Chat ID

1. Open Telegram and message **@userinfobot**
2. It will reply with your user ID, e.g. `Your id: 123456789`
3. Copy that number

---

## Step 4: Run the Database Migration

In your Supabase Dashboard → SQL Editor, run the new migration:

```
supabase/migrations/20260718140000_telegram_bot_tables.sql
```

Or via CLI:
```bash
supabase db push
```

This creates: `telegram_users`, `telegram_conversations`, `telegram_messages`, `telegram_leads`, `bot_sessions`

---

## Step 5: Set Supabase Secrets

In Supabase Dashboard → **Edge Functions** → **Secrets**, add:

| Secret Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Your bot token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Any random string (e.g., generate with `openssl rand -hex 32`) |
| `GEMINI_API_KEY` | Your Google AI Studio API key |
| `ADMIN_TELEGRAM_CHAT_ID` | Your Telegram user ID |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are **auto-injected** by Supabase — you don't need to set these.

---

## Step 6: Deploy the Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rdkjlxukymmuclfzkoad

# Deploy the Telegram bot function
supabase functions deploy telegram-bot

# Also redeploy the updated chat function
supabase functions deploy chat
```

---

## Step 7: Set the Webhook

Replace `YOUR_BOT_TOKEN` and `YOUR_WEBHOOK_SECRET` with your actual values:

```bash
curl -X POST "https://api.telegram.org/bot{YOUR_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://rdkjlxukymmuclfzkoad.supabase.co/functions/v1/telegram-bot",
    "secret_token": "YOUR_WEBHOOK_SECRET",
    "allowed_updates": ["message", "callback_query"]
  }'
```

Expected response:
```json
{"ok": true, "result": true, "description": "Webhook was set"}
```

---

## Step 8: Test Your Bot

1. Open Telegram → search for your bot username
2. Send `/start` — you should see the welcome message with menu buttons
3. Tap **🌐 Website Development** — it should start the requirement flow
4. Complete the flow — check your Admin Dashboard → Telegram Bot tab for the lead
5. Check that you received an admin notification in Telegram

---

## Step 9: Update ChatBot.tsx

In `src/components/ChatBot.tsx`, update the bot URL:

```typescript
const TG_URL = 'https://t.me/YOUR_BOT_USERNAME'; // e.g., https://t.me/b2csolution_bot
```

---

## Verify Webhook Status

```bash
curl "https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getWebhookInfo"
```

---

## Troubleshoot

| Problem | Solution |
|---|---|
| Bot doesn't respond | Check Edge Function logs in Supabase Dashboard |
| Leads not saving | Verify `SUPABASE_SERVICE_ROLE_KEY` is set (auto-injected) |
| AI not responding | Check `GEMINI_API_KEY` is correct |
| No admin notifications | Verify `ADMIN_TELEGRAM_CHAT_ID` is your numeric ID |

---

## Architecture

```
Customer on Telegram
       │
       ▼
Telegram API (webhook)
       │
       ▼
Supabase Edge Function: telegram-bot
       │
       ├──► Gemini API (AI responses)
       ├──► Supabase DB (logs, leads, sessions)
       └──► Admin Telegram notification
```

---

## Future Expansions (Architecture Ready)

- **WhatsApp Integration**: Add a new edge function `whatsapp-bot/` with the same pattern
- **Multi-language**: Add language detection in `handleMessage()` and translate system prompt
- **Voice messages**: Handle `msg.voice` in the message handler
- **Invoice Generator**: Add a `/invoice` command that generates a PDF
- **Project Tracker**: Link `telegram_leads` to `orders` table with status updates
