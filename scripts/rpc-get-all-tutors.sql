-- ============================================================
-- Create RPC function to fetch all active tutors (bypasses RLS)
-- Run this in Supabase SQL Editor
-- The function runs with SECURITY DEFINER to allow public reads
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_all_tutors()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', u.id,
      'email', u.email,
      'fullName', u."fullName",
      'phone', u.phone,
      'role', u.role,
      'isActive', u."isActive",
      'createdAt', u."createdAt",
      'profileImage', NULL,
      'tutorProfile', CASE WHEN tp.id IS NOT NULL THEN
        JSON_BUILD_OBJECT(
          'subjects', tp.subjects,
          'areas', tp.areas,
          'bio', tp.bio,
          'isVerified', tp."isVerified",
          'nationality', tp.nationality,
          'highestQualification', tp."highestQualification",
          'modeOfTeaching', tp."modeOfTeaching",
          'expectedFeePerHour', tp."expectedFeePerHour",
          'hasPrivateTutorLicense', tp."hasPrivateTutorLicense",
          'licenseDocumentUrl', tp."licenseDocumentUrl",
          'availability', tp.availability,
          'location', tp.location,
          'emirateId', tp."emirateId",
          'applicationStatus', tp."applicationStatus"
        )
      ELSE NULL END
    )
    ORDER BY u."createdAt" DESC
  ) INTO result
  FROM "User" u
  LEFT JOIN "TutorProfile" tp ON tp."userId" = u.id
  WHERE u.role = 'TUTOR' AND u."isActive" = true;

  RETURN COALESCE(result, '[]'::json);
END;
$$;
