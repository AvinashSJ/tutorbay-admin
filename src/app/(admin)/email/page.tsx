import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import EmailLayer from "@/components/EmailLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Email" />
      <EmailLayer />
    </>
  );
}
