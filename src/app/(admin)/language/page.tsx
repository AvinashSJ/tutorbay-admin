import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LanguageLayer from "@/components/LanguageLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Languages" />
      <LanguageLayer />
    </>
  );
}
