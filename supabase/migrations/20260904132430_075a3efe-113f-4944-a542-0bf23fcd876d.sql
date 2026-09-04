ALTER TABLE public.admin_config ADD COLUMN pending_email text;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_config c
    WHERE lower(coalesce(auth.jwt() ->> 'email', '')) <> ''
      AND lower(coalesce(auth.jwt() ->> 'email', '')) IN (lower(c.admin_email), lower(coalesce(c.pending_email, '')))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;