-- ============================================================
-- Unlock a requirement's contact info (deducts credits)
-- Run this in Supabase SQL Editor
-- SECURITY DEFINER so the RPC bypasses RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.unlock_requirement_contact(
  p_requirement_id TEXT,
  p_tutor_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_id UUID;
  v_balance INTEGER;
  v_unlock_cost INTEGER := 4;
  v_new_balance INTEGER;
  v_requirement_owner_id UUID;
  v_contact_email TEXT;
  v_contact_phone TEXT;
BEGIN
  -- Get requirement owner
  SELECT "ownerId" INTO v_requirement_owner_id
  FROM "Requirement"
  WHERE id = p_requirement_id::UUID;

  IF v_requirement_owner_id IS NULL THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Requirement not found');
  END IF;

  -- Don't let tutors unlock their own requirements
  IF v_requirement_owner_id::TEXT = p_tutor_id THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Cannot unlock your own requirement');
  END IF;

  -- Get or create wallet
  SELECT id, balance INTO v_wallet_id, v_balance
  FROM "TutorWallet"
  WHERE "tutorId" = p_tutor_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Wallet not found. Please contact support.');
  END IF;

  IF v_balance < v_unlock_cost THEN
    RETURN JSON_BUILD_OBJECT(
      'success', false,
      'error', 'Insufficient credits',
      'required', v_unlock_cost,
      'available', v_balance
    );
  END IF;

  -- Deduct credits
  v_new_balance := v_balance - v_unlock_cost;

  UPDATE "TutorWallet"
  SET balance = v_new_balance
  WHERE id = v_wallet_id;

  -- Log transaction
  INSERT INTO "WalletTransaction" ("walletId", "type", "source", "amount", "balanceAfter", "referenceId", "description")
  VALUES (
    v_wallet_id, 'DEBIT', 'UNLOCK_REQUIREMENT',
    v_unlock_cost, v_new_balance, p_requirement_id,
    'Contact unlock for requirement: ' || p_requirement_id
  );

  -- Get contact info (from User table via join)
  SELECT u.email, u.phone INTO v_contact_email, v_contact_phone
  FROM "User" u WHERE u.id = v_requirement_owner_id;

  RETURN JSON_BUILD_OBJECT(
    'success', true,
    'email', v_contact_email,
    'phone', v_contact_phone
  );
END;
$$;