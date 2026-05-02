import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import RoleAccessLayer from "@/components/RoleAccessLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Role Access" />
      <RoleAccessLayer />
    </>
  );
}
