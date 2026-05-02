import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import UsersListLayer from "@/components/UsersListLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Users Grid" />
      <UsersListLayer />
    </>
  );
}
