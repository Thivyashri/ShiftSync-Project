import React, { useState } from "react";
import { FiClock, FiPackage, FiActivity, FiMapPin, FiNavigation, FiLogOut, FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";

const LOAD_DETAILS = {
  loadId: "LD-2401",
  totalPackages: 45,
  distance: "120 km",
  area: "North Zone",
  status: "In Transit",
};

const ROUTE_INFO = {
  pickup: "123 Warehouse St, Industrial Park",
  delivery: "456 Distribution Center Ave",
  estimatedArrival: "2:30 PM",
};

const WORKING_HOURS = {
  checkIn: "08:05 AM",
  currentTime: "12:35 PM",
  hoursWorked: "4.5h",
  remaining: "3.5h",
};

function DriverDashboard() {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Top Bar with Logo and Logout */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        marginBottom: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#020202ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '20px'
          }}>
            <FiTruck />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>ShiftSync</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'none',
            border: '1px solid #ebe7e5ff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#ee300eff'
          }}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>

      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
          Welcome back, John Smith!
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Here's your dashboard for today
        </p>
      </div>

      {/* Stats Cards */}
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard
          label="Today's Shift"
          value="08:00 AM - 05:00 PM"
          icon={FiClock}
          variant="default"
        />
        <StatCard
          label="Assigned Load"
          value="LD-2401"
          icon={FiPackage}
          variant="green"
        />
        <StatCard
          label="Fatigue Score"
          value="3.2/10"
          icon={FiActivity}
          variant="green"
        />
      </section>

      {!isCheckedIn ? (
        /* Before Check-in */
        <section style={{ marginTop: '32px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              Ready to Start Your Shift?
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
              Click below to check in and begin your working day
            </p>
            <button
              onClick={handleCheckIn}
              style={{
                padding: '14px 48px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              Check In
            </button>
          </div>
        </section>
      ) : (
        /* After Check-in */
        <>
          {/* Check Out Section */}
          <section style={{ marginTop: '32px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Ready to End Your Shift?
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                Click below to check out and end your working day
              </p>
              <button
                onClick={handleCheckOut}
                style={{
                  padding: '12px 40px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Check Out
              </button>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
                Working hours today: 4.5 hours
              </p>
            </div>
          </section>

          {/* Load Details and Route Summary */}
          <section className="content-grid" style={{ marginTop: '24px' }}>
            <div className="card panel">
              <div className="panel-header">
                <h2 className="section-title">Load Details</h2>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Load ID</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{LOAD_DETAILS.loadId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Packages</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{LOAD_DETAILS.totalPackages}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Distance</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{LOAD_DETAILS.distance}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Area</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{LOAD_DETAILS.area}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status</span>
                    <span className="badge badge-status badge-status-blue">{LOAD_DETAILS.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card panel">
              <div className="panel-header">
                <h2 className="section-title">Route Summary</h2>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  padding: '12px', 
                  background: '#d1fae5', 
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <FiMapPin style={{ fontSize: '18px', color: '#059669', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#065f46', marginBottom: '4px' }}>Pickup Location</div>
                    <div style={{ fontSize: '13px', color: '#047857' }}>{ROUTE_INFO.pickup}</div>
                  </div>
                </div>

                <div style={{ 
                  padding: '12px', 
                  background: '#dbeafe', 
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <FiNavigation style={{ fontSize: '18px', color: '#1d4ed8', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a', marginBottom: '4px' }}>Delivery Location</div>
                    <div style={{ fontSize: '13px', color: '#1e40af' }}>{ROUTE_INFO.delivery}</div>
                  </div>
                </div>

                <div style={{ 
                  padding: '12px', 
                  background: '#fce7f3', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#9f1239' }}>Estimated Arrival</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#be123c' }}>{ROUTE_INFO.estimatedArrival}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Working Hours */}
          <section style={{ marginTop: '24px' }}>
            <div className="card panel">
              <div className="panel-header">
                <h2 className="section-title">Today's Working Hours</h2>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Check-In</th>
                      <th>Current Time</th>
                      <th>Hours Worked</th>
                      <th>Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{WORKING_HOURS.checkIn}</td>
                      <td>{WORKING_HOURS.currentTime}</td>
                      <td>{WORKING_HOURS.hoursWorked}</td>
                      <td>{WORKING_HOURS.remaining}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Live Status */}
          <section style={{ marginTop: '24px' }}>
            <div className="card panel">
              <div className="panel-header">
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: '#10b981', 
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                  Live Status
                </h2>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  padding: '12px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#166534' }}>Currently driving to delivery location</span>
                  <span className="badge badge-status badge-status-dark">Active</span>
                </div>

                <div style={{ 
                  padding: '12px', 
                  background: '#eff6ff', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#1e40af' }}>GPS tracking enabled</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#10b981' }}>Connected</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default DriverDashboard;