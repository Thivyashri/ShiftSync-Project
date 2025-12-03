import React from "react";
import { FiUsers, FiTruck, FiAlertTriangle } from "react-icons/fi";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import { StatusBadge, FatiguePill } from "../components/Badges";

const ASSIGNMENTS = [
  {
    id: "LD-2401",
    driver: "Arjun Kumar",
    area: "T Nagar",
    status: { label: "In Transit", tone: "blue" },
    fatigue: "Low",
  },
  {
    id: "LD-2402",
    driver: "Priya Ramesh",
    area: "Tambaram",
    status: { label: "Assigned", tone: "gray" },
    fatigue: "Medium",
  },
  {
    id: "LD-2403",
    driver: "Karthik Raj",
    area: "Velachery",
    status: { label: "In Transit", tone: "blue" },
    fatigue: "Low",
  },
  {
    id: "LD-2404",
    driver: "Meena Lakshmi",
    area: "Anna Nagar",
    status: { label: "Completed", tone: "dark" },
    fatigue: "High",
  },
  {
    id: "LD-2405",
    driver: "Ravi Shankar",
    area: "Coimbatore",
    status: { label: "In Transit", tone: "blue" },
    fatigue: "Medium",
  },
  {
    id: "LD-2406",
    driver: "Divya Narayanan",
    area: "Madurai",
    status: { label: "Assigned", tone: "gray" },
    fatigue: "Low",
  },
];

const ALERTS = [
  {
    id: 1,
    title: "Lakshmi - High fatigue detected (8.5/10)",
    time: "10 min ago",
    level: "high",
  },
  {
    id: 2,
    title: "Sanjay Iyer - Approaching limit (7.2/10)",
    time: "25 min ago",
    level: "medium",
  },
];

function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor your logistics operations in real-time"
      />
      <section className="stats-grid">
        <StatCard
          label="Active Drivers"
          value="24"
          icon={FiUsers}
          variant="default"
        />
        <StatCard
          label="Pending Loads"
          value="12"
          icon={FiTruck}
          variant="orange"
        />
        <StatCard
          label="Assigned Loads"
          value="38"
          icon={FiTruck}
          variant="green"
        />
        <StatCard
          label="High Fatigue Drivers"
          value="3"
          icon={FiAlertTriangle}
          variant="red"
        />
      </section>

      <section className="content-grid">
        <div className="card panel">
          <div className="panel-header">
            <h2 className="section-title">Current Assignments</h2>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Load ID</th>
                  <th>Driver</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Fatigue Impact</th>
                </tr>
              </thead>

              <tbody>
                {ASSIGNMENTS.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.driver}</td>
                    <td>{item.area}</td>
                    <td>
                      <StatusBadge
                        label={item.status.label}
                        tone={item.status.tone}
                      />
                    </td>
                    <td>
                      <FatiguePill label={item.fatigue} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card panel alerts-panel">
          <div className="panel-header">
            <h2 className="section-title">Alerts Panel</h2>
          </div>

          {ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card alert-${
                alert.level === "high" ? "high" : "medium"
              }`}
            >
              <div className="alert-icon">
                <FiAlertTriangle />
              </div>

              <div className="alert-content">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-time">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;
