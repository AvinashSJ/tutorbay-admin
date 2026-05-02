import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import InvoiceListLayer from "@/components/InvoiceListLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Invoice - List" />
      <InvoiceListLayer />
    </>
  );
}
