import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ChatProfileLayer from "@/components/ChatProfileLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Chat" />
      <ChatProfileLayer />
    </>
  );
}
