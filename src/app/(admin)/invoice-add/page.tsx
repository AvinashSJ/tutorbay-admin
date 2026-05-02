import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import InvoiceAddLayer from "@/components/InvoiceAddLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Invoice - Add" />
      <InvoiceAddLayer />
    </>
  );
}
