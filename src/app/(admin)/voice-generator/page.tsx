import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import VoiceGeneratorLayer from "@/components/VoiceGeneratorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Voice Generator" />
      <VoiceGeneratorLayer />
    </>
  );
}
