import React, { useState } from "react";
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiUsers } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const DRIVER_DATA = [
  {
    driver: "Driver A",
    avgHours: 9.2,
    heavyShifts: 6,
    overtimeDays: 4,
    fatigueScore: 8.5,
    recommendation: "Rest required",
  },
  {
    driver: "Driver B",
    avgHours: 7.0,
    heavyShifts: 2,
    overtimeDays: 1,
    fatigueScore: 3.8,
    recommendation: "Good condition",
  },
  {
    driver: "Driver C",
    avgHours: 8.5,
    heavyShifts: 5,
    overtimeDays: 3,
    fatigueScore: 6.2,
    recommendation: "Monitor closely",
  },
  {
    driver: "Driver D",
    avgHours: 6.5,
    heavyShifts: 1,
    overtimeDays: 0,
    fatigueScore: 2.5,
    recommendation: "Good condition",
  },
  {
    driver: "Driver E",
    avgHours: 9.8,
    heavyShifts: 8,
    overtimeDays: 5,
    fatigueScore: 9.1,
    recommendation: "Rest required",
  },
];

function FatigueSafety() {
  const [viewMode, setViewMode] = useState("visual");

  const lowFatigueCount = DRIVER_DATA.filter(d => d.fatigueScore < 4).length;
  const mediumFatigueCount = DRIVER_DATA.filter(d => d.fatigueScore >= 4 && d.fatigueScore < 7).length;
  const highFatigueCount = DRIVER_DATA.filter(d => d.fatigueScore >= 7).length;
  const needRestCount = DRIVER_DATA.filter(d => d.recommendation === "Rest required").length;

  return (
    <>
      <PageHeader
        title="FATIGUE & SAFETY"
        subtitle="Monitor driver wellness"
      />

      <section className="stats-grid">
        <div className="card stats-card stats-card-default" style={{ backgroundColor: "#f0f0f0" }}>
          <div className="card-top">
            <span className="card-label">Low fatigue</span>
            <span className="card-icon-wrapper" style={{ backgroundColor: "#22c55e", color: "white" }}>
              <FiCheckCircle className="card-icon" />
            </span>
          </div>
          <div className="card-value">{lowFatigueCount}</div>
        </div>

        <div className="card stats-card stats-card-default" style={{ backgroundColor: "#f0f0f0" }}>
          <div className="card-top">
            <span className="card-label">Medium fatigue</span>
            <span className="card-icon-wrapper" style={{ backgroundColor: "#eab308", color: "white" }}>
              <FiAlertTriangle className="card-icon" />
            </span>
          </div>
          <div className="card-value">{mediumFatigueCount}</div>
        </div>

        <div className="card stats-card stats-card-default" style={{ backgroundColor: "#f0f0f0" }}>
          <div className="card-top">
            <span className="card-label">High fatigue</span>
            <span className="card-icon-wrapper" style={{ backgroundColor: "#ef4444", color: "white" }}>
              <FiAlertCircle className="card-icon" />
            </span>
          </div>
          <div className="card-value">{highFatigueCount}</div>
        </div>

        <div className="card stats-card stats-card-default" style={{ backgroundColor: "#f0f0f0" }}>
          <div className="card-top">
            <span className="card-label">Drivers needing rest</span>
            <span className="card-icon-wrapper" style={{ backgroundColor: "#6b7280", color: "white" }}>
              <FiUsers className="card-icon" />
            </span>
          </div>
          <div className="card-value">{needRestCount}</div>
        </div>
      </section>

      <section style={{ width: "100%" }}>
        <div className="card panel">
          <div className="panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="viewMode"
                  checked={viewMode === "visual"}
                  onChange={() => setViewMode("visual")}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.95rem", fontWeight: viewMode === "visual" ? "600" : "400" }}>
                  Visual
                </span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="viewMode"
                  checked={viewMode === "table"}
                  onChange={() => setViewMode("table")}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.95rem", fontWeight: viewMode === "table" ? "600" : "400" }}>
                  Table
                </span>
              </label>
            </div>
          </div>

          {viewMode === "visual" ? (
            <div style={{ padding: "2rem 1rem", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "3rem", minHeight: "400px" }}>
              {DRIVER_DATA.map((driver) => {
                let barColor = "#22c55e";
                if (driver.fatigueScore >= 7) barColor = "#ef4444";
                else if (driver.fatigueScore >= 4) barColor = "#eab308";

                const barHeight = (driver.fatigueScore / 10) * 300;

                return (
                  <div key={driver.driver} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "300px" }}>
                      <div
                        style={{
                          width: "60px",
                          height: `${barHeight}px`,
                          backgroundColor: barColor,
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s ease",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "-1.5rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          {driver.fatigueScore}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
                      {driver.driver}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Average hours</th>
                    <th>Heavy shifts</th>
                    <th>Over-time days</th>
                    <th>Fatigue score</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {DRIVER_DATA.map((driver) => (
                    <tr key={driver.driver}>
                      <td>{driver.driver}</td>
                      <td>{driver.avgHours}</td>
                      <td>{driver.heavyShifts}</td>
                      <td>{driver.overtimeDays}</td>
                      <td>{driver.fatigueScore}</td>
                      <td>{driver.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default FatigueSafety;