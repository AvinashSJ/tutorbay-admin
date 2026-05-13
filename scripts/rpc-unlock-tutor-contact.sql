-- ============================================================
-- Unlock a tutor's contact info (deducts credits from parent, credits tutor)
-- Run this in Supabase SQL Editor
-- SECURITY DEFINER so the RPC bypasses RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.unlock_tutor_contact(
  p_tutor_id TEXT,
  p_parent_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent_wallet_id UUID;
  v_parent_balance INTEGER;
  v_tutor_wallet_id UUID;
  v_tutor_balance INTEGER;
  v_unlock_cost INTEGER := 4;
  v_new_parent_balance INTEGER;
  v_new_tutor_balance INTEGER;
  v_tutor_email TEXT;
  v_tutor_phone TEXT;
BEGIN
  -- Get tutor's email and phone
  SELECT email, phone INTO v_tutor_email, v_tutor_phone
  FROM "User" WHERE id = p_tutor_id::UUID;

  IF v_tutor_email IS NULL THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Tutor not found');
  END IF;

  -- Don't let tutors unlock their own contact
  IF p_tutor_id = p_parent_id THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Cannot unlock your own contact');
  END IF;

  -- Get parent wallet
  SELECT id, balance INTO v_parent_wallet_id, v_parent_balance
  FROM "TutorWallet"
  WHERE "tutorId" = p_parent_id
  FOR UPDATE;

  IF v_parent_wallet_id IS NULL THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Wallet not found. Please contact support.');
  END IF;

  IF v_parent_balance < v_unlock_cost THEN
    RETURN JSON_BUILD_OBJECT(
      'success', false,
      'error', 'Insufficient credits',
      'required', v_unlock_cost,
      'available', v_parent_balance
    );
  END IF;

  -- Deduct from parent
  v_new_parent_balance := v_parent_balance - v_unlock_cost;
  UPDATE "TutorWallet" SET balance = v_new_parent_balance WHERE id = v_parent_wallet_id;

  INSERT INTO "WalletTransaction" ("walletId", "type", "source", "amount", "balanceAfter", "referenceId", "description")
  VALUES (v_parent_wallet_id, 'DEBIT', 'UNLOCK_TUTOR', v_unlock_cost, v_new_parent_balance, p_tutor_id,
    'Viewed tutor contact: ' || p_tutor_id);

  -- Credit tutor
  SELECT id, balance INTO v_tutor_wallet_id, v_tutor_balance
  FROM "TutorWallet"
  WHERE "tutorId" = p_tutor_id
  FOR UPDATE;

  IF v_tutor_wallet_id IS NULL THEN
    INSERT INTO "TutorWallet" ("tutorId", balance) VALUES (p_tutor_id, 0) RETURNING id INTO v_tutor_wallet_id;
    v_tutor_balance := 0;
  END IF;

  v_new_tutor_balance := v_tutor_balance + v_unlock_cost;
  UPDATE "TutorWallet" SET balance = v_new_tutor_balance WHERE id = v_tutor_wallet_id;

  INSERT INTO "WalletTransaction" ("walletId", "type", "source", "amount", "balanceAfter", "referenceId", "description")
  VALUES (v_tutor_wallet_id, 'CREDIT', 'UNLOCK_TUTOR', v_unlock_cost, v_new_tutor_balance, p_parent_id,
    'Contact viewed by parent: ' || p_parent_id);

  RETURN JSON_BUILD_OBJECT(
    'success', true,
    'email', v_tutor_email,
    'phone', v_tutor_phone
  );
END;
$$;