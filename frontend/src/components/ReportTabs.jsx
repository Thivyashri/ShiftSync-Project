import React from "react";

const TABS = [
  { id: "attendance", label: "Attendance" },
  { id: "load-history", label: "Load History" },
  { id: "fatigue-trends", label: "Fatigue Trends" },
];

function ReportTabs({ active = "attendance", onChange }) {
  return (
    <div className="report-tabs">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`report-tab ${isActive ? "active" : ""}`}
            onClick={() => onChange && onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default ReportTabs;
