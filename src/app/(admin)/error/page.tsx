import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorLayer from "@/components/ErrorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="404" />
      <ErrorLayer />
    </>
  );
}
