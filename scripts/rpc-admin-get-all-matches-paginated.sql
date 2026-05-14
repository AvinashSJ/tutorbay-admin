-- ============================================================
-- Paginated version of admin_get_all_matches
-- Run this in Supabase SQL Editor
-- Replace `"Match"` with the actual table name if different
-- Adjust the JOINs to match the existing RPC definition
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_get_all_matches_paginated(
  p_page INT DEFAULT 1,
  p_limit INT DEFAULT 20
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  total_count BIGINT;
BEGIN
  -- Count all matching rows
  SELECT COUNT(*) INTO total_count FROM "Match";

  -- Fetch paginated rows (adjust JOINs, columns, ORDER BY as needed)
  SELECT JSON_BUILD_OBJECT(
    'data', COALESCE(JSON_AGG(
      row_to_json(sub) ORDER BY sub."createdAt" DESC
    ), '[]'::json),
    'total', total_count
  )
  INTO result
  FROM (
    SELECT *
    FROM "Match"
    ORDER BY "createdAt" DESC
    LIMIT p_limit
    OFFSET (p_page - 1) * p_limit
  ) sub;

  RETURN result;
END;
$$;
