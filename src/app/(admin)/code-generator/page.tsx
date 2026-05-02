import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CodeGeneratorLayer from "@/components/CodeGeneratorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Code Generator" />
      <CodeGeneratorLayer />
    </>
  );
}
