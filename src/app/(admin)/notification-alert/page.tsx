import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NotificationAlertLayer from "@/components/NotificationAlertLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - Notification Alert" />
      <NotificationAlertLayer />
    </>
  );
}
