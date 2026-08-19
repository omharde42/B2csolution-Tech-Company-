CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- FAQ knowledge base
CREATE TABLE public.faq_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_entries TO anon, authenticated;
GRANT ALL ON public.faq_entries TO service_role;
ALTER TABLE public.faq_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQ is publicly readable" ON public.faq_entries FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage FAQ" ON public.faq_entries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Chat analytics
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key TEXT NOT NULL UNIQUE,
  user_id UUID,
  message_count INT NOT NULL DEFAULT 0,
  last_intent TEXT,
  last_stage TEXT NOT NULL DEFAULT 'greeting',
  handed_off BOOLEAN NOT NULL DEFAULT false,
  converted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own chat sessions" ON public.chat_sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  intent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_logs_session ON public.chat_logs(session_id);
GRANT SELECT ON public.chat_logs TO authenticated;
GRANT ALL ON public.chat_logs TO service_role;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own chat logs" ON public.chat_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_no TEXT NOT NULL UNIQUE DEFAULT ('TKT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'open',
  order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own tickets" ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own tickets" ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own tickets" ON public.support_tickets FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID,
  author_role TEXT NOT NULL DEFAULT 'user',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read messages of own tickets" ON public.ticket_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users add messages to own tickets" ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE TRIGGER update_faq_entries_updated_at BEFORE UPDATE ON public.faq_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.faq_entries (question, answer, category, sort_order) VALUES
('How long does it take to get my website?','Most websites are ready within 2-3 days. Simple one-page sites can be delivered within 24 hours. Larger projects take 1-3 weeks depending on scope.','delivery',1),
('How many revisions do I get?','Unlimited revisions until you are happy with the design. We keep refining until it looks exactly right.','process',2),
('Will WhatsApp be integrated on my website?','Yes. Every Business and Advanced package includes a WhatsApp chat button so visitors can message you directly.','features',3),
('How do I pay?','We accept UPI (Google Pay, PhonePe, Paytm, FamPay) at omharde300@oksbi or 9882303030@fam. Half payment to start, half on delivery. No extra charges.','payment',4),
('What do you need from me to start?','Just your business name, a few photos, and what you want to say. We handle everything else.','process',5),
('What if I do not like the design?','We revise it for free until you love it. If you change your mind before work starts, we offer a full refund.','policy',6),
('How much does an AI website cost?','Our AI-powered website starts at Rs 5,500. Basic websites start at Rs 3,000 and business websites at Rs 5,000.','pricing',7),
('How do I track my order?','Logged-in users can see all orders at /dashboard. Guests can track using their order ID at /order-tracking/ORDER_ID.','support',8);