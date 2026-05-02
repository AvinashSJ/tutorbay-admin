import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import InvoicePreviewLayer from "@/components/InvoicePreviewLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Invoice - Preview" />
      <InvoicePreviewLayer />
    </>
  );
}
