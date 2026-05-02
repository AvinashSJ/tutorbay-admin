import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import PortfolioLayer from "@/components/PortfolioLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Portfolio" />
      <PortfolioLayer />
    </>
  );
}
