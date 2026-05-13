-- ============================================================
-- Seed Test Requirements for TutorBay
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- Creates 5 requirements posted by parents
-- Safe to re-run multiple times
-- ============================================================

-- Clean up existing test requirements
DELETE FROM public."Requirement"
WHERE "ownerId" IN (
  SELECT id FROM public."User"
  WHERE email IN ('parent1@test.com', 'parent2@test.com', 'student1@test.com', 'student2@test.com', 'student3@test.com')
);

-- -----------------------------------
-- Requirement 1: Need Math Tutor (Parent 1)
-- -----------------------------------
INSERT INTO public."Requirement" (
  id, "ownerId", "ownerRole", title, subject, area, "tuitionType",
  curriculum, grade, "locationUrl", "modeOfTeaching",
  "expectedFeePerHour", availability, notes,
  status, "publishedAt", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.id,
  'PARENT',
  'Need Math Tutor',
  'Math',
  'Dubai Marina',
  'INSTITUTE',
  'British',
  '8',
  'https://maps.google.com/?q=Dubai+Marina',
  'both',
  180,
  '[{"days":"Monday","startTime":"16:00","endTime":"18:00"},{"days":"Wednesday","startTime":"16:00","endTime":"18:00"},{"days":"Saturday","startTime":"10:00","endTime":"14:00"}]'::jsonb,
  'Looking for an experienced tutor who can help with IGCSE Math preparation. My daughter is in Year 8 and needs help catching up with algebra and geometry.',
  'PUBLISHED',
  now(),
  now() - interval '2 days',
  now() - interval '2 days'
FROM public."User" u WHERE u.email = 'parent1@test.com';

-- -----------------------------------
-- Requirement 2: Need English Tutor (Parent 1)
-- -----------------------------------
INSERT INTO public."Requirement" (
  id, "ownerId", "ownerRole", title, subject, area, "tuitionType",
  curriculum, grade, "locationUrl", "modeOfTeaching",
  "expectedFeePerHour", availability, notes,
  status, "publishedAt", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.id,
  'PARENT',
  'Need English Tutor',
  'English',
  'JBR',
  'HOME',
  'CBSE',
  '10',
  'https://maps.google.com/?q=JBR+Dubai',
  'offline',
  150,
  '[{"days":"Sunday","startTime":"17:00","endTime":"19:00"},{"days":"Thursday","startTime":"17:00","endTime":"19:00"}]'::jsonb,
  'My son needs English language support, especially writing and grammar. He is preparing for CBSE Year 10 exams.',
  'PUBLISHED',
  now() - interval '1 day',
  now() - interval '1 day',
  now() - interval '1 day'
FROM public."User" u WHERE u.email = 'parent1@test.com';

-- -----------------------------------
-- Requirement 3: Need Physics Tutor (Parent 2)
-- -----------------------------------
INSERT INTO public."Requirement" (
  id, "ownerId", "ownerRole", title, subject, area, "tuitionType",
  curriculum, grade, "locationUrl", "modeOfTeaching",
  "expectedFeePerHour", availability, notes,
  status, "publishedAt", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.id,
  'PARENT',
  'Need Physics Tutor',
  'Physics',
  'Jumeirah',
  'HOME',
  'IB',
  '11',
  'https://maps.google.com/?q=Jumeirah+Dubai',
  'offline',
  220,
  '[{"days":"Tuesday","startTime":"15:00","endTime":"18:00"},{"days":"Friday","startTime":"10:00","endTime":"13:00"}]'::jsonb,
  'IB Diploma student in Year 11 needs a Physics tutor for SL. Strong focus on mechanics and thermodynamics. Previous experience with IB curriculum preferred.',
  'PUBLISHED',
  now() - interval '3 days',
  now() - interval '3 days',
  now() - interval '3 days'
FROM public."User" u WHERE u.email = 'parent2@test.com';

-- -----------------------------------
-- Requirement 4: Need Arabic Tutor (Parent 2)
-- -----------------------------------
INSERT INTO public."Requirement" (
  id, "ownerId", "ownerRole", title, subject, area, "tuitionType",
  curriculum, grade, "locationUrl", "modeOfTeaching",
  "expectedFeePerHour", availability, notes,
  status, "publishedAt", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.id,
  'PARENT',
  'Need Arabic Tutor',
  'Arabic',
  'Jumeirah',
  'INSTITUTE',
  'British',
  '5',
  'https://maps.google.com/?q=Jumeirah+Dubai',
  'both',
  120,
  '[{"days":"Saturday","startTime":"11:00","endTime":"13:00"},{"days":"Wednesday","startTime":"16:00","endTime":"18:00"}]'::jsonb,
  'My son needs help with Arabic as a Second Language (ASL). He finds reading and writing challenging. Native Arabic speaker preferred.',
  'PUBLISHED',
  now() - interval '5 days',
  now() - interval '5 days',
  now() - interval '5 days'
FROM public."User" u WHERE u.email = 'parent2@test.com';

-- -----------------------------------
-- Requirement 5: Need Chemistry Tutor (Parent 1)
-- -----------------------------------
INSERT INTO public."Requirement" (
  id, "ownerId", "ownerRole", title, subject, area, "tuitionType",
  curriculum, grade, "locationUrl", "modeOfTeaching",
  "expectedFeePerHour", availability, notes,
  status, "publishedAt", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.id,
  'PARENT',
  'Need Chemistry Tutor',
  'Chemistry',
  'Dubai Marina',
  'ONLINE',
  'American',
  '12',
  'https://maps.google.com/?q=Dubai+Marina',
  'ONLINE',
  200,
  '[{"days":"Monday","startTime":"18:00","endTime":"20:00"},{"days":"Thursday","startTime":"18:00","endTime":"20:00"}]'::jsonb,
  'Year 12 AP Chemistry student needs a tutor for exam prep. Strong background in organic chemistry and stoichiometry required.',
  'PUBLISHED',
  now() - interval '4 days',
  now() - interval '4 days',
  now() - interval '4 days'
FROM public."User" u WHERE u.email = 'parent1@test.com';