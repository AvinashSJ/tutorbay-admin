import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import WalletLayer from "@/components/WalletLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Wallet" />
      <WalletLayer />
    </>
  );
}
