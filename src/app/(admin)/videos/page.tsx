import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import VideosLayer from "@/components/VideosLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Components / Videos" />
      <VideosLayer />
    </>
  );
}
