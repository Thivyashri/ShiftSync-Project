import React, { useState } from "react";
import { FiPlus, FiChevronDown } from "react-icons/fi";

// =================== BADGE COMPONENTS =================== //

function StatusBadge({ label, tone }) {
  return (
    <span className={`badge badge-status badge-status-${tone}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ label }) {
  const tone = label === "High" ? "high" : label === "Medium" ? "medium" : "low";
  return (
    <span className={`badge badge-pill badge-${tone}`}>
      {label}
    </span>
  );
}

// =================== FILTER DROPDOWN =================== //

function FilterDropdown({ label, value }) {
  return (
    <div className="filter-dropdown">
      <span className="filter-label">{label}</span>
      <div className="filter-control">
        <span className="filter-value">{value}</span>
        <FiChevronDown className="filter-icon" />
      </div>
    </div>
  );
}

// =================== PAGE HEADER =================== //

function PageHeader({ title, subtitle, rightSlot }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {rightSlot && <div className="page-header-right">{rightSlot}</div>}
    </header>
  );
}

// =================== STATIC DATA =================== //

const LOADS_DATA = [];

// =================== MAIN COMPONENT =================== //

function LoadManagement() {
  const [dateFilter, setDateFilter] = useState("Today");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  return (
    <>
      {/* HEADER */}
      <PageHeader
        title="Load Management"
        subtitle="Track and manage all shipment loads"
        rightSlot={
          <button className="btn-primary">
            <FiPlus className="btn-icon" />
            Add Load
          </button>
        }
      />

      {/* ===== FILTERS CARD ===== */}
      <section className="card filters-card">
        <div className="filters-grid">
          <FilterDropdown label="Date" value={dateFilter} />
          <FilterDropdown label="Region" value={regionFilter} />
          <FilterDropdown label="Status" value={statusFilter} />
        </div>
      </section>

      {/* ===== LOADS TABLE ===== */}
      <section className="card panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Packages</th>
                <th>Distance</th>
                <th>Area</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {LOADS_DATA.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    No loads available
                  </td>
                </tr>
              ) : (
                LOADS_DATA.map((load) => (
                  <tr key={load.id}>
                    <td style={{ fontWeight: 500 }}>{load.id}</td>
                    <td>{load.packages}</td>
                    <td>{load.distance}</td>
                    <td>{load.area}</td>
                    <td>
                      <PriorityBadge label={load.priority} />
                    </td>
                    <td>
                      <StatusBadge
                        label={load.status.label}
                        tone={load.status.tone}
                      />
                    </td>
                    <td>
                      <button 
                        className="action-link"
                        onClick={() => alert(`Viewing details for ${load.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default LoadManagement;