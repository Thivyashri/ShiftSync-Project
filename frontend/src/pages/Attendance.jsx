import React from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiEdit2 } from "react-icons/fi";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/Badges";

const ATTENDANCE_DATA = [
  {
    id: 1,
    driver: "Arjun Kumar",
    shiftTime: "08:00 - 17:00",
    checkIn: "08:05",
    checkOut: "17:10",
    totalHours: "9.0",
    status: { label: "Present", tone: "dark" },
    overtimeApproval: null,
    isLate: false,
  },
  {
    id: 2,
    driver: "Priya Ramesh",
    shiftTime: "09:00 - 18:00",
    checkIn: "09:15",
    checkOut: "18:30",
    totalHours: "9.3",
    status: { label: "Late", tone: "gray" },
    overtimeApproval: "Approve",
    isLate: true,
  },
  {
    id: 3,
    driver: "Karthik Raj",
    shiftTime: "07:00 - 16:00",
    checkIn: "06:55",
    checkOut: "16:05",
    totalHours: "9.2",
    status: { label: "Present", tone: "dark" },
    overtimeApproval: null,
    isLate: false,
  },
  {
    id: 4,
    driver: "Meena Lakshmi",
    shiftTime: "10:00 - 19:00",
    checkIn: "10:00",
    checkOut: "-",
    totalHours: "-",
    status: { label: "Missing Checkout", tone: "red" },
    overtimeApproval: null,
    isLate: false,
  },
  {
    id: 5,
    driver: "Ravi Shankar",
    shiftTime: "08:00 - 17:00",
    checkIn: "-",
    checkOut: "-",
    totalHours: "-",
    status: { label: "Absent", tone: "red" },
    overtimeApproval: null,
    isLate: false,
  },
];

function Attendance() {
  return (
    <>
      <PageHeader
        title="Attendance & Availability"
        subtitle="Monitor driver attendance and work hours"
      />

      {/* --- Stats Row --- */}
      <section className="stats-grid">
        <StatCard label="Present Drivers" value="22" icon={FiCheckCircle} variant="green" />
        <StatCard label="Absent" value="2" icon={FiXCircle} variant="red" />
        <StatCard label="Late Check-ins" value="3" icon={FiClock} variant="orange" />
        <StatCard label="Missing Check-outs" value="1" icon={FiAlertCircle} variant="orange" />
      </section>

      {/* -------- FULL WIDTH TABLE -------- */}
      <section className="content-full">
        <div className="card panel" style={{ width: "100%" }}>
          <div className="panel-header">
            <h2 className="section-title">Today's Attendance</h2>
            <span className="card-label">November 20, 2025</span>
          </div>

          <div className="table-wrapper" style={{ width: "100%", overflowX: "auto" }}>
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Shift Time</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Overtime Approval</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {ATTENDANCE_DATA.map((record) => (
                  <tr key={record.id}>
                    <td>{record.driver}</td>
                    <td>{record.shiftTime}</td>

                    <td style={record.isLate ? { color: "#f97316", fontWeight: 500 } : {}}>
                      {record.checkIn}
                    </td>

                    <td>{record.checkOut}</td>
                    <td>{record.totalHours}</td>

                    <td>
                      <StatusBadge label={record.status.label} tone={record.status.tone} />
                    </td>

                    <td>
                      {record.overtimeApproval ? (
                        <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 500 }}>
                          ✓ {record.overtimeApproval}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#6b7280",
                          cursor: "pointer",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                        }}
                        aria-label="Edit"
                      >
                        <FiEdit2 style={{ fontSize: "18px" }} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Attendance;