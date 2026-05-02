import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LineChartLayer from "@/components/LineChartLayer";

export default function Page() {
  return (
    <>
      <Breadcrumb title="Chart - Line Chart" />
      <LineChartLayer />
    </>
  );
}
