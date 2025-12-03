import React from "react";

export function StatusBadge({ label, tone }) {
  return (
    <span className={`badge badge-status badge-status-${tone}`}>
      {label}
    </span>
  );
}

export function FatiguePill({ label }) {
  const tone =
    label === "High" ? "high" : label === "Medium" ? "medium" : "low";

  return (
    <span className={`badge badge-pill badge-${tone}`}>
      {label}
    </span>
  );
}
