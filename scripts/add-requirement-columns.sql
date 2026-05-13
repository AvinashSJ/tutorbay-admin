-- ============================================================
-- Add missing columns to Requirement table to match form fields
-- Run this in Supabase SQL Editor BEFORE seed-requirements.sql
-- ============================================================

ALTER TABLE public."Requirement"
  ADD COLUMN IF NOT EXISTS "curriculum" TEXT,
  ADD COLUMN IF NOT EXISTS "grade" TEXT,
  ADD COLUMN IF NOT EXISTS "locationUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "modeOfTeaching" TEXT,
  ADD COLUMN IF NOT EXISTS "expectedFeePerHour" NUMERIC,
  ADD COLUMN IF NOT EXISTS "availability" JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "emirateId" TEXT;