CREATE TABLE public.news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  badge text NOT NULL DEFAULT 'Update',
  date_label text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.news_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
GRANT ALL ON public.news_posts TO service_role;

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
ON public.news_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all news"
ON public.news_posts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert news"
ON public.news_posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
ON public.news_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
ON public.news_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_news_posts_updated_at
BEFORE UPDATE ON public.news_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.news_posts (slug, title, badge, date_label, excerpt, content, published, sort_order) VALUES
('ai-powered-development-services','AI-Powered Development Services','New','April 2026','We now offer AI tool development including chatbots, recommendation engines, and intelligent automation for businesses of all sizes.',
'B2C Solution is expanding beyond websites into full AI-powered development. Small businesses can now get custom AI tools built for their exact workflow — without enterprise pricing.

Our AI services include customer-support chatbots trained on your business FAQs, recommendation engines for ecommerce stores, and intelligent automation that handles repetitive tasks like invoicing, follow-ups, and lead capture.

Every AI project ships with a simple dashboard so you can see what the bot is doing, review conversations, and update answers yourself — no coding required.

Pricing starts at ₹5,500 for an AI Website with a built-in chatbot. Custom AI tools are quoted based on scope. Message us on WhatsApp to discuss your idea.', true, 100),
('expanded-ecommerce-solutions','Expanded Ecommerce Solutions','Update','March 2026','Full-stack ecommerce development with Shopify, custom platforms, payment gateways, and inventory management systems.',
'We have expanded our ecommerce offering to cover the complete journey — from your first product listing to automated order tracking.

What is included: Shopify and custom storefront development, UPI and Razorpay payment gateway integration, inventory and stock management, automated order confirmation on WhatsApp, and sales analytics dashboards.

Every store we build is mobile-first, loads fast, and is optimized for conversions — clear product pages, simple checkout, and trust signals that turn visitors into buyers.

Already have a store? We also take on improvement projects: speed optimization, checkout fixes, and design refreshes. Contact us on WhatsApp for a free audit.', true, 90);