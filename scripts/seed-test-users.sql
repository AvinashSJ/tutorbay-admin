-- ============================================================
-- Seed Test Users for TutorBay
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- Creates: 5 tutors + 2 parents with profiles
-- All passwords: Password123!
-- Safe to re-run multiple times
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clean up previously seeded data (child tables first, then parents)
DELETE FROM public."TutorProfile" WHERE "userId" IN (SELECT id FROM public."User" WHERE email IN ('tutor1@test.com','tutor2@test.com','tutor3@test.com','tutor4@test.com','tutor5@test.com','parent1@test.com','parent2@test.com'));
DELETE FROM public."ParentProfile" WHERE "userId" IN (SELECT id FROM public."User" WHERE email IN ('tutor1@test.com','tutor2@test.com','tutor3@test.com','tutor4@test.com','tutor5@test.com','parent1@test.com','parent2@test.com'));
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('tutor1@test.com','tutor2@test.com','tutor3@test.com','tutor4@test.com','tutor5@test.com','parent1@test.com','parent2@test.com'));
DELETE FROM public."User" WHERE email IN ('tutor1@test.com','tutor2@test.com','tutor3@test.com','tutor4@test.com','tutor5@test.com','parent1@test.com','parent2@test.com');
DELETE FROM auth.users WHERE email IN ('tutor1@test.com','tutor2@test.com','tutor3@test.com','tutor4@test.com','tutor5@test.com','parent1@test.com','parent2@test.com');

-- ============================================================
-- TUTORS
-- ============================================================

-- -----------------------------------
-- Tutor 1: Ahmed Hassan (Math, Physics)
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'tutor1@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"TUTOR","full_name":"Ahmed Hassan"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'tutor1@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'tutor1@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'tutor1@test.com', encrypted_password, 'Ahmed Hassan', '+971501234561', 'TUTOR', true, now(), now()
FROM auth.users WHERE email = 'tutor1@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."TutorProfile" (id, "userId", subjects, areas, bio, "isVerified", nationality, "highestQualification", "modeOfTeaching", "expectedFeePerHour", "hasPrivateTutorLicense", "licenseDocumentUrl", availability, location, "emirateId", "applicationStatus", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, ARRAY['Math','Physics'], ARRAY['Dubai Marina','JBR'], 'Certified Math & Physics tutor with 8 years experience helping students achieve top grades in IGCSE, IB, and CBSE curricula.', true, 'UAE', 'Masters in Applied Mathematics', 'Both', 200, true, NULL, '[{"days":"Monday","startTime":"16:00","endTime":"20:00"},{"days":"Wednesday","startTime":"16:00","endTime":"20:00"},{"days":"Saturday","startTime":"10:00","endTime":"14:00"}]'::jsonb, '{"currentLocationURL":"https://maps.google.com/?q=Dubai+Marina","mapLocation":[{"lat":25.0805,"lng":55.1403}]}'::jsonb, '784-1990-1234567-1', 'APPROVED', now(), now()
FROM auth.users WHERE email = 'tutor1@test.com'
ON CONFLICT ("userId") DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, nationality = EXCLUDED.nationality, "highestQualification" = EXCLUDED."highestQualification", "modeOfTeaching" = EXCLUDED."modeOfTeaching", "expectedFeePerHour" = EXCLUDED."expectedFeePerHour", "hasPrivateTutorLicense" = EXCLUDED."hasPrivateTutorLicense", availability = EXCLUDED.availability, location = EXCLUDED.location, "emirateId" = EXCLUDED."emirateId", "applicationStatus" = EXCLUDED."applicationStatus";

-- -----------------------------------
-- Tutor 2: Fatima Al Mansouri (English, Arabic, French)
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'tutor2@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"TUTOR","full_name":"Fatima Al Mansouri"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'tutor2@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'tutor2@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'tutor2@test.com', encrypted_password, 'Fatima Al Mansouri', '+971501234562', 'TUTOR', true, now(), now()
FROM auth.users WHERE email = 'tutor2@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."TutorProfile" (id, "userId", subjects, areas, bio, "isVerified", nationality, "highestQualification", "modeOfTeaching", "expectedFeePerHour", "hasPrivateTutorLicense", "licenseDocumentUrl", availability, location, "emirateId", "applicationStatus", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, ARRAY['English','Arabic','French'], ARRAY['Abu Dhabi','Al Ain'], 'Native Arabic speaker with a BA in English Literature. Specializes in language acquisition and literature for all grade levels.', true, 'UAE', 'BA English Literature', 'Online', 150, false, NULL, '[{"days":"Sunday","startTime":"09:00","endTime":"13:00"},{"days":"Tuesday","startTime":"09:00","endTime":"13:00"},{"days":"Thursday","startTime":"14:00","endTime":"18:00"}]'::jsonb, '{"currentLocationURL":"https://maps.google.com/?q=Abu+Dhabi","mapLocation":[{"lat":24.4539,"lng":54.3773}]}'::jsonb, '784-1991-2345678-2', 'APPROVED', now(), now()
FROM auth.users WHERE email = 'tutor2@test.com'
ON CONFLICT ("userId") DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, nationality = EXCLUDED.nationality, "highestQualification" = EXCLUDED."highestQualification", "modeOfTeaching" = EXCLUDED."modeOfTeaching", "expectedFeePerHour" = EXCLUDED."expectedFeePerHour", "hasPrivateTutorLicense" = EXCLUDED."hasPrivateTutorLicense", availability = EXCLUDED.availability, location = EXCLUDED.location, "emirateId" = EXCLUDED."emirateId", "applicationStatus" = EXCLUDED."applicationStatus";

-- -----------------------------------
-- Tutor 3: Mohammed Iqbal (Science, Chemistry)
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'tutor3@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"TUTOR","full_name":"Mohammed Iqbal"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'tutor3@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'tutor3@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'tutor3@test.com', encrypted_password, 'Mohammed Iqbal', '+971501234563', 'TUTOR', true, now(), now()
FROM auth.users WHERE email = 'tutor3@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."TutorProfile" (id, "userId", subjects, areas, bio, "isVerified", nationality, "highestQualification", "modeOfTeaching", "expectedFeePerHour", "hasPrivateTutorLicense", "licenseDocumentUrl", availability, location, "emirateId", "applicationStatus", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, ARRAY['Science','Chemistry'], ARRAY['Sharjah','Ajman'], 'PhD in Chemistry with 10+ years of teaching experience. Makes complex science concepts easy to understand.', true, 'India', 'PhD Chemistry', 'Both', 180, true, NULL, '[{"days":"Monday","startTime":"10:00","endTime":"14:00"},{"days":"Wednesday","startTime":"10:00","endTime":"14:00"},{"days":"Friday","startTime":"14:00","endTime":"18:00"}]'::jsonb, '{"currentLocationURL":"https://maps.google.com/?q=Sharjah","mapLocation":[{"lat":25.3463,"lng":55.4209}]}'::jsonb, '784-1992-3456789-3', 'APPROVED', now(), now()
FROM auth.users WHERE email = 'tutor3@test.com'
ON CONFLICT ("userId") DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, nationality = EXCLUDED.nationality, "highestQualification" = EXCLUDED."highestQualification", "modeOfTeaching" = EXCLUDED."modeOfTeaching", "expectedFeePerHour" = EXCLUDED."expectedFeePerHour", "hasPrivateTutorLicense" = EXCLUDED."hasPrivateTutorLicense", availability = EXCLUDED.availability, location = EXCLUDED.location, "emirateId" = EXCLUDED."emirateId", "applicationStatus" = EXCLUDED."applicationStatus";

-- -----------------------------------
-- Tutor 4: Sara Khalid (ICT, Moral Studies)
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'tutor4@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"TUTOR","full_name":"Sara Khalid"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'tutor4@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'tutor4@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'tutor4@test.com', encrypted_password, 'Sara Khalid', '+971501234564', 'TUTOR', true, now(), now()
FROM auth.users WHERE email = 'tutor4@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."TutorProfile" (id, "userId", subjects, areas, bio, "isVerified", nationality, "highestQualification", "modeOfTeaching", "expectedFeePerHour", "hasPrivateTutorLicense", "licenseDocumentUrl", availability, location, "emirateId", "applicationStatus", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, ARRAY['ICT','Moral Studies'], ARRAY['Dubai','Jumeirah'], 'ICT professional turned educator. Teaches programming basics, digital literacy, and moral education.', false, 'Jordan', 'BSc Computer Science', 'Online', 120, false, NULL, '[{"days":"Tuesday","startTime":"14:00","endTime":"18:00"},{"days":"Thursday","startTime":"14:00","endTime":"18:00"},{"days":"Saturday","startTime":"09:00","endTime":"13:00"}]'::jsonb, '{"currentLocationURL":"https://maps.google.com/?q=Jumeirah+Dubai","mapLocation":[{"lat":25.1986,"lng":55.2729}]}'::jsonb, '784-1993-4567890-4', 'PENDING_REVIEW', now(), now()
FROM auth.users WHERE email = 'tutor4@test.com'
ON CONFLICT ("userId") DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, nationality = EXCLUDED.nationality, "highestQualification" = EXCLUDED."highestQualification", "modeOfTeaching" = EXCLUDED."modeOfTeaching", "expectedFeePerHour" = EXCLUDED."expectedFeePerHour", "hasPrivateTutorLicense" = EXCLUDED."hasPrivateTutorLicense", availability = EXCLUDED.availability, location = EXCLUDED.location, "emirateId" = EXCLUDED."emirateId", "applicationStatus" = EXCLUDED."applicationStatus";

-- -----------------------------------
-- Tutor 5: David Chen (English, Math)
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'tutor5@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"TUTOR","full_name":"David Chen"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'tutor5@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'tutor5@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'tutor5@test.com', encrypted_password, 'David Chen', '+971501234565', 'TUTOR', true, now(), now()
FROM auth.users WHERE email = 'tutor5@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."TutorProfile" (id, "userId", subjects, areas, bio, "isVerified", nationality, "highestQualification", "modeOfTeaching", "expectedFeePerHour", "hasPrivateTutorLicense", "licenseDocumentUrl", availability, location, "emirateId", "applicationStatus", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, ARRAY['English','Math'], ARRAY['Dubai Hills','Emirates Hills'], 'British curriculum specialist. 12 years teaching experience in top Dubai schools. IELTS and SAT preparation expert.', true, 'United Kingdom', 'PGCE Secondary Education', 'Both', 250, true, NULL, '[{"days":"Monday","startTime":"09:00","endTime":"13:00"},{"days":"Wednesday","startTime":"09:00","endTime":"13:00"},{"days":"Friday","startTime":"09:00","endTime":"13:00"}]'::jsonb, '{"currentLocationURL":"https://maps.google.com/?q=Dubai+Hills","mapLocation":[{"lat":25.0453,"lng":55.1607}]}'::jsonb, '784-1994-5678901-5', 'APPROVED', now(), now()
FROM auth.users WHERE email = 'tutor5@test.com'
ON CONFLICT ("userId") DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, nationality = EXCLUDED.nationality, "highestQualification" = EXCLUDED."highestQualification", "modeOfTeaching" = EXCLUDED."modeOfTeaching", "expectedFeePerHour" = EXCLUDED."expectedFeePerHour", "hasPrivateTutorLicense" = EXCLUDED."hasPrivateTutorLicense", availability = EXCLUDED.availability, location = EXCLUDED.location, "emirateId" = EXCLUDED."emirateId", "applicationStatus" = EXCLUDED."applicationStatus";

-- ============================================================
-- PARENTS
-- ============================================================

-- -----------------------------------
-- Parent 1: Omar Al Rashid
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'parent1@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"PARENT","full_name":"Omar Al Rashid"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'parent1@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'parent1@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'parent1@test.com', encrypted_password, 'Omar Al Rashid', '+971501234566', 'PARENT', true, now(), now()
FROM auth.users WHERE email = 'parent1@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."ParentProfile" (id, "userId", area, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Dubai Marina', now(), now()
FROM auth.users WHERE email = 'parent1@test.com'
ON CONFLICT ("userId") DO UPDATE SET area = EXCLUDED.area;

-- -----------------------------------
-- Parent 2: Layla Khoury
-- -----------------------------------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'parent2@test.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"PARENT","full_name":"Layla Khoury"}', now(), now(), '', '', '', '');

INSERT INTO auth.identities (id, user_id, identity_data, provider_id, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, json_build_object('sub', id::text, 'email', 'parent2@test.com')::jsonb, gen_random_uuid(), 'email', now(), now(), now()
FROM auth.users WHERE email = 'parent2@test.com';

INSERT INTO public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "createdAt", "updatedAt")
SELECT id, 'parent2@test.com', encrypted_password, 'Layla Khoury', '+971501234567', 'PARENT', true, now(), now()
FROM auth.users WHERE email = 'parent2@test.com'
ON CONFLICT (id) DO UPDATE SET "fullName" = EXCLUDED."fullName", phone = EXCLUDED.phone, role = EXCLUDED.role;

INSERT INTO public."ParentProfile" (id, "userId", area, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Jumeirah', now(), now()
FROM auth.users WHERE email = 'parent2@test.com'
ON CONFLICT ("userId") DO UPDATE SET area = EXCLUDED.area;
