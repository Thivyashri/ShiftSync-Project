import React, { useState, useEffect, useCallback } from "react";
import {
  FiClock, FiPackage, FiActivity, FiMapPin, FiLogOut, FiKey,
  FiRefreshCw, FiAlertCircle, FiCheckCircle, FiX, FiInfo
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import {
  getDriverDashboard,
  checkInDriver,
  checkOutDriver,
  completeLoad
} from "../services/driverService";

function DriverDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [completeLoadingId, setCompleteLoadingId] = useState(null);
  
  // ✅ NEW: Modal state for load details
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("driverId");
    localStorage.removeItem("driverData");
    navigate("/");
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDriverDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (userRole !== "DRIVER" || !token) {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      await checkInDriver();
      await fetchDashboardData();
    } catch (err) {
      console.error("Check-in error:", err);
      setActionError(err.response?.data?.message || "Check-in failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      await checkOutDriver();
      await fetchDashboardData();
    } catch (err) {
      console.error("Check-out error:", err);
      setActionError(err.response?.data?.message || "Check-out failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate("/driver/reset-password");
  };

  const handleCompleteLoad = async (assignment) => {
    try {
      setActionError("");

      const loadId = assignment?.loadId;
      if (!loadId) {
        setActionError("LoadId not found in assignments data. Please add loadId in the dashboard API response.");
        return;
      }

      setCompleteLoadingId(loadId);

      await completeLoad(loadId);

      setDashboardData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          assignments: (prev.assignments || []).map(a =>
            a.loadId === loadId ? { ...a, status: "COMPLETED" } : a
          )
        };
      });

      await fetchDashboardData();

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to mark as completed.";

      setActionError(msg);

    } finally {
      setCompleteLoadingId(null);
    }
  };

  // ✅ NEW: Handle view details
  const handleViewDetails = (assignment) => {
    setSelectedLoad(assignment);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedLoad(null);
  };

  const isCheckedIn = dashboardData?.todayAttendance?.checkInTime && !dashboardData?.todayAttendance?.checkOutTime;
  const hasCheckedOut = dashboardData?.todayAttendance?.checkInTime && dashboardData?.todayAttendance?.checkOutTime;

  const formatTotalHours = (hoursDecimal) => {
  if (hoursDecimal == null) return "0h 0m";

  const hours = Math.floor(hoursDecimal);
  const minutes = Math.round((hoursDecimal - hours) * 60);

  return `${hours}h ${minutes}m`;
};

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const getStatusStyle = (status) => {
    const upperStatus = status?.toUpperCase() || "";
    if (upperStatus === "COMPLETED" || upperStatus === "COMPLETE") {
      return { background: "#d1fae5", color: "#065f46" };
    } else if (upperStatus === "IN_PROGRESS" || upperStatus === "IN PROGRESS" || upperStatus === "INPROGRESS") {
      return { background: "#dbeafe", color: "#1e40af" };
    } else {
      return { background: "#fef3c7", color: "#92400e" };
    }
  };

  const getPriorityStyle = (priority) => {
    const upperPriority = priority?.toUpperCase() || "";
    if (upperPriority === "HIGH" || upperPriority === "URGENT") {
      return { background: "#fee2e2", color: "#991b1b" };
    } else if (upperPriority === "MEDIUM") {
      return { background: "#fef3c7", color: "#92400e" };
    } else {
      return { background: "#e0e7ff", color: "#3730a3" };
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        height: "100vh", gap: "16px", backgroundColor: "#f9fafb"
      }}>
        <div style={{
          width: "48px", height: "48px", border: "4px solid #e5e7eb",
          borderTopColor: "#3b82f6", borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontSize: "16px", color: "#6b7280" }}>Loading your dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        height: "100vh", gap: "20px", padding: "24px", backgroundColor: "#f9fafb"
      }}>
        <div style={{
          width: "64px", height: "64px", background: "#fee2e2", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#dc2626", fontSize: "28px"
        }}>
          <FiAlertCircle />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>
          Something went wrong
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "center", maxWidth: "400px", margin: 0 }}>
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
            background: "#111827", color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "14px", fontWeight: "500", cursor: "pointer"
          }}
        >
          <FiRefreshCw />
          Try Again
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px", background: "none", color: "#6b7280", border: "none",
            fontSize: "14px", cursor: "pointer", textDecoration: "underline"
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  const driverName = dashboardData?.name || "Driver";
  const fatigueScore = dashboardData?.fatigueScore || 0;
  const vehicleType = dashboardData?.vehicleType || "N/A";
  const weeklyOff = dashboardData?.weeklyOff || "N/A";
  const region = dashboardData?.region || "N/A";
  const attendance = dashboardData?.todayAttendance;
  const assignments = dashboardData?.assignments || [];

  const renderAssignments = () => {
    if (assignments.length === 0) {
      return (
        <p style={{ fontSize: "14px", color: "#9ca3af", textAlign: "center", padding: "16px" }}>
          No assignments for today
        </p>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {assignments.map((assignment) => {
          // ✅ Access nested LoadDetails object
          const loadDetails = assignment.loadDetails;
          const statusUpper = (assignment.status || "").toUpperCase();
          const canComplete = statusUpper === "ASSIGNED";
          const loadId = loadDetails?.loadId;
          const isCompleting = completeLoadingId && loadId && completeLoadingId === loadId;

          return (
            <div
              key={assignment.assignmentId ?? loadDetails?.loadRef}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "8px",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                {loadDetails?.loadRef || "N/A"}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    ...getStatusStyle(assignment.status)
                  }}
                >
                  {assignment.status}
                </span>

                {/* ✅ View Details Button - only show if loadDetails exists */}
                {loadDetails && (
                  <button
                    onClick={() => handleViewDetails(loadDetails)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      cursor: "pointer",
                      background: "#fff",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#9ca3af";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    title="View load details"
                  >
                    <FiInfo />
                    Details
                  </button>
                )}

                {canComplete && loadDetails && (
                  <button
                    onClick={() => handleCompleteLoad({ ...assignment, loadId: loadDetails.loadId })}
                    disabled={!!isCompleting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: isCompleting ? "not-allowed" : "pointer",
                      background: isCompleting ? "#9ca3af" : "#111827",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                    title="Mark this load as completed"
                  >
                    <FiCheckCircle />
                    {isCompleting ? "Updating..." : "Completed"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: "16px", maxWidth: "1400px", margin: "0 auto", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 0", marginBottom: "20px", borderBottom: "2px solid #e5e7eb",
        flexWrap: "wrap", gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
         <div style={{
  width: "36px", height: "36px", borderRadius: "8px", background: "#111827",
  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
}}>
  <img src="/truck.png" alt="truck" style={{ width: "24px", height: "24px" }} />
</div>
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>ShiftSync</span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleResetPassword}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
              background: "none", border: "1px solid #e5e7eb", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px", color: "#374151", transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FiKey size={14} />
            <span>Reset Password</span>
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
              background: "none", border: "1px solid #fecaca", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px", color: "#dc2626", transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Welcome Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: "0 0 6px 0" }}>
          Welcome back, {driverName}!
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
          background: "#fee2e2", borderRadius: "8px", marginBottom: "20px", border: "1px solid #fecaca"
        }}>
          <FiAlertCircle style={{ color: "#dc2626", flexShrink: 0 }} />
          <p style={{ color: "#991b1b", fontSize: "14px", margin: 0, flex: 1 }}>{actionError}</p>
          <button
            onClick={() => setActionError("")}
            style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: "18px" }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <StatCard 
  label="Vehicle Type" 
  value={vehicleType} 
  icon={() => <img src="/truck.png" alt="truck" style={{ width: "24px", height: "24px" }} />} 
  variant="default" 
/>

        <StatCard label="Region" value={region} icon={FiMapPin} variant="blue" />
        <StatCard label="Weekly Off" value={weeklyOff} icon={FiClock} variant="default" />
        <StatCard
          label="Fatigue Score"
          value={`${parseFloat(fatigueScore).toFixed(1)}/100`}
          icon={FiActivity}
          variant={fatigueScore > 7 ? "red" : fatigueScore > 5 ? "yellow" : "green"}
        />
      </section>

      {/* Main Content based on check-in state */}
      {!isCheckedIn && !hasCheckedOut ? (
        <section>
          <div style={{
            textAlign: "center", padding: "40px 24px", background: "#fff",
            borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              width: "72px", height: "72px", margin: "0 auto 20px", background: "#dbeafe",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", color: "#3b82f6"
            }}>
              <FiClock />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
              Ready to Start Your Shift?
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px", maxWidth: "360px", margin: "0 auto 28px" }}>
              Click below to check in and begin your working day.
            </p>
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              style={{
                padding: "14px 40px", background: actionLoading ? "#9ca3af" : "#111827",
                color: "#fff", border: "none", borderRadius: "8px",
                fontSize: "15px", fontWeight: "600",
                cursor: actionLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s", display: "flex", alignItems: "center",
                gap: "8px", margin: "0 auto"
              }}
            >
              {actionLoading ? (
                <>
                  <FiRefreshCw style={{ animation: "spin 1s linear infinite" }} />
                  Processing...
                </>
              ) : (
                "Check In Now"
              )}
            </button>
          </div>
        </section>
      ) : hasCheckedOut ? (
        <section>
          <div style={{
            textAlign: "center", padding: "40px 24px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "12px", color: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "8px" }}>
              Shift Completed!
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
              Great work today! You worked for <strong>{formatTotalHours(attendance?.totalHours)}</strong>
            </p>
            <p style={{ fontSize: "12px", opacity: 0.8 }}>
              Check-in: {formatTime(attendance?.checkInTime)} | Check-out: {formatTime(attendance?.checkOutTime)}
            </p>
          </div>

          <div style={{
            background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              padding: "14px 16px", borderBottom: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <FiPackage style={{ color: "#3b82f6" }} />
              <h2 style={{ fontSize: "16px", fontWeight: "600", margin: 0, color: "#111827" }}>Today's Assignments</h2>
            </div>
            <div style={{ padding: "16px" }}>
              {renderAssignments()}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section style={{ marginBottom: "20px" }}>
            <div style={{
              textAlign: "center", padding: "28px 20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px", color: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px" }}>
                You're Checked In!
              </h2>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "18px" }}>
                Working for <strong>{formatTotalHours(attendance?.totalHours)}
</strong> today
              </p>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                style={{
                  padding: "12px 36px", background: "#fff", color: "#667eea",
                  border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s", display: "flex", alignItems: "center",
                  gap: "8px", margin: "0 auto"
                }}
              >
                {actionLoading ? (
                  <>
                    <FiRefreshCw style={{ animation: "spin 1s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  "Check Out"
                )}
              </button>
              <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "14px" }}>
                Checked in at: {formatTime(attendance?.checkInTime)}
              </p>
            </div>
          </section>

          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px"
          }}>
            <div style={{
              background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                padding: "14px 16px", borderBottom: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <FiPackage style={{ color: "#3b82f6" }} />
                <h2 style={{ fontSize: "16px", fontWeight: "600", margin: 0, color: "#111827" }}>Today's Assignments</h2>
              </div>
              <div style={{ padding: "16px" }}>
                {renderAssignments()}
              </div>
            </div>

            <div style={{
              background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                padding: "14px 16px", borderBottom: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <FiActivity style={{ color: "#f59e0b" }} />
                <h2 style={{ fontSize: "16px", fontWeight: "600", margin: 0, color: "#111827" }}>Working Hours</h2>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ textAlign: "center", padding: "14px", background: "#f9fafb", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", fontWeight: "600" }}>
                      Check In
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                      {formatTime(attendance?.checkInTime)}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", padding: "14px", background: "#f9fafb", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", fontWeight: "600" }}>
                      Check Out
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                      {formatTime(attendance?.checkOutTime)}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", padding: "14px", background: "#d1fae5", borderRadius: "8px", gridColumn: "span 2" }}>
                    <p style={{ fontSize: "11px", color: "#065f46", marginBottom: "4px", textTransform: "uppercase", fontWeight: "600" }}>
                      Hours Worked
                    </p>
                    <p style={{ fontSize: "22px", fontWeight: "600", color: "#047857", margin: 0 }}>
                      {formatTotalHours(attendance?.totalHours)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ✅ NEW: Load Details Modal */}
      {showDetailsModal && selectedLoad && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px"
          }}
          onClick={closeDetailsModal}
        >
          <div
            style={{
              background: "#ffffffff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "20px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3b82f6",
                  fontSize: "20px"
                }}>
                  <FiPackage />
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    Load Details
                  </h2>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: "2px 0 0 0" }}>
                    {selectedLoad.loadRef}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#f3f4f6",
                  color: "#6b7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#e5e7eb";
                  e.currentTarget.style.color = "#374151";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                {/* Load ID */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Load ID
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.loadId || "N/A"}
                  </p>
                </div>

                {/* Load Reference */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Load Reference
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.loadRef || "N/A"}
                  </p>
                </div>

                {/* Region */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Region
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.region || "N/A"}
                  </p>
                </div>

                {/* Stops */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Stops
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.stops || "N/A"}
                  </p>
                </div>

                {/* Estimated Hours */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Estimated Hours
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.estimatedHours ? `${selectedLoad.estimatedHours} hrs` : "N/A"}
                  </p>
                </div>

                {/* Estimated Distance */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Estimated Distance
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {selectedLoad.estimatedDistance ? `${selectedLoad.estimatedDistance} km` : "N/A"}
                  </p>
                </div>

                {/* Priority */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Priority
                  </p>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    display: "inline-block",
                    ...getPriorityStyle(selectedLoad.priority)
                  }}>
                    {selectedLoad.priority || "N/A"}
                  </span>
                </div>

                {/* Status */}
                <div style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>
                    Status
                  </p>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    display: "inline-block",
                    ...getStatusStyle(selectedLoad.status)
                  }}>
                    {selectedLoad.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={closeDetailsModal}
                style={{
                  padding: "10px 24px",
                  background: "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#374151";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#111827";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default DriverDashboard;