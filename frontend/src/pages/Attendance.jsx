// src/pages/Attendance.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import { StatusBadge } from "../components/Badges";
import { getAttendance, getAttendanceStats } from "../services/attendanceService";
import { getAllDrivers } from "../services/adminDriverService";

const STATUS_OPTIONS = ["All", "Present", "Absent", "Late", "Missing Checkout"];
const DATE_PRESETS = ["Today", "Yesterday", "Last 7 Days", "All Dates", "Custom"];

// Helper to format date for input
function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// compute worked hours from timestamps, rounded to 1 decimal
function computeHours(checkInTime, checkOutTime) {
  if (!checkInTime || !checkOutTime) return "-";
  const start = new Date(checkInTime);
  const end = new Date(checkOutTime);
  const diffMs = end.getTime() - start.getTime();
  if (isNaN(diffMs) || diffMs <= 0) return "-";
  const hours = diffMs / (1000 * 60 * 60);
  return hours.toFixed(1);
}

function Attendance() {
  const [rows, setRows] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [datePreset, setDatePreset] = useState("Today");
  const [customDate, setCustomDate] = useState(formatDateForInput(new Date()));

  // Helper to check if date matches filter
  const matchesDateFilter = (recordDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recDate = new Date(recordDate);
    recDate.setHours(0, 0, 0, 0);

    switch (datePreset) {
      case "Today":
        return recDate.getTime() === today.getTime();
      case "Yesterday":
        return recDate.getTime() === yesterday.getTime();
      case "Last 7 Days":
        return recDate >= sevenDaysAgo && recDate <= today;
      case "Custom":
        const selectedDate = new Date(customDate);
        selectedDate.setHours(0, 0, 0, 0);
        return recDate.getTime() === selectedDate.getTime();
      case "All Dates":
      default:
        return true;
    }
  };

  const clearFilters = () => {
    setRegion("All");
    setStatusFilter("All");
    setDatePreset("Today");
    setCustomDate(formatDateForInput(new Date()));
  };

  // Get display label for current date filter
  const getDateDisplayLabel = () => {
    if (datePreset === "Custom") {
      return new Date(customDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return datePreset;
  };

  async function loadData() {
    setLoading(true);
    try {
      const [attRes, statsRes, driversRes] = await Promise.all([
        getAttendance(),
        getAttendanceStats(),
        getAllDrivers({ status: "ACTIVE" }),
      ]);
      setRows(attRes.data);
      setStats(statsRes.data);
      setAllDrivers(driversRes.data || []);
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Build region options from drivers data
  const regionOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        allDrivers
          .map((d) => (d.region || "").trim())
          .filter((v) => v.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...unique];
  }, [allDrivers]);

  // Get the target date for absent driver calculation
  const getTargetDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (datePreset) {
      case "Today":
        return today;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      case "Custom":
        const custom = new Date(customDate);
        custom.setHours(0, 0, 0, 0);
        return custom;
      default:
        return null; // For "Last 7 Days" and "All Dates", we don't add absent drivers
    }
  };

  // Combine attendance records with absent drivers
  const combinedRows = useMemo(() => {
    // Filter attendance by date first
    const attendanceForDate = rows.filter(r => matchesDateFilter(r.date));

    // For single-date views, add absent drivers
    const targetDate = getTargetDate();
    if (targetDate && (datePreset === "Today" || datePreset === "Yesterday" || datePreset === "Custom")) {
      const presentDriverIds = new Set(attendanceForDate.map(r => r.driverId));

      // Create absent records for drivers not in attendance
      const absentDrivers = allDrivers
        .filter(d => !presentDriverIds.has(d.driverId))
        .map(d => ({
          attendanceId: `absent-${d.driverId}`,
          driverId: d.driverId,
          driverName: d.name,
          region: d.region,
          date: targetDate.toISOString(),
          checkInTime: null,
          checkOutTime: null,
          totalHours: 0,
          isAbsent: true,
          isOvertime: false,
          overtimeApproved: null,
          status: "Absent",
        }));

      return [...attendanceForDate, ...absentDrivers];
    }

    return attendanceForDate;
  }, [rows, allDrivers, datePreset, customDate]);

  const filteredRows = combinedRows.filter((r) => {
    if (region !== "All" && r.region !== region) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  // Calculate stats from combined rows
  const displayStats = useMemo(() => {
    const presentDrivers = combinedRows.filter(r =>
      r.status === "Present" || r.status === "Late" || r.status === "Missing Checkout"
    );
    const absentDrivers = combinedRows.filter(r => r.status === "Absent");
    const uniquePresentDrivers = [...new Set(presentDrivers.map(r => r.driverId))];
    const uniqueAbsentDrivers = [...new Set(absentDrivers.map(r => r.driverId))];

    return {
      totalDrivers: allDrivers.length || stats?.totalDrivers || 14,
      presentCount: uniquePresentDrivers.length,
      absentCount: uniqueAbsentDrivers.length,
      lateCheckIns: combinedRows.filter(r => r.status === "Late").length,
      missingCheckOuts: combinedRows.filter(r => r.status === "Missing Checkout").length,
    };
  }, [combinedRows, allDrivers, stats]);

  return (
    <>
      <PageHeader
        title="Attendance & Availability"
        subtitle="Monitor driver attendance and work hours"
        rightSlot={
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            {/* Date Preset filter */}
            <div className="filter-dropdown">
              <span className="filter-label">Date</span>
              <select
                className="filter-control"
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
              >
                {DATE_PRESETS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Calendar picker - shown when Custom is selected */}
            {datePreset === "Custom" && (
              <div className="filter-dropdown">
                <span className="filter-label">Select Date</span>
                <input
                  type="date"
                  className="filter-control"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  style={{ padding: "6px 12px", minWidth: "150px" }}
                />
              </div>
            )}

            {/* Region filter */}
            <div className="filter-dropdown">
              <span className="filter-label">Region</span>
              <select
                className="filter-control"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {regionOptions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="filter-dropdown">
              <span className="filter-label">Status</span>
              <select
                className="filter-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters button */}
            <button
              className="btn-secondary"
              onClick={clearFilters}
              style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "18px" }}
            >
              <FiRefreshCw size={14} />
              Clear Filters
            </button>
          </div>
        }
      />

      {/* Stats cards */}
      <section className="stats-grid">
        <StatCard
          label="Present Drivers"
          value={displayStats ? displayStats.presentCount : "-"}
          icon={FiCheckCircle}
          variant="green"
        />
        <StatCard
          label="Absent"
          value={displayStats ? displayStats.absentCount : "-"}
          icon={FiXCircle}
          variant="red"
        />
        <StatCard
          label="Late Check-ins"
          value={displayStats ? displayStats.lateCheckIns : "-"}
          icon={FiClock}
          variant="orange"
        />
        <StatCard
          label="Missing Check-outs"
          value={displayStats ? displayStats.missingCheckOuts : "-"}
          icon={FiAlertCircle}
          variant="orange"
        />
      </section>

      {/* Table */}
      <section className="content-full">
        <div className="card panel" style={{ width: "100%" }}>
          <div className="panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="section-title">Attendance Records</h2>
            <span className="card-label">
              Showing: {getDateDisplayLabel()} | {filteredRows.length} records
            </span>
          </div>

          <div
            className="table-wrapper"
            style={{ width: "100%", overflowX: "auto" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : filteredRows.length === 0 ? (
              <p>No attendance records found.</p>
            ) : (
              <table className="table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Region</th>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th>Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((record) => (
                    <tr key={record.attendanceId}>
                      <td>{record.driverName}</td>
                      <td>{record.region}</td>
                      <td>
                        {new Date(record.date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td
                        style={
                          record.status === "Late"
                            ? { color: "#f97316", fontWeight: 500 }
                            : {}
                        }
                      >
                        {formatTime(record.checkInTime)}
                      </td>
                      <td>{formatTime(record.checkOutTime)}</td>
                      <td>
                        {computeHours(
                          record.checkInTime,
                          record.checkOutTime
                        )}
                      </td>
                      <td>
                        <StatusBadge
                          label={record.status}
                          tone={
                            record.status === "Present"
                              ? "dark"
                              : record.status === "Absent"
                              ? "red"
                              : record.status === "Late"
                              ? "gray"
                              : "red"
                          }
                        />
                      </td>
                      <td>
                        {record.isOvertime ? (
                          record.overtimeApproved === null ? (
                            <span
                              style={{
                                color: "#facc15",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              Pending
                            </span>
                          ) : record.overtimeApproved ? (
                            <span
                              style={{
                                color: "#10b981",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              Approved
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#ef4444",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              Rejected
                            </span>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Attendance;
