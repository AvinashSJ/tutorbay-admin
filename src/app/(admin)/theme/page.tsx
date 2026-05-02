import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ThemeLayer from "@/components/ThemeLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Theme" />
      <ThemeLayer />
    </>
  );
}
