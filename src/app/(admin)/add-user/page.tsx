import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import AddUserLayer from "@/components/AddUserLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Add User" />
      <AddUserLayer />
    </>
  );
}
