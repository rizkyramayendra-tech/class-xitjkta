CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_config c
    WHERE lower(coalesce(auth.jwt() ->> 'email', '')) <> ''
      AND lower(coalesce(auth.jwt() ->> 'email', '')) = lower(c.admin_email)
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;

-- Public-facing wrapper is no longer SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.is_admin();
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Public reads limited to published rows
DROP POLICY IF EXISTS "public read achievements" ON public.achievements;
CREATE POLICY "public read achievements" ON public.achievements FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read announcements" ON public.announcements;
CREATE POLICY "public read announcements" ON public.announcements FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read duty_roster" ON public.duty_roster;
CREATE POLICY "public read duty_roster" ON public.duty_roster FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read events" ON public.events;
CREATE POLICY "public read events" ON public.events FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read gallery" ON public.gallery;
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read resources" ON public.resources;
CREATE POLICY "public read resources" ON public.resources FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read schedules" ON public.schedules;
CREATE POLICY "public read schedules" ON public.schedules FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "public read students" ON public.students;
CREATE POLICY "public read students" ON public.students FOR SELECT USING (status = 'published');