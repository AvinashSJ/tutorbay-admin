import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import VideoGeneratorLayer from "@/components/VideoGeneratorLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Video Generator" />
      <VideoGeneratorLayer />
    </>
  );
}
