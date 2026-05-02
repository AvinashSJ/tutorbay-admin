import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CompanyLayer from "@/components/CompanyLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Company" />
      <CompanyLayer />
    </>
  );
}
