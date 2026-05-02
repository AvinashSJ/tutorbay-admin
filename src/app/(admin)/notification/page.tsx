import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NotificationLayer from "@/components/NotificationLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Notification" />
      <NotificationLayer />
    </>
  );
}
