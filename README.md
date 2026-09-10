# TJKT Portal Pro

BUILD A COMPLETE PRODUCTION-READY CLASS WEBSITE FOR XI TJKT A — SMKN 1 GUNUNG TALANG

IMPORTANT:
Do not create only a static mockup or visual prototype.
Build the actual functional website with frontend, backend, database, authentication, storage, admin dashboard, security rules, CRUD functionality, and responsive design.

==================================================
PROJECT INFORMATION
==================================================

Class:
XI TJKT A

School:
SMKN 1 Gunung Talang

Department:
Teknik Jaringan Komputer dan Telekomunikasi (TJKT)

Academic Year:
2026–2027

Number of Students:
34

Homeroom Teacher:
Riko Syahputra, S.Kom.

The entire PUBLIC WEBSITE must use 100% Bahasa Indonesia.

==================================================
MAIN TECHNOLOGY REQUIREMENTS
==================================================

Use a modern web stack supported by Lovable.

Use Supabase as the backend whenever possible:

- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Storage
- Supabase Row Level Security (RLS)

Use only free-tier services whenever reasonably possible.

DO NOT introduce:
- Paid APIs
- Paid authentication providers
- Paid AI APIs
- Paid storage services
- Paid third-party services

unless absolutely necessary and clearly explained before implementation.

The website must be designed so that a small class website with 34 students and one administrator can operate within free-tier limits whenever possible.

==================================================
CRITICAL ADMIN REQUIREMENT
==================================================

There must be EXACTLY ONE ADMINISTRATOR ACCOUNT.

There must NOT be:
- Student accounts
- Teacher accounts
- Public registration
- Public account creation
- Multiple admin accounts
- Student login
- Teacher login

Only the authorized administrator can access the Admin Dashboard.

Initial admin email:

rizkyramayendra@gmail.com

IMPORTANT SECURITY RULE:

DO NOT hardcode or expose the admin password anywhere in:
- HTML
- CSS
- JavaScript
- React source code
- frontend environment variables
- public files
- Git repository
- database seed data

Use Supabase Auth for secure password management.

The admin password must be set securely through authentication, not stored as plaintext.

==================================================
PUBLIC WEBSITE
==================================================

Create a beautiful, modern, professional class portal.

Navigation:

1. Beranda
2. Profil Kelas
3. Data Siswa
4. Wali Kelas
5. Jadwal Pelajaran
6. Tugas & Materi
7. Pengumuman
8. Agenda
9. Jadwal Piket
10. Prestasi
11. Galeri
12. Informasi Sekolah
13. Kontak

Create a responsive navigation system.

Desktop:
- Professional navigation bar

Mobile:
- Hamburger menu

==================================================
DESIGN
==================================================

Design style:

- Modern
- Clean
- Professional
- Elegant
- Technology-themed
- Educational
- Minimal but attractive
- Responsive
- Mobile-first

Use subtle visual elements inspired by:
- Computer networks
- Servers
- Technology
- Digital connectivity
- Coding
- TJKT

Do not make the design childish.

Do not overuse:
- Gradients
- Animations
- Shadows
- Decorative elements

Use smooth micro-interactions and subtle animations.

==================================================
BERANDA
==================================================

Create a modern hero section.

Display:

XI TJKT A

Teknik Jaringan Komputer dan Telekomunikasi

SMKN 1 Gunung Talang

Tahun Pembelajaran 2026–2027

Add:
- Hero image
- Class description
- Button "Lihat Profil Kelas"
- Button "Lihat Data Siswa"

Create statistics:

34
Siswa

1
Wali Kelas

2026–2027
Tahun Pembelajaran

TJKT
Jurusan

Also display:
- Pengumuman terbaru
- Agenda terdekat
- Tugas terbaru
- Materi terbaru
- Prestasi terbaru
- Galeri terbaru

==================================================
PROFIL KELAS
==================================================

Display:

Nama Kelas:
XI TJKT A

Jurusan:
Teknik Jaringan Komputer dan Telekomunikasi

Sekolah:
SMKN 1 Gunung Talang

Tahun Pembelajaran:
2026–2027

Jumlah Siswa:
34

Wali Kelas:
Riko Syahputra, S.Kom.

Also create editable sections:
- Tentang kelas
- Visi
- Misi
- Motto
- Tujuan

ALL CONTENT MUST BE EDITABLE BY ADMIN.

==================================================
DATA SISWA
==================================================

Create a professional student directory.

There are 34 students.

Each student should support:
- Nama
- Foto
- Nomor urut
- Informasi tambahan

Features:
- Search
- Filter
- Sorting
- Detail siswa

Admin can:
- Add student
- Edit student
- Delete student
- Change student photo
- Change student name
- Edit information
- Change order

Do NOT hardcode student records in frontend code.

Store student records in Supabase.

==================================================
WALI KELAS
==================================================

Create a dedicated Wali Kelas section.

Initial data:

Riko Syahputra, S.Kom.

Include:
- Photo
- Name
- Position
- Description
- Message for students

Admin can edit everything.

==================================================
JADWAL PELAJARAN
==================================================

Create a professional weekly schedule.

Subjects:

1. TJKN
2. Sejarah
3. KJ
4. Bahasa Inggris
5. PPJ
6. MK
7. PAI
8. Bahasa Indonesia
9. PIL
10. PKN
11. PKK
12. ASJ
13. PKPJ
14. PJOK
15. Matematika
16. Gr.W
17. Ekskul

The exact schedule must be editable.

Admin can:
- Add schedule
- Edit schedule
- Delete schedule
- Change subject
- Change day
- Change time
- Change teacher
- Change room

==================================================
TUGAS & MATERI
==================================================

Create a learning resource system.

Support:
- Tugas
- Materi
- Modul
- File pembelajaran
- External links

Each item can contain:
- Judul
- Mata pelajaran
- Deskripsi
- Tanggal
- Tenggat waktu
- File
- Link
- Status

Admin has full CRUD access.

Use Supabase Storage for uploaded files when appropriate.

==================================================
PENGUMUMAN
==================================================

Create an announcement system.

Each announcement:
- Judul
- Isi
- Tanggal
- Foto/banner
- Status penting

Features:
- Add
- Edit
- Delete
- Pin important announcement
- Change image

==================================================
AGENDA
==================================================

Create an agenda/event system.

Each event:
- Nama kegiatan
- Tanggal
- Waktu
- Lokasi
- Deskripsi
- Foto
- Status

Admin has full CRUD access.

==================================================
JADWAL PIKET
==================================================

Use these names EXACTLY as written.

SENIN:
1. Aurel D.
2. Bella
3. Merisa
4. Aurel S.
5. Dafa
6. Andika
7. Falal

SELASA:
1. Essel
2. Maria
3. Nadira
4. Anisa
5. Yovan
6. Roja
7. Viozi

RABU:
1. Akis
2. Pita
3. Reiha
4. Fendri
5. Amri
6. Bagas
7. Zahari

KAMIS:
1. Rahmi
2. Alisa
3. Enjel
4. Rizky
5. Rata
6. Chia
7. Fahrizal

JUMAT:
1. Aura
2. Zahara
3. Rahel
4. Oliv
5. Andes
6. Putra

IMPORTANT:
Keep these names exactly as written.
Do not automatically replace nicknames with full names.

Admin can:
- Add member
- Delete member
- Edit member
- Change order
- Move member between days

==================================================
PRESTASI
==================================================

Create an achievement section.

Each achievement:
- Nama prestasi
- Deskripsi
- Tahun
- Kategori
- Foto
- Siswa/team

Admin has full CRUD access.

==================================================
GALERI
==================================================

Create a modern responsive photo gallery.

Features:
- Grid
- Lightbox
- Categories
- Captions
- Date
- Search/filter if useful

Admin can:
- Upload photos
- Replace photos
- Delete photos
- Edit captions
- Edit titles
- Change categories
- Change order

Use Supabase Storage.

Optimize uploaded images.

==================================================
INFORMASI SEKOLAH
==================================================

Create a school information page.

Include editable fields:
- Nama sekolah
- Alamat
- Deskripsi
- Jurusan
- Kontak
- Email
- Website
- Media sosial
- Logo
- Foto sekolah

If official school information is researched, use reliable/official sources.

However, all displayed information must remain editable by the administrator.

==================================================
KONTAK
==================================================

Create a contact section.

Include:
- Alamat
- Email
- Contact information
- Social media
- Website
- Map

All information must be editable by admin.

==================================================
GLOBAL SEARCH
==================================================

Create a global search system.

Search:
- Siswa
- Tugas
- Materi
- Pengumuman
- Agenda
- Prestasi
- Galeri
- Other public content

==================================================
DARK MODE
==================================================

Add:
- Light mode
- Dark mode

Remember the user's selected theme.

Ensure accessibility and readability.

==================================================
ADMIN LOGIN
==================================================

Create:

/admin/login

Login fields:
- Email
- Password
- Login button
- Secure password recovery if supported

NO registration button.

After successful authentication:

/admin

If an unauthenticated user tries to access /admin:

redirect to /admin/login

Protect all admin routes.

==================================================
ADMIN DASHBOARD
==================================================

Create a complete professional Admin Dashboard.

Sidebar:

1. Dashboard
2. Profil Kelas
3. Data Siswa
4. Wali Kelas
5. Jadwal Pelajaran
6. Tugas & Materi
7. Pengumuman
8. Agenda
9. Jadwal Piket
10. Prestasi
11. Galeri
12. Informasi Sekolah
13. Kontak
14. Tampilan Website
15. Pengaturan Keamanan
16. Riwayat Aktivitas
17. Logout

==================================================
ADMIN FULL ACCESS
==================================================

The administrator must have complete CRUD access.

CREATE:
- Students
- Announcements
- Assignments
- Materials
- Events
- Achievements
- Gallery images
- Schedules
- Duty roster
- Website content

READ:
- All public content
- Draft content
- Published content
- Activity history

UPDATE:
- Any text
- Any photo
- Any student
- Any schedule
- Any announcement
- Any assignment
- Any material
- Any event
- Any achievement
- Any gallery item
- Any school information
- Any contact information
- Website settings

DELETE:
- Any authorized content

==================================================
EDIT ALL TEXT
==================================================

This is one of the most important requirements.

The administrator must be able to edit practically ALL visible website text without editing source code.

Editable:
- Website title
- Hero title
- Hero subtitle
- Class description
- Visi
- Misi
- Motto
- Section titles
- Section descriptions
- School information
- Teacher information
- Student information
- Announcements
- Tasks
- Materials
- Events
- Achievements
- Gallery captions
- Contact information
- Footer
- Other visible content

Do not hardcode editable content in frontend components.

Store editable content in Supabase.

==================================================
REPLACE ALL IMAGES
==================================================

Admin must be able to replace images without editing source code.

For editable images:
- Show current image
- Upload new image
- Preview
- Replace
- Delete if allowed
- Add alt text
- Save

Support:
- JPG
- JPEG
- PNG
- WEBP

Use Supabase Storage.

==================================================
WEBSITE APPEARANCE SETTINGS
==================================================

Create:

"Tampilan Website"

Admin can customize controlled settings:
- Logo
- Favicon
- Hero image
- Banner
- Class image
- Teacher image
- Background image
- Footer
- Supported theme settings
- Supported accent settings

Do NOT provide arbitrary code injection.

Only safe, controlled customization.

==================================================
ADMIN SECURITY SETTINGS
==================================================

Create:

"Pengaturan Keamanan"

Admin can:
- Change email
- Change password
- View account information
- Securely reset password

Sensitive changes should require re-authentication where appropriate.

Never display the current password.

Never store plaintext passwords.

==================================================
DATABASE
==================================================

Use Supabase PostgreSQL.

Create suitable tables:

students
class_profile
teacher
schedules
assignments
materials
announcements
events
duty_roster
achievements
gallery
school_info
contact
website_settings
activity_logs

Use:
- UUID primary keys
- created_at
- updated_at
- appropriate relationships
- proper indexes where useful

==================================================
STORAGE
==================================================

Use Supabase Storage.

Create suitable buckets for:
- student photos
- teacher photos
- gallery
- school images
- website images
- learning files

Do not store large images directly inside database rows.

==================================================
SECURITY / RLS
==================================================

Implement Supabase Row Level Security.

PUBLIC:
- Can read public/published content
- Cannot insert
- Cannot update
- Cannot delete

ADMIN:
- Authenticated authorized administrator can manage all content

Do NOT rely only on frontend security.

Database-level security must enforce permissions.

Make sure only the single authorized admin can perform write operations.

==================================================
SINGLE ADMIN ENFORCEMENT
==================================================

Implement a secure mechanism ensuring only the authorized administrator account can access the dashboard.

The initial authorized email is:

rizkyramayendra@gmail.com

Do not create a public role-selection system.

Do not allow users to register themselves as admin.

==================================================
ACTIVITY LOG
==================================================

Create activity logs for:
- Login
- Logout
- Create
- Update
- Delete
- Security changes
- Website settings changes

Display:
- Activity
- Date/time
- Content type
- Action

Only admin can access activity logs.

==================================================
PUBLISHING
==================================================

Support content status where useful:

- Draft
- Published

Only published content should appear publicly.

Admin can preview before publishing.

==================================================
UX REQUIREMENTS
==================================================

Use:
- Loading states
- Skeleton loading where useful
- Empty states
- Success notifications
- Error notifications
- Form validation
- Upload progress
- Delete confirmation
- Responsive forms

Before deleting:

"Apakah Anda yakin ingin menghapus data ini?"

Buttons:
"Batal"
"Hapus"

==================================================
RESPONSIVE DESIGN
==================================================

Must work correctly on:
- Android
- iPhone
- Tablet
- Laptop
- Desktop

Admin Dashboard must also be fully responsive.

Pay special attention to:
- Tables
- Forms
- Student cards
- Gallery
- Schedule
- Sidebar
- Mobile navigation

==================================================
ACCESSIBILITY
==================================================

Implement:
- Semantic HTML
- Accessible labels
- Keyboard navigation
- Good contrast
- Alt text
- Focus states
- Readable typography
- Accessible buttons

==================================================
PERFORMANCE
==================================================

Optimize:
- Images
- Database queries
- Loading
- Lazy loading
- Rendering
- Network requests

Avoid unnecessary dependencies.

==================================================
FOOTER
==================================================

Display:

XI TJKT A
SMKN 1 Gunung Talang
Teknik Jaringan Komputer dan Telekomunikasi
Tahun Pembelajaran 2026–2027

Footer content must be editable by admin.

==================================================
ADMIN DASHBOARD STATISTICS
==================================================

Dashboard should display:
- Total siswa
- Total tugas
- Total materi
- Total pengumuman
- Total agenda
- Total prestasi
- Total galeri

Also show recent activity.

==================================================
IMPORTANT ARCHITECTURE RULE
==================================================

This must be a real CMS-like website.

DO NOT make the important website content static.

Public website:
READS from Supabase.

Admin Dashboard:
WRITES to Supabase.

Admin changes should appear on the public website after saving/publishing.

The administrator should never need to edit source code to change normal website content.

==================================================
NO UNNECESSARY PAID SERVICES
==================================================

Prioritize free-tier architecture.

Do not add paid services without explicit approval.

Do not require:
- Paid AI API
- Paid image API
- Paid SMS service
- Paid analytics
- Paid CMS
- Paid authentication provider

Email/password authentication is preferred over SMS/OTP because this is a single-admin class website.

==================================================
FINAL TESTING
==================================================

Before considering the project complete, verify:

[ ] Public website works
[ ] Admin login works
[ ] Only one admin is authorized
[ ] No public registration exists
[ ] No student login exists
[ ] No teacher login exists
[ ] Admin routes are protected
[ ] Database works
[ ] Storage works
[ ] RLS works
[ ] Public users are read-only
[ ] Admin can add content
[ ] Admin can edit content
[ ] Admin can delete content
[ ] Admin can change photos
[ ] Admin can change text
[ ] Admin can manage students
[ ] Admin can manage schedules
[ ] Admin can manage assignments
[ ] Admin can manage materials
[ ] Admin can manage announcements
[ ] Admin can manage events
[ ] Admin can manage duty roster
[ ] Admin can manage achievements
[ ] Admin can manage gallery
[ ] Admin can manage school information
[ ] Admin can manage contact information
[ ] Admin can change website appearance
[ ] Admin can change email/password securely
[ ] Activity logs work
[ ] Search works
[ ] Dark mode works
[ ] Mobile layout works
[ ] Desktop layout works
[ ] Forms validate correctly
[ ] Delete confirmation works
[ ] Images upload correctly
[ ] Changes appear on the public website
[ ] No plaintext password is exposed
[ ] No sensitive admin information is publicly accessible

==================================================
FINAL RESULT
==================================================

The result should look like a real professional school/class portal for:

XI TJKT A
SMKN 1 Gunung Talang
Teknik Jaringan Komputer dan Telekomunikasi
Tahun Pembelajaran 2026–2027

The website must be:
professional,
modern,
responsive,
secure,
database-driven,
easy to manage,
and fully editable by the single administrator.

MOST IMPORTANT:

THE SINGLE ADMINISTRATOR HAS FULL CONTROL OVER THE WEBSITE CONTENT.

The administrator must be able to:
ADD,
EDIT,
DELETE,
REPLACE,
UPLOAD,
REORDER,
PUBLISH,
and MANAGE
all supported website content through the Admin Dashboard.

PUBLIC VISITORS ARE READ-ONLY.

ONLY THE AUTHORIZED SINGLE ADMINISTRATOR CAN MODIFY CONTENT.

Do not stop at a visual mockup.
Implement the actual functional system.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://class-xitjkta.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e3cacec6-0aa3-4d75-a809-4c0eb5a7110b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
