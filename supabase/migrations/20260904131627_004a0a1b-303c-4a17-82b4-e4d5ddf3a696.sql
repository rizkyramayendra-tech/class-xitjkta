
-- helpers
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.admin_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  admin_email text NOT NULL,
  setup_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.admin_config (id, admin_email) VALUES (true, 'rizkyramayendra@gmail.com');
GRANT SELECT, UPDATE ON public.admin_config TO authenticated;
GRANT ALL ON public.admin_config TO service_role;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_config c
    WHERE lower(c.admin_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

CREATE POLICY "admin reads config" ON public.admin_config FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin updates config" ON public.admin_config FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- content tables
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  nickname text,
  nis text,
  gender text,
  photo_url text,
  info text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  start_time text,
  end_time text,
  subject text NOT NULL,
  teacher text,
  room text,
  order_no integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'tugas',
  title text NOT NULL,
  subject text,
  description text,
  date date,
  due_date date,
  file_url text,
  link_url text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  date date NOT NULL DEFAULT current_date,
  image_url text,
  pinned boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL DEFAULT current_date,
  time text,
  location text,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.duty_roster (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  member_name text NOT NULL,
  order_no integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  year text,
  category text,
  participants text,
  image_url text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  caption text,
  category text,
  image_url text NOT NULL,
  date date DEFAULT current_date,
  order_no integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email text,
  action text NOT NULL,
  entity text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_order ON public.students(order_no);
CREATE INDEX idx_schedules_day ON public.schedules(day, order_no);
CREATE INDEX idx_resources_type ON public.resources(type, date DESC);
CREATE INDEX idx_announcements_date ON public.announcements(pinned DESC, date DESC);
CREATE INDEX idx_events_date ON public.events(date DESC);
CREATE INDEX idx_duty_day ON public.duty_roster(day, order_no);
CREATE INDEX idx_gallery_order ON public.gallery(order_no, created_at DESC);
CREATE INDEX idx_logs_created ON public.activity_logs(created_at DESC);

-- grants + rls for public content tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['students','schedules','resources','announcements','events','duty_roster','achievements','gallery','site_content']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "admin manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;

GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin reads logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin writes logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- seed students (34)
INSERT INTO public.students (order_no, name) VALUES
(1,'Aurel D.'),(2,'Bella'),(3,'Merisa'),(4,'Aurel S.'),(5,'Dafa'),(6,'Andika'),(7,'Falal'),
(8,'Essel'),(9,'Maria'),(10,'Nadira'),(11,'Anisa'),(12,'Yovan'),(13,'Roja'),(14,'Viozi'),
(15,'Akis'),(16,'Pita'),(17,'Reiha'),(18,'Fendri'),(19,'Amri'),(20,'Bagas'),(21,'Zahari'),
(22,'Rahmi'),(23,'Alisa'),(24,'Enjel'),(25,'Rizky'),(26,'Rata'),(27,'Chia'),(28,'Fahrizal'),
(29,'Aura'),(30,'Zahara'),(31,'Rahel'),(32,'Oliv'),(33,'Andes'),(34,'Putra');

-- seed duty roster
INSERT INTO public.duty_roster (day, order_no, member_name) VALUES
('Senin',1,'Aurel D.'),('Senin',2,'Bella'),('Senin',3,'Merisa'),('Senin',4,'Aurel S.'),('Senin',5,'Dafa'),('Senin',6,'Andika'),('Senin',7,'Falal'),
('Selasa',1,'Essel'),('Selasa',2,'Maria'),('Selasa',3,'Nadira'),('Selasa',4,'Anisa'),('Selasa',5,'Yovan'),('Selasa',6,'Roja'),('Selasa',7,'Viozi'),
('Rabu',1,'Akis'),('Rabu',2,'Pita'),('Rabu',3,'Reiha'),('Rabu',4,'Fendri'),('Rabu',5,'Amri'),('Rabu',6,'Bagas'),('Rabu',7,'Zahari'),
('Kamis',1,'Rahmi'),('Kamis',2,'Alisa'),('Kamis',3,'Enjel'),('Kamis',4,'Rizky'),('Kamis',5,'Rata'),('Kamis',6,'Chia'),('Kamis',7,'Fahrizal'),
('Jumat',1,'Aura'),('Jumat',2,'Zahara'),('Jumat',3,'Rahel'),('Jumat',4,'Oliv'),('Jumat',5,'Andes'),('Jumat',6,'Putra');

-- seed site content
INSERT INTO public.site_content (key, data) VALUES
('site', '{"site_title":"XI TJKT A — SMKN 1 Gunung Talang","hero_title":"XI TJKT A","hero_subtitle":"Teknik Jaringan Komputer dan Telekomunikasi","hero_school":"SMKN 1 Gunung Talang","hero_year":"Tahun Pembelajaran 2026–2027","hero_description":"Portal resmi kelas XI TJKT A. Pusat informasi jadwal, tugas, materi, agenda, prestasi, dan dokumentasi kegiatan kelas.","hero_image_url":"","logo_url":"","favicon_url":"","accent":"cyan","footer_text":"XI TJKT A\nSMKN 1 Gunung Talang\nTeknik Jaringan Komputer dan Telekomunikasi\nTahun Pembelajaran 2026–2027","footer_note":"© 2026 XI TJKT A. Seluruh hak cipta."}'::jsonb),
('class_profile', '{"class_name":"XI TJKT A","major":"Teknik Jaringan Komputer dan Telekomunikasi","school":"SMKN 1 Gunung Talang","year":"2026–2027","student_count":"34","homeroom":"Riko Syahputra, S.Kom.","about":"XI TJKT A adalah kelas jurusan Teknik Jaringan Komputer dan Telekomunikasi di SMKN 1 Gunung Talang yang berfokus pada penguasaan jaringan komputer, sistem administrasi server, dan teknologi telekomunikasi.","vision":"Menjadi kelas yang unggul, kolaboratif, dan berkarakter di bidang teknologi jaringan komputer dan telekomunikasi.","mission":"Membiasakan disiplin dan tanggung jawab.\nMeningkatkan kompetensi praktik jaringan dan telekomunikasi.\nMembangun kerja sama dan solidaritas antar anggota kelas.\nMenjaga kebersihan dan kenyamanan lingkungan belajar.","motto":"Belajar, Berkarya, Terhubung.","goals":"Mencetak siswa yang siap kerja dan siap melanjutkan pendidikan di bidang TJKT.","image_url":""}'::jsonb),
('teacher', '{"name":"Riko Syahputra, S.Kom.","position":"Wali Kelas XI TJKT A","photo_url":"","description":"Wali kelas XI TJKT A yang membimbing dan mendampingi siswa dalam kegiatan akademik maupun pengembangan karakter.","message":"Teruslah belajar dengan sungguh-sungguh, jaga kekompakan, dan jadilah pribadi yang bertanggung jawab."}'::jsonb),
('school_info', '{"name":"SMKN 1 Gunung Talang","address":"Kabupaten Solok, Sumatera Barat","description":"SMK Negeri 1 Gunung Talang adalah sekolah menengah kejuruan negeri di Kabupaten Solok, Sumatera Barat, dengan beberapa program keahlian termasuk Teknik Jaringan Komputer dan Telekomunikasi.","majors":"Teknik Jaringan Komputer dan Telekomunikasi\nProgram keahlian lainnya","phone":"-","email":"-","website":"-","instagram":"-","facebook":"-","youtube":"-","logo_url":"","photo_url":""}'::jsonb),
('contact', '{"address":"SMKN 1 Gunung Talang, Kabupaten Solok, Sumatera Barat","email":"-","phone":"-","whatsapp":"-","instagram":"-","website":"-","map_embed":"https://www.google.com/maps?q=SMKN%201%20Gunung%20Talang&output=embed","note":"Hubungi wali kelas atau pengurus kelas untuk informasi lebih lanjut."}'::jsonb);
