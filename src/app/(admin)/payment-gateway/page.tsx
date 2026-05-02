import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import PaymentGatewayLayer from "@/components/PaymentGatewayLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Settings - PaymentGateway" />
      <PaymentGatewayLayer />
    </>
  );
}
