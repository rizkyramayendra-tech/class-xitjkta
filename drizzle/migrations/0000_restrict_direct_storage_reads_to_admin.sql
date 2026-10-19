DROP POLICY IF EXISTS "public read published files" ON storage.objects;
DROP POLICY IF EXISTS "public read published media" ON storage.objects;
CREATE POLICY "admin read private portal assets" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id IN ('media', 'files')) AND (select auth.uid()) IS NOT NULL AND private.is_admin());
COMMENT ON POLICY "admin read private portal assets" ON storage.objects IS 'Direct storage reads are administrator-only. Visitors receive expiring signed URLs only after server-side exact published-reference authorization.';