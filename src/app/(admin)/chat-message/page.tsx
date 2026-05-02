import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ChatMessageLayer from "@/components/ChatMessageLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Chat Message" />
      <ChatMessageLayer />
    </>
  );
}
