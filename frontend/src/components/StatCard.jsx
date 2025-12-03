import React from "react";

function StatCard({ label, value, icon: Icon, variant = "default" }) {
  return (
    <div className={`card stats-card stats-card-${variant}`}>
      <div className="card-top">
        <span className="card-label">{label}</span>
        {Icon && (
          <span className={`card-icon-wrapper card-icon-${variant}`}>
            <Icon className="card-icon" />
          </span>
        )}
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
}

export default StatCard;
