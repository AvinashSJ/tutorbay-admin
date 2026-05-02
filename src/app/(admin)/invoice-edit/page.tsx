import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import InvoiceEditLayer from "@/components/InvoiceEditLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Invoice - Edit" />
      <InvoiceEditLayer />
    </>
  );
}
