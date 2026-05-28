-- 1. Explicit RLS: only admins may INSERT into user_roles (UPDATE remains blocked entirely)
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Defense-in-depth trigger: enforce role-assignment rules at the DB level,
--    independent of RLS. Allows:
--      a) the SECURITY DEFINER signup trigger (no auth.uid()) to assign the default 'user' role
--      b) existing admins to assign/modify any role
--    Blocks everything else, including self-elevation attempts.
CREATE OR REPLACE FUNCTION public.enforce_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
BEGIN
  -- Allow internal/system inserts (e.g. handle_new_user trigger) where there's no auth context
  IF caller IS NULL THEN
    IF TG_OP = 'INSERT' AND NEW.role = 'user'::app_role THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'System role assignment only permitted for default user role';
  END IF;

  -- Authenticated callers must be admins to assign any role
  IF NOT public.has_role(caller, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can assign or modify roles';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_role_assignment_trigger ON public.user_roles;
CREATE TRIGGER enforce_role_assignment_trigger
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_role_assignment();