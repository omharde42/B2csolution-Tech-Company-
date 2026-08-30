ALTER TABLE public.news_posts ADD COLUMN IF NOT EXISTS cover_image_url text;

ALTER TABLE public.user_roles DISABLE TRIGGER USER;
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'omharde300@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
ALTER TABLE public.user_roles ENABLE TRIGGER USER;