-- =====================================================
-- B2CSolution Telegram Bot Tables
-- Migration: 20260718140000_telegram_bot_tables
-- =====================================================

-- 1. Telegram Users
-- Stores every unique Telegram user who interacts with the bot
CREATE TABLE public.telegram_users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id      BIGINT NOT NULL UNIQUE,          -- Telegram's own user ID
  username         TEXT,                             -- @handle (may be null)
  first_name       TEXT NOT NULL DEFAULT '',
  last_name        TEXT,
  language_code    TEXT DEFAULT 'en',
  is_blocked       BOOLEAN NOT NULL DEFAULT false,   -- block spam users
  message_count    INT NOT NULL DEFAULT 0,
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read telegram users"
  ON public.telegram_users FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage telegram users"
  ON public.telegram_users FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 2. Telegram Conversations
-- One row per bot session (a user can have multiple over time)
CREATE TABLE public.telegram_conversations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active','handed_off','closed')),
  service_interest TEXT,                             -- which service they asked about
  current_step     TEXT DEFAULT 'idle',              -- state machine step
  collected_data   JSONB NOT NULL DEFAULT '{}',      -- answers gathered so far
  message_count    INT NOT NULL DEFAULT 0,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  handed_off_at    TIMESTAMPTZ
);

ALTER TABLE public.telegram_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read telegram conversations"
  ON public.telegram_conversations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update telegram conversations"
  ON public.telegram_conversations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage telegram conversations"
  ON public.telegram_conversations FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_telegram_conversation_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_telegram_conversations_updated_at
  BEFORE UPDATE ON public.telegram_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_telegram_conversation_timestamp();

-- 3. Telegram Messages
-- Full message history for every bot conversation
CREATE TABLE public.telegram_messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES public.telegram_conversations(id) ON DELETE CASCADE,
  telegram_user_id BIGINT NOT NULL,
  role             TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content          TEXT NOT NULL,
  message_type     TEXT NOT NULL DEFAULT 'text'
                     CHECK (message_type IN ('text','photo','document','command','callback')),
  telegram_msg_id  BIGINT,                           -- Telegram's own message_id
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read telegram messages"
  ON public.telegram_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage telegram messages"
  ON public.telegram_messages FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Index for fast conversation history lookup
CREATE INDEX idx_telegram_messages_conversation ON public.telegram_messages(conversation_id, created_at);
CREATE INDEX idx_telegram_messages_user ON public.telegram_messages(telegram_user_id, created_at);

-- 4. Telegram Leads
-- Structured sales leads captured through the bot's requirement-gathering flow
CREATE TABLE public.telegram_leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  conversation_id  UUID REFERENCES public.telegram_conversations(id),
  -- Contact info (collected by bot)
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_email   TEXT,
  -- Project details
  service          TEXT NOT NULL,                    -- e.g. 'website', 'mobile_app', 'ai_chatbot'
  service_subtype  TEXT,                             -- e.g. 'ecommerce', 'portfolio'
  budget_range     TEXT,                             -- e.g. '₹5,000 - ₹15,000'
  deadline         TEXT,
  has_design       BOOLEAN,
  needs_hosting    BOOLEAN,
  requirements     JSONB NOT NULL DEFAULT '{}',      -- all collected answers
  notes            TEXT,
  -- Admin tracking
  status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new','contacted','quoted','converted','lost')),
  assigned_to      TEXT,                             -- admin name
  admin_notes      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read telegram leads"
  ON public.telegram_leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update telegram leads"
  ON public.telegram_leads FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage telegram leads"
  ON public.telegram_leads FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_telegram_lead_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_telegram_leads_updated_at
  BEFORE UPDATE ON public.telegram_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_telegram_lead_timestamp();

-- 5. Bot Sessions (State Machine)
-- Tracks the current conversation state for each user (one active session at a time)
CREATE TABLE public.bot_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL UNIQUE,           -- one active session per user
  conversation_id  UUID REFERENCES public.telegram_conversations(id),
  current_step     TEXT NOT NULL DEFAULT 'idle',
  step_data        JSONB NOT NULL DEFAULT '{}',      -- partial answers, current flow
  message_count    INT NOT NULL DEFAULT 0,
  last_activity    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage bot sessions"
  ON public.bot_sessions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Index for frequent session lookups
CREATE INDEX idx_bot_sessions_user ON public.bot_sessions(telegram_user_id);
CREATE INDEX idx_bot_sessions_last_activity ON public.bot_sessions(last_activity);

-- =====================================================
-- Helper view for Admin Dashboard
-- =====================================================
CREATE OR REPLACE VIEW public.telegram_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.telegram_users)                                          AS total_users,
  (SELECT COUNT(*) FROM public.telegram_conversations WHERE status = 'active')          AS active_conversations,
  (SELECT COUNT(*) FROM public.telegram_leads WHERE status = 'new')                     AS new_leads,
  (SELECT COUNT(*) FROM public.telegram_conversations WHERE status = 'handed_off')      AS handoffs,
  (SELECT COUNT(*) FROM public.telegram_users WHERE last_seen > now() - interval '24h') AS users_today,
  (SELECT COUNT(*) FROM public.telegram_leads WHERE created_at > now() - interval '7d') AS leads_this_week;

-- Grant read access to authenticated (admins) via RLS on underlying tables
GRANT SELECT ON public.telegram_dashboard_stats TO authenticated;
