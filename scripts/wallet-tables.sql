-- ============================================================
-- TutorBay Wallet Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- Tutor Wallet table
CREATE TABLE IF NOT EXISTS public."TutorWallet" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tutorId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("tutorId")
);

-- Wallet Transaction log
CREATE TABLE IF NOT EXISTS public."WalletTransaction" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "walletId" UUID NOT NULL REFERENCES public."TutorWallet"(id) ON DELETE CASCADE,
  "type" TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
  "source" TEXT NOT NULL CHECK (source IN ('WELCOME_BONUS', 'UNLOCK_REQUIREMENT', 'UNLOCK_TUTOR', 'PURCHASE', 'REFUND')),
  "amount" INTEGER NOT NULL CHECK (amount > 0),
  "balanceAfter" INTEGER NOT NULL,
  "referenceId" UUID,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "WalletTransaction_walletId_idx" ON public."WalletTransaction"("walletId");
CREATE INDEX IF NOT EXISTS "WalletTransaction_createdAt_idx" ON public."WalletTransaction"("createdAt" DESC);

-- Trigger to auto-update updatedAt
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_tutorwallet_updated_at ON public."TutorWallet";
CREATE TRIGGER set_tutorwallet_updated_at
  BEFORE UPDATE ON public."TutorWallet"
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public."TutorWallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."WalletTransaction" ENABLE ROW LEVEL SECURITY;

-- Tutor can read their own wallet and transactions
CREATE POLICY "tutor_read_own_wallet" ON public."TutorWallet"
  FOR SELECT USING ("tutorId" = auth.uid()::TEXT);

CREATE POLICY "tutor_read_own_transactions" ON public."WalletTransaction"
  FOR SELECT USING (
    "walletId" IN (SELECT id FROM public."TutorWallet" WHERE "tutorId" = auth.uid()::TEXT)
  );

-- Service role can do everything
CREATE POLICY "service_admin_full" ON public."TutorWallet"
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_admin_full_tx" ON public."WalletTransaction"
  FOR ALL USING (auth.role() = 'service_role');