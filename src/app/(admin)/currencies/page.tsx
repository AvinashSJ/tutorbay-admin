import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CurrenciesLayer from "@/components/CurrenciesLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Currencies" />
      <CurrenciesLayer />
    </>
  );
}
