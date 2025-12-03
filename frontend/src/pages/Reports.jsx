import React, { useState } from "react";
import { FiDownloadCloud } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import FilterDropdown from "../components/FilterDropdown";
import ReportTabs from "../components/ReportTabs";
import CountPill from "../components/CountPill";

const ATTENDANCE_ROWS = [
  { driver: "Arjun Kumar", present: 18, absent: 1, late: 2, hours: "144h" },
  { driver: "Priya Ramesh", present: 17, absent: 2, late: 3, hours: "136h" },
  { driver: "Karthik Raj", present: 19, absent: 0, late: 1, hours: "152h" },
  { driver: "Lakshmi", present: 16, absent: 2, late: 2, hours: "128h" },
  { driver: "Ravi Shankar", present: 18, absent: 1, late: 1, hours: "144h" },
];

function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="reports-page">
      <PageHeader
        title="Reports & History"
        subtitle="Analytics and historical data"
        rightSlot={
          <button className="btn-primary" type="button">
            <FiDownloadCloud className="btn-icon" />
            <span>Export Report</span>
          </button>
        }
      />

      <section className="card filters-card">
        <div className="filters-grid">
          <FilterDropdown label="Date Range" value="Last 30 Days" />
          <FilterDropdown label="Region" value="All Regions" />
        </div>
      </section>

      <section>
        <ReportTabs active={activeTab} onChange={setActiveTab} />
      </section>

      {activeTab === "attendance" && (
        <section className="card panel">
          <div className="panel-header">
            <h2 className="section-title">Attendance Report (Last 30 Days)</h2>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Days Present</th>
                  <th>Days Absent</th>
                  <th>Late Check-ins</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_ROWS.map((row) => (
                  <tr key={row.driver}>
                    <td>{row.driver}</td>
                    <td>
                      <CountPill value={row.present} variant="dark" />
                    </td>
                    <td>
                      <CountPill
                        value={row.absent}
                        variant={row.absent >= 2 ? "danger" : "light"}
                      />
                    </td>
                    <td>
                      <CountPill value={row.late} variant="muted" />
                    </td>
                    <td>{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab !== "attendance" && (
        <section className="card panel">
          <div className="panel-header">
            <h2 className="section-title">
              {activeTab === "load-history" && "Load History"}
              {activeTab === "fatigue-trends" && "Fatigue Trends"}
              {activeTab === "work-hours" && "Work Hours"}
            </h2>
            <p className="panel-subtitle">
              (Static placeholder – connect to real data later)
            </p>
          </div>
          <div className="panel-placeholder">
            Content for <strong>{activeTab}</strong> will go here.
          </div>
        </section>
      )}
    </div>
  );
}

export default Reports;