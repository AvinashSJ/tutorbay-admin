import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import UsersGridLayer from "@/components/UsersGridLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Users Grid" />
      <UsersGridLayer />
    </>
  );
}
