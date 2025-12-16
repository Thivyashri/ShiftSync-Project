import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiUpload, FiSearch, FiX } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { StatusBadge, FatiguePill } from "../components/Badges";
import { 
  getAllDrivers, 
  getDriverStats, 
  createDriver, 
  updateDriver, 
  updateDriverStatus,
  uploadDriverCsv,
  getRegions,
  getVehicleTypes,
  getWeeklyOffs
} from "../services/adminDriverService";

function DriverManagement() {
  // State management
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    highFatigueDrivers: 0
  });
  const [regions, setRegions] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    region: "",
    status: "",
    search: ""
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    region: "",
    vehicleType: "",
    weeklyOff: "",
    password: ""
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    phone: "",
    email: "",
    region: "",
    vehicleType: "",
    weeklyOff: "",
    password: ""
  });

  // Fetch data on mount and filter changes
  useEffect(() => {
    fetchDrivers();
    fetchStats();
    fetchRegions();
    fetchVehicleTypes();
    fetchWeeklyOffs();
  }, [filters]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await getAllDrivers(filters);
      setDrivers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch drivers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getDriverStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await getRegions();
      setRegions(response.data);
    } catch (err) {
      console.error("Failed to fetch regions:", err);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await getVehicleTypes();
      setVehicleTypes(response.data);
    } catch (err) {
      console.error("Failed to fetch vehicle types:", err);
    }
  };

  const fetchWeeklyOffs = async () => {
    try {
      const response = await getWeeklyOffs();
      setWeeklyOffs(response.data);
    } catch (err) {
      console.error("Failed to fetch weekly offs:", err);
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ region: "", status: "", search: "" });
  };

  // Validation functions
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMsg = "Name is required";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMsg = "Phone is required";
        } else if (!/^\d{10}$/.test(value.trim())) {
          errorMsg = "Phone must be exactly 10 digits";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMsg = "Email is required";
        } else if (!value.includes("@") || !value.includes(".com")) {
          errorMsg = "Email must contain @ and .com";
        }
        break;

      case "region":
        if (!value) {
          errorMsg = "Region is required";
        }
        break;

      case "vehicleType":
        if (!value) {
          errorMsg = "Vehicle type is required";
        }
        break;

      case "weeklyOff":
        if (!value) {
          errorMsg = "Weekly off is required";
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  const validateForm = () => {
    const errors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      region: validateField("region", formData.region),
      vehicleType: validateField("vehicleType", formData.vehicleType),
      weeklyOff: validateField("weeklyOff", formData.weeklyOff),
      password: ""
    };

    setValidationErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some(error => error !== "");
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user types
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      region: "",
      vehicleType: "",
      weeklyOff: "",
      password: ""
    });
    setValidationErrors({
      name: "",
      phone: "",
      email: "",
      region: "",
      vehicleType: "",
      weeklyOff: "",
      password: ""
    });
  };

  // CRUD Operations
  const handleAddDriver = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await createDriver(formData);
      setShowAddModal(false);
      resetForm();
      fetchDrivers();
      fetchStats();
      alert("Driver created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create driver");
    }
  };

  const handleEditDriver = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await updateDriver(selectedDriver.driverId, formData);
      setShowEditModal(false);
      resetForm();
      setSelectedDriver(null);
      fetchDrivers();
      alert("Driver updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update driver");
    }
  };

  const handleStatusToggle = async (driver) => {
    const newStatus = driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmMsg = newStatus === "INACTIVE" 
      ? `Are you sure you want to deactivate ${driver.name}?`
      : `Are you sure you want to activate ${driver.name}?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateDriverStatus(driver.driverId, newStatus);
      fetchDrivers();
      fetchStats();
    } catch (err) {
      if (err.response?.data?.warning) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update driver status");
      }
    }
  };

  // Modal handlers
  const openViewModal = (driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || "",
      region: driver.region,
      vehicleType: driver.vehicleType,
      weeklyOff: driver.weeklyOff,
      password: ""
    });
    setValidationErrors({
      name: "",
      phone: "",
      email: "",
      region: "",
      vehicleType: "",
      weeklyOff: "",
      password: ""
    });
    setShowEditModal(true);
  };

  // CSV Upload handler
  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    try {
      const response = await uploadDriverCsv(file);
      
      if (response.data.errors?.length > 0) {
        console.warn("CSV Errors:", response.data.errors);
        alert(`CSV uploaded with ${response.data.errors.length} errors. Check console for details.`);
      }
      if (response.data.duplicates?.length > 0) {
        console.warn("Duplicates:", response.data.duplicates);
        alert(`${response.data.duplicates.length} duplicate entries found and skipped.`);
      }
      
      fetchDrivers();
      fetchStats();
      e.target.value = '';
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload CSV");
    }
  };

  // Helper functions
  const getFatigueLabel = (score) => {
    if (score <= 40) return "Low";
    if (score <= 70) return "Medium";
    return "High";
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  if (loading && drivers.length === 0) {
    return <div className="loading">Loading drivers...</div>;
  }

  return (
    <>
      <PageHeader
        title="Driver Management"
        subtitle="Manage your driver workforce"
        rightSlot={
          <div style={{ display: "flex", gap: "12px" }}>
            <label className="btn-secondary" style={{ cursor: "pointer" }}>
              <FiUpload style={{ marginRight: "8px" }} />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                style={{ display: "none" }}
              />
            </label>
            <button 
              className="btn-primary" 
              type="button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Driver
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <StatCard label="Total Drivers" value={stats.totalDrivers} variant="default" />
        <StatCard label="Active Drivers" value={stats.activeDrivers} variant="success" />
        <StatCard label="Inactive Drivers" value={stats.inactiveDrivers} variant="gray" />
        <StatCard label="High Fatigue" value={stats.highFatigueDrivers} variant="danger" />
      </div>

      {/* Filters */}
      <section className="card filters-card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Region</label>
            <select 
              className="form-select"
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Status</label>
            <select 
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={clearFilters}
              style={{ width: "100%" }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Drivers Table */}
      <section className="card panel">
        {error && <div className="error-message">{error}</div>}
        
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Vehicle Type</th>
                <th>Weekly Off</th>
                <th>Status</th>
                <th>Fatigue</th>
                <th>Last Assignment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    No drivers found
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.driverId}>
                    <td>{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.region}</td>
                    <td style={{ textTransform: "capitalize" }}>{driver.vehicleType}</td>
                    <td>{driver.weeklyOff}</td>
                    <td>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={driver.status === "ACTIVE"}
                          onChange={() => handleStatusToggle(driver)}
                        />
                        <StatusBadge
                          label={driver.status}
                          tone={driver.status === "ACTIVE" ? "dark" : "gray"}
                        />
                      </label>
                    </td>
                    <td>
                      <FatiguePill label={getFatigueLabel(driver.fatigueScore)} />
                    </td>
                    <td>{formatDate(driver.lastAssignmentDate)}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => openViewModal(driver)}
                        aria-label="View driver"
                      >
                        <FiEye />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => openEditModal(driver)}
                        aria-label="Edit driver"
                      >
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Driver Modal */}
      {showAddModal && (
        <Modal title="Add New Driver" onClose={() => { setShowAddModal(false); resetForm(); }}>
          <form onSubmit={handleAddDriver}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                {validationErrors.name && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="10 digits"
                />
                {validationErrors.phone && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.phone}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="text"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="example@domain.com"
                />
                {validationErrors.email && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Region *</label>
                <select
                  name="region"
                  className="form-select"
                  value={formData.region}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {validationErrors.region && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.region}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Vehicle Type *</label>
                <select
                  name="vehicleType"
                  className="form-select"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {validationErrors.vehicleType && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.vehicleType}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Weekly Off *</label>
                <select
                  name="weeklyOff"
                  className="form-select"
                  value={formData.weeklyOff}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  <option value="">Select Weekly Off</option>
                  {weeklyOffs.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {validationErrors.weeklyOff && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.weeklyOff}
                  </span>
                )}
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Password (leave empty for default: driver123)</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Driver
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && selectedDriver && (
        <Modal title="Edit Driver" onClose={() => { setShowEditModal(false); resetForm(); setSelectedDriver(null); }}>
          <form onSubmit={handleEditDriver}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                {validationErrors.name && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="10 digits"
                />
                {validationErrors.phone && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.phone}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="text"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="example@domain.com"
                />
                {validationErrors.email && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Region *</label>
                <select
                  name="region"
                  className="form-select"
                  value={formData.region}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {validationErrors.region && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.region}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Vehicle Type *</label>
                <select
                  name="vehicleType"
                  className="form-select"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {validationErrors.vehicleType && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.vehicleType}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Weekly Off *</label>
                <select
                  name="weeklyOff"
                  className="form-select"
                  value={formData.weeklyOff}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                >
                  {weeklyOffs.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {validationErrors.weeklyOff && (
                  <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {validationErrors.weeklyOff}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); setSelectedDriver(null); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Driver Modal */}
      {showViewModal && selectedDriver && (
        <Modal title="Driver Details" onClose={() => { setShowViewModal(false); setSelectedDriver(null); }}>
          <div className="driver-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{selectedDriver.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{selectedDriver.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedDriver.email || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Region:</span>
              <span className="detail-value">{selectedDriver.region}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Vehicle Type:</span>
              <span className="detail-value" style={{ textTransform: "capitalize" }}>{selectedDriver.vehicleType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Weekly Off:</span>
              <span className="detail-value">{selectedDriver.weeklyOff}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <StatusBadge
                label={selectedDriver.status}
                tone={selectedDriver.status === "ACTIVE" ? "dark" : "gray"}
              />
            </div>
            <div className="detail-row">
              <span className="detail-label">Fatigue Score:</span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="detail-value">{selectedDriver.fatigueScore}/100</span>
                <FatiguePill label={getFatigueLabel(selectedDriver.fatigueScore)} />
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Assignment:</span>
              <span className="detail-value">{formatDate(selectedDriver.lastAssignmentDate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Consecutive Days:</span>
              <span className="detail-value">{selectedDriver.consecutiveDays} days</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{new Date(selectedDriver.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DriverManagement;