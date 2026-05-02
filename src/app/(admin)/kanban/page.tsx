import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import KanbanLayer from "@/components/KanbanLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Kanban" />
      <KanbanLayer />
    </>
  );
}
