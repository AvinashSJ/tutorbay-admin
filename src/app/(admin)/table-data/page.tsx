import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import TableDataLayer from "@/components/TableDataLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Basic Table" />
      <TableDataLayer />
    </>
  );
}
