import React from "react";
import { FiCheckCircle, FiPackage, FiUsers, FiUserX } from "react-icons/fi";

// =================== STAT CARD COMPONENT =================== //

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

// =================== BADGE COMPONENTS =================== //

function FatiguePill({ label }) {
  const tone = label === "High" ? "high" : label === "Medium" ? "medium" : "low";
  return (
    <span className={`badge badge-pill badge-${tone}`}>
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  // Determine the style based on status
  let className = "badge badge-status ";
  
  if (label === "Accepted") {
    className += "badge-status-gray";
  } else if (label === "Pending") {
    className += "badge-status-gray";
  } else if (label === "In Progress") {
    className += "badge-status-dark";
  }
  
  return <span className={className}>{label}</span>;
}

// =================== PAGE HEADER =================== //

function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}

// =================== STATIC DATA =================== //

const ASSIGNMENTS_DATA = [];

// =================== MAIN COMPONENT =================== //

function AutoAssignment() {
  return (
    <>
      {/* HEADER */}
      <PageHeader
        title="Automatic Assignment Engine"
        subtitle="AI-powered load assignment system"
      />

      {/* ===== STAT CARDS ===== */}
      <section className="stats-grid">
        <StatCard
          label="Loads Assigned Automatically"
          value="38"
          icon={FiCheckCircle}
          variant="green"
        />
        <StatCard
          label="Unassigned Loads"
          value="5"
          icon={FiPackage}
          variant="orange"
        />
        <StatCard
          label="Available Drivers"
          value="18"
          icon={FiUsers}
          variant="default"
        />
        <StatCard
          label="Unavailable Drivers"
          value="6"
          icon={FiUserX}
          variant="red"
        />
      </section>

      {/* ===== RECENT ASSIGNMENTS TABLE ===== */}
      <section className="card panel">
        <div className="panel-header">
          <h2 className="section-title">Recent Assignments</h2>
          <p className="panel-subtitle">Click on any row to see assignment reasoning</p>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Assigned Driver</th>
                <th>Assignment Score</th>
                <th>Fatigue Impact</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {ASSIGNMENTS_DATA.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    No assignments available
                  </td>
                </tr>
              ) : (
                ASSIGNMENTS_DATA.map((assignment) => (
                  <tr 
                    key={assignment.loadId} 
                    style={{ cursor: "pointer" }}
                    onClick={() => alert(`Viewing assignment reasoning for ${assignment.loadId}`)}
                  >
                    <td style={{ fontWeight: 500 }}>{assignment.loadId}</td>
                    <td>{assignment.driver}</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#d97706", fontSize: "16px" }}>🏆</span>
                        {assignment.score}
                      </span>
                    </td>
                    <td>
                      <FatiguePill label={assignment.fatigue} />
                    </td>
                    <td>
                      <StatusBadge label={assignment.status} />
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

export default AutoAssignment;