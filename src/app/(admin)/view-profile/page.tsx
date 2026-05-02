import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ViewProfileLayer from "@/components/ViewProfileLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="View Profile" />
      <ViewProfileLayer />
    </>
  );
}
