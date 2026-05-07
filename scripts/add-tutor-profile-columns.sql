-- ============================================================
-- Add missing TutorProfile columns
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public."TutorProfile"
  ADD COLUMN IF NOT EXISTS "nationality" TEXT,
  ADD COLUMN IF NOT EXISTS "highestQualification" TEXT,
  ADD COLUMN IF NOT EXISTS "modeOfTeaching" TEXT,
  ADD COLUMN IF NOT EXISTS "expectedFeePerHour" INTEGER,
  ADD COLUMN IF NOT EXISTS "hasPrivateTutorLicense" BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "licenseDocumentUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "availability" JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "location" JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS "emirateId" TEXT;
