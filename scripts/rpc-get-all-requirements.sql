-- ============================================================
-- Create RPC function to fetch all published requirements (bypasses RLS)
-- Run this in Supabase SQL Editor
-- The function runs with SECURITY DEFINER to allow public reads
-- Returns requirements with owner (parent/student) info and computed _id
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_all_requirements()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT COALESCE(JSON_AGG(
    req.data
    ORDER BY req.data->>'createdAt' DESC
  ), '[]'::json)
  INTO result
  FROM (
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
      'curriculum', COALESCE(r."curriculum", NULL),
      'grade', COALESCE(r."grade", NULL),
      'location', JSON_BUILD_OBJECT('currentLocationURL', COALESCE(r."locationUrl", NULL)),
      'modeOfTeaching', COALESCE(r."modeOfTeaching", NULL),
      'expectedFeePerHour', COALESCE(r."expectedFeePerHour", NULL),
      'availability', COALESCE(r.availability, '[]'::jsonb),
      'additionalNotes', COALESCE(r.notes, NULL),
      'userId', CASE WHEN u.id IS NOT NULL THEN
        JSON_BUILD_OBJECT(
          'id', u.id,
          'firstName', SPLIT_PART(COALESCE(u."fullName", ''), ' ', 1),
          'fullName', u."fullName",
          'email', u.email
        )
      ELSE NULL END,
      'profileImage', NULL,
      'firstName', SPLIT_PART(COALESCE(u."fullName", ''), ' ', 1),
      'lastName', CASE WHEN POSITION(' ' IN COALESCE(u."fullName", '')) > 0
                       THEN SUBSTRING(u."fullName" FROM POSITION(' ' IN u."fullName") + 1)
                       ELSE '' END
    ) AS data
    FROM "Requirement" r
    LEFT JOIN "User" u ON u.id = r."ownerId"
    WHERE r.status = 'PUBLISHED'
  ) req;

  RETURN result;
END;
$$;