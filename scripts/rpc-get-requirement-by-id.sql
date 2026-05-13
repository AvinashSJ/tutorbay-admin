-- ============================================================
-- Fetch a single requirement by ID with owner info (bypasses RLS)
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_requirement_by_id(p_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT JSON_BUILD_OBJECT(
    '_id', r.id,
    'id', r.id,
    'title', COALESCE(r.title, r.subject),
    'subject', r.subject,
    'area', r.area,
    'tuitionType', r."tuitionType",
    'status', r.status,
    'publishedAt', r."publishedAt",
    'createdAt', r."createdAt",
    'updatedAt', r."updatedAt",
    'curriculum', COALESCE(r."curriculum", NULL),
    'grade', COALESCE(r."grade", NULL),
    'location', JSON_BUILD_OBJECT('currentLocationURL', COALESCE(r."locationUrl", NULL)),
    'modeOfTeaching', COALESCE(r."modeOfTeaching", NULL),
    'expectedFeePerHour', COALESCE(r."expectedFeePerHour", NULL),
    'availability', COALESCE(r.availability, '[]'::jsonb),
    'additionalNotes', COALESCE(r.notes, NULL),
    'description', COALESCE(r.notes, NULL),
    'userId', CASE WHEN u.id IS NOT NULL THEN
      JSON_BUILD_OBJECT(
        'id', u.id,
        'firstName', SPLIT_PART(COALESCE(u."fullName", ''), ' ', 1),
        'fullName', u."fullName",
        'email', u.email,
        'phone', u.phone
      )
    ELSE NULL END,
    'ownerId', u.id,
    'ownerName', u."fullName",
    'ownerEmail', u.email,
    'ownerPhone', u.phone,
    'firstName', SPLIT_PART(COALESCE(u."fullName", ''), ' ', 1),
    'lastName', CASE WHEN POSITION(' ' IN COALESCE(u."fullName", '')) > 0
                       THEN SUBSTRING(u."fullName" FROM POSITION(' ' IN u."fullName") + 1)
                       ELSE '' END
  ) INTO v_result
  FROM "Requirement" r
  LEFT JOIN "User" u ON u.id = r."ownerId"
  WHERE r.id = p_id;

  IF v_result IS NULL THEN
    RETURN JSON_BUILD_OBJECT('error', 'Requirement not found');
  END IF;

  RETURN v_result;
END;
$$;