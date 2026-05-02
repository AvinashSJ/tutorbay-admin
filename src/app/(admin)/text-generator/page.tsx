import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import TextGeneratorLayer from "@/components/TextGeneratorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Text Generator" />
      <TextGeneratorLayer />
    </>
  );
}
