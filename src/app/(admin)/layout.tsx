import type { ReactNode } from "react";
import MasterLayout from "@/components/MasterLayout";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <MasterLayout>{children}</MasterLayout>;
}