import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Icon } from "@iconify/react";
import type { PipelineStats } from "@/lib/types/supabase";

async function fetchPipelineStats(): Promise<PipelineStats | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("admin_get_pipeline_stats");
    if (error) return null;
    return data as unknown as PipelineStats;
  } catch {
    return null;
  }
}

export default async function PipelineStatsWidget() {
  const stats = await fetchPipelineStats();
  if (!stats) return null;

  const cards = [
    {
      label: "Published Requirements",
      value: stats.publishedRequirements,
      total: stats.totalRequirements,
      icon: "mdi:file-document-outline",
      gradient: "bg-gradient-start-1",
      iconBg: "bg-cyan",
    },
    {
      label: "Active Matches",
      value: stats.matched,
      sub: `${stats.scheduled} scheduled`,
      icon: "mdi:account-switch",
      gradient: "bg-gradient-start-2",
      iconBg: "bg-purple",
    },
    {
      label: "Hired",
      value: stats.hired,
      icon: "mdi:handshake",
      gradient: "bg-gradient-start-3",
      iconBg: "bg-success-main",
    },
    {
      label: "Sessions",
      value: stats.totalSessions,
      sub: `${stats.pendingSessions} pending`,
      icon: "mdi:calendar-check",
      gradient: "bg-gradient-start-4",
      iconBg: "bg-info",
    },
    {
      label: "Avg Rating",
      value: stats.averageRating ?? "—",
      suffix: stats.averageRating ? "/5" : "",
      icon: "mdi:star",
      gradient: "bg-gradient-start-5",
      iconBg: "bg-red",
    },
  ];

  return (
    <section className="mb-24">
      <h4 className="fw-semibold mb-16">Pipeline Overview</h4>
      <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
        {cards.map((card) => (
          <div className="col" key={card.label}>
            <div className={`card shadow-none border ${card.gradient} h-100`}>
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">{card.label}</p>
                    <h6 className="mb-0">
                      {card.value}{card.suffix ?? ""}
                    </h6>
                    {card.sub && (
                      <p className="fw-medium text-sm text-primary-light mt-4 mb-0">
                        {card.sub}
                      </p>
                    )}
                  </div>
                  <div className={`w-50-px h-50-px ${card.iconBg} rounded-circle d-flex justify-content-center align-items-center`}>
                    <Icon icon={card.icon} className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
