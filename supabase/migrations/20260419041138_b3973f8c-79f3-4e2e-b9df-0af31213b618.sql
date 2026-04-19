
-- 1. Make payment-screenshots bucket private
UPDATE storage.buckets SET public = false WHERE id = 'payment-screenshots';

-- 2. Replace storage policies with strict owner-folder enforcement
DROP POLICY IF EXISTS "Users can read own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all payment screenshots" ON storage.objects;

CREATE POLICY "Users read own payment screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-screenshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users upload own payment screenshots"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins read all payment screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-screenshots'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Tighten contacts INSERT policy: enforce field length limits at DB layer
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;

CREATE POLICY "Anyone can insert validated contacts"
ON public.contacts FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(coalesce(phone, '')) <= 20
  AND length(issue) BETWEEN 1 AND 100
  AND length(coalesce(message, '')) <= 2000
);

-- 4. Tighten page_views INSERT policy: enforce sane length limits
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;

CREATE POLICY "Anyone can insert validated page views"
ON public.page_views FOR INSERT TO anon, authenticated
WITH CHECK (
  length(page) BETWEEN 1 AND 200
  AND page ~ '^/'
  AND length(coalesce(visitor_id, '')) <= 64
);

-- 5. Add DELETE policy on user_roles for admins
CREATE POLICY "Admins can delete user roles"
ON public.user_roles FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
