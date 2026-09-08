DROP POLICY IF EXISTS "public read media" ON storage.objects;

CREATE POLICY "public read published media"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'media'
  AND (
    private.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.students s
      WHERE s.status = 'published'
        AND s.photo_url = 'media/' || storage.objects.name
    )
    OR EXISTS (
      SELECT 1
      FROM public.announcements a
      WHERE a.status = 'published'
        AND a.image_url = 'media/' || storage.objects.name
    )
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.status = 'published'
        AND e.image_url = 'media/' || storage.objects.name
    )
    OR EXISTS (
      SELECT 1
      FROM public.achievements a
      WHERE a.status = 'published'
        AND a.image_url = 'media/' || storage.objects.name
    )
    OR EXISTS (
      SELECT 1
      FROM public.gallery g
      WHERE g.status = 'published'
        AND g.image_url = 'media/' || storage.objects.name
    )
    OR EXISTS (
      SELECT 1
      FROM public.site_content sc
      CROSS JOIN LATERAL jsonb_each_text(sc.data) field
      WHERE field.value = 'media/' || storage.objects.name
    )
  )
);

CREATE POLICY "public read published files"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'files'
  AND (
    private.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.resources r
      WHERE r.status = 'published'
        AND r.file_url = 'files/' || storage.objects.name
    )
  )
);