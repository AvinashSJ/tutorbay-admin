import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGeneratorLayer from "@/components/ImageGeneratorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Image Generator" />
      <ImageGeneratorLayer />
    </>
  );
}
