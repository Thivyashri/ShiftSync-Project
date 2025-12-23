import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiChevronDown, FiX, FiUpload } from "react-icons/fi";

// =================== API CONFIG =================== //
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5028/api";

// =================== BADGE COMPONENTS =================== //
function StatusBadge({ label, tone }) {
  return <span className={`badge badge-status badge-status-${tone}`}>{label}</span>;
}

function PriorityBadge({ label }) {
  const tone = label === "HIGH" ? "high" : label === "MEDIUM" ? "medium" : "low";
  const pretty = label === "HIGH" ? "High" : label === "MEDIUM" ? "Medium" : "Low";
  return <span className={`badge badge-pill badge-${tone}`}>{pretty}</span>;
}

// =================== FILTER DROPDOWN =================== //
function FilterDropdown({ label, value, options, onChange }) {
  return (
    <div className="filter-dropdown">
      <span className="filter-label">{label}</span>

      <div className="filter-control" style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            background: "transparent",
            border: "none",
            width: "100%",
            paddingRight: "28px",
            cursor: "pointer",
            font: "inherit",
            color: "inherit",
            outline: "none",
          }}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>

        <FiChevronDown
          className="filter-icon"
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
        />
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

// =================== MODAL =================== //
function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "min(560px, 100%)", padding: 16, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="action-link" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiX /> Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// =================== MAIN COMPONENT =================== //
function LoadManagement() {
  // Filters
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [allRegions, setAllRegions] = useState([]);

  // Data
  const [loads, setLoads] = useState([]);
  const [stats, setStats] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  // Upload modal states
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);

  // Form (Add/Edit)
  const [form, setForm] = useState({
    region: "",
    stops: "",
    estimatedHours: "",
    estimatedDistance: "",
    priority: "MEDIUM",
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    region: "",
    stops: "",
    estimatedDistance: "",
    priority: ""
  });

  // Dynamic region options
  const regionOptions = useMemo(() => {
  return [
    { label: "All Regions", value: "All Regions" },
    ...allRegions.map((region) => ({
      label: region,
      value: region,
    })),
  ];
}, [allRegions]);

  // Fetch all regions once on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${API_BASE}/Loads`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const uniqueRegions = [...new Set(data.map(l => l.region).filter(Boolean))].sort();
            setAllRegions(uniqueRegions);
          }
        }
      } catch (e) {
        console.error("Failed to fetch regions", e);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (regionFilter !== "All Regions") {
      const exists = regionOptions.some((o) => o.value === regionFilter);
      if (!exists) setRegionFilter("All Regions");
    }
  }, [regionOptions, regionFilter]);

  const statusOptions = useMemo(
    () => [
      { label: "All Statuses", value: "All Statuses" },
      { label: "Pending", value: "PENDING" },
      { label: "Assigned", value: "ASSIGNED" },
      { label: "Completed", value: "COMPLETED" },
    ],
    []
  );

  // ---------- Validation Functions ----------
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "region":
        if (!value.trim()) {
          errorMsg = "Region is required";
        }
        break;

      case "stops":
        if (!value || Number(value) <= 0 || !Number.isInteger(Number(value))) {
          errorMsg = "Stops must be a positive integer";
        }
        break;

      case "estimatedDistance":
        if (!value || Number(value) <= 0) {
          errorMsg = "Distance must be a positive number";
        }
        break;

      case "priority":
        if (!value) {
          errorMsg = "Priority is required";
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  const validateForm = () => {
    const errors = {
      region: validateField("region", form.region),
      stops: validateField("stops", form.stops),
      estimatedDistance: validateField("estimatedDistance", form.estimatedDistance),
      priority: validateField("priority", form.priority)
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const handleFieldChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFieldBlur = (name, value) => {
    const errorMsg = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // ---------- Helpers ----------
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (regionFilter !== "All Regions") params.set("region", regionFilter);
    if (statusFilter !== "All Statuses") params.set("status", statusFilter);

    return params.toString();
  };

  const mapRowForUI = (l) => {
    const statusTone =
      l.status === "PENDING"
        ? "pending"
        : l.status === "ASSIGNED"
        ? "assigned"
        : l.status === "IN_PROGRESS"
        ? "progress"
        : "completed";

    const statusLabel =
      l.status === "PENDING"
        ? "Pending"
        : l.status === "ASSIGNED"
        ? "Assigned"
        : l.status === "IN_PROGRESS"
        ? "In Progress"
        : "Completed";

    return {
      id: l.loadRef ?? l.loadId,
      loadId: l.loadId,
      loadRef: l.loadRef,
      region: l.region,
      packages: l.stops,
      distance: `${Number(l.estimatedDistance).toFixed(2)} km`,
      area: l.region,
      priority: l.priority,
      status: { label: statusLabel, tone: statusTone },
      assignedDriverName: l.assignedDriverName ?? "-",
      estimatedHours: l.estimatedHours,
      estimatedDistance: l.estimatedDistance,
      stops: l.stops,
      createdAt: l.createdAt,
    };
  };

  // ---------- API calls ----------
  const fetchLoadsAndStats = async () => {
    setLoading(true);
    setError("");

    try {
      const query = buildQueryParams();

      const [loadsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/Loads${query ? `?${query}` : ""}`),
        fetch(`${API_BASE}/Loads/stats?${query}`),
      ]);

      if (!loadsRes.ok) throw new Error((await loadsRes.text()) || "Failed to load loads");
      if (!statsRes.ok) throw new Error((await statsRes.text()) || "Failed to load stats");

      const loadsData = await loadsRes.json();
      const statsData = await statsRes.json();

      setLoads(Array.isArray(loadsData) ? loadsData.map(mapRowForUI) : []);
      setStats(statsData);
      
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoadsAndStats();
  }, [regionFilter, statusFilter]);

  // ---------- Actions ----------
  const openAdd = () => {
    setForm({
      region: "",
      stops: "",
      estimatedHours: "",
      estimatedDistance: "",
      priority: "MEDIUM",
    });
    setValidationErrors({
      region: "",
      stops: "",
      estimatedDistance: "",
      priority: ""
    });
    setShowAdd(true);
  };

  const clearFilters = () => {
  setRegionFilter("All Regions");
  setStatusFilter("All Statuses");
};

  const onCreateLoad = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/Loads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: form.region.trim(),
          stops: Number(form.stops),
          estimatedHours: Number(form.estimatedHours),
          estimatedDistance: Number(form.estimatedDistance),
          priority: form.priority,
        }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Create failed");

      setShowAdd(false);
      await fetchLoadsAndStats();
    } catch (e) {
      console.error(e);
      setError(e.message || "Create failed");
    }
  };

  const onView = (row) => {
    setSelectedLoad(row);
    setShowView(true);
  };

  const onEditOpen = (row) => {
    setSelectedLoad(row);
    setForm({
      region: row.region ?? "",
      stops: row.stops,
      estimatedHours: row.estimatedHours,
      estimatedDistance: row.estimatedDistance,
      priority: row.priority ?? "MEDIUM",
    });
    setValidationErrors({
      region: "",
      stops: "",
      estimatedDistance: "",
      priority: ""
    });
    setShowEdit(true);
  };

  const onEditSave = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      if (!selectedLoad) return;

      const res = await fetch(`${API_BASE}/Loads/${selectedLoad.loadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: form.region.trim(),
          stops: Number(form.stops),
          estimatedHours: Number(form.estimatedHours),
          estimatedDistance: Number(form.estimatedDistance),
          priority: form.priority,
          status: "PENDING",
        }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Update failed");

      setShowEdit(false);
      setSelectedLoad(null);
      await fetchLoadsAndStats();
    } catch (e) {
      console.error(e);
      setError(e.message || "Update failed");
    }
  };

  const onDelete = async (row) => {
    setError("");
    const ok = window.confirm(`Delete load ${row.loadRef || row.id}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/Loads/${row.loadId}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");
      await fetchLoadsAndStats();
    } catch (e) {
      console.error(e);
      setError(e.message || "Delete failed");
    }
  };

  // =================== CSV UPLOAD =================== //
  const parseCSV = async (file) => {
    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = (name) => headers.indexOf(name.toLowerCase());

    const iRegion = idx("region");
    const iStops = idx("stops");
    const iDist = idx("estimatedDistance");
    const iPriority = idx("priority");
    const iHours = idx("estimatedHours");

    const iDist2 = iDist === -1 ? idx("estimateddistance") : iDist;
    const iHours2 = iHours === -1 ? idx("estimatedhours") : iHours;

    if (iRegion === -1 || iStops === -1 || iDist2 === -1 || iPriority === -1) {
      throw new Error("CSV header must include: region,stops,estimatedDistance,priority");
    }

    const AVG_SPEED = 20;
    const validRows = [];
    const invalidRows = [];

    lines.slice(1).forEach((line, lineIndex) => {
      const cols = line.split(",").map((c) => c.trim());

      const region = cols[iRegion];
      const stops = Number(cols[iStops]);
      const estimatedDistance = Number(cols[iDist2]);
      const priority = (cols[iPriority] || "MEDIUM").toUpperCase();

      const estimatedHours =
        iHours2 !== -1 && cols[iHours2]
          ? Number(cols[iHours2])
          : Number((estimatedDistance / AVG_SPEED).toFixed(1));

      // Validate row
      if (!region || !region.trim()) {
        invalidRows.push({ line: lineIndex + 2, reason: "Region is empty" });
      } else if (stops <= 0 || !Number.isInteger(stops)) {
        invalidRows.push({ line: lineIndex + 2, reason: "Stops must be positive integer" });
      } else if (estimatedDistance <= 0) {
        invalidRows.push({ line: lineIndex + 2, reason: "Distance must be positive" });
      } else if (!["HIGH", "MEDIUM", "LOW"].includes(priority)) {
        invalidRows.push({ line: lineIndex + 2, reason: "Invalid priority" });
      } else {
        validRows.push({ region, stops, estimatedDistance, estimatedHours, priority });
      }
    });

    return { validRows, invalidRows };
  };

  const uploadLoads = async () => {
    try {
      setError("");
      setUploadErrors([]);
      
      if (!uploadFile) throw new Error("Please select a CSV file");

      const { validRows, invalidRows } = await parseCSV(uploadFile);
      
      if (invalidRows.length > 0) {
        setUploadErrors(invalidRows);
      }

      if (validRows.length === 0) {
        throw new Error("No valid rows found in CSV");
      }

      const res = await fetch(`${API_BASE}/Loads/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRows),
      });

      if (!res.ok) throw new Error((await res.text()) || "Bulk upload failed");

      setShowUpload(false);
      setUploadFile(null);
      setUploadErrors([]);
      await fetchLoadsAndStats();
      
      if (invalidRows.length > 0) {
        alert(`Upload completed with ${invalidRows.length} invalid rows skipped. Check modal for details.`);
      }
    } catch (e) {
      setError(e.message || "Bulk upload failed");
    }
  };

  // =================== RENDER =================== //
  return (
    <>
      <PageHeader
        title="Load Management"
        subtitle="Track and manage all shipment loads"
        rightSlot={
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={openAdd}>
              <FiPlus className="btn-icon" />
              Add Load
            </button>

            <button className="btn-primary" onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiUpload />
              Upload Loads
            </button>
          </div>
        }
      />

      {error && (
        <section className="card" style={{ padding: 12, borderLeft: "4px solid #ef4444", marginBottom: 16 }}>
          <div style={{ color: "#b91c1c", fontWeight: 600 }}>Error</div>
          <div style={{ color: "#7f1d1d" }}>{error}</div>
        </section>
      )}

      <section className="card filters-card">
        <div className="filters-grid">
          <FilterDropdown label="Region" value={regionFilter} options={regionOptions} onChange={setRegionFilter} />
          <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
        </div>
      </section>

      {stats && (
        <section className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard title="Total Loads" value={stats.totalLoads} />
            <StatCard title="Pending" value={stats.pendingLoads} />
            <StatCard title="Assigned" value={stats.assignedLoads} />
            <StatCard title="High Priority Pending" value={stats.highPriorityPending} />
          </div>
        </section>
      )}

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
                <th style={{ minWidth: 220 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    Loading...
                  </td>
                </tr>
              ) : loads.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    No loads available
                  </td>
                </tr>
              ) : (
                loads.map((load) => {
                  const canEditDelete = load?.status?.label === "Pending";
                  return (
                    <tr key={load.loadId}>
                      <td style={{ fontWeight: 500 }}>{load.loadRef || load.id}</td>
                      <td>{load.packages}</td>
                      <td>{load.distance}</td>
                      <td>{load.area}</td>
                      <td><PriorityBadge label={load.priority} /></td>
                      <td><StatusBadge label={load.status.label} tone={load.status.tone} /></td>
                      <td style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button className="action-link" onClick={() => onView(load)}>View Details</button>
                        <button className="action-link" disabled={!canEditDelete} onClick={() => onEditOpen(load)}>Edit</button>
                        <button className="action-link" disabled={!canEditDelete} onClick={() => onDelete(load)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add Load" onClose={() => setShowAdd(false)}>
          <LoadForm 
            form={form} 
            setForm={handleFieldChange}
            onBlur={handleFieldBlur}
            errors={validationErrors}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button className="action-link" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary" onClick={onCreateLoad}>Create</button>
          </div>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {showView && selectedLoad && (
        <Modal title={`Load Details - ${selectedLoad.loadRef || selectedLoad.id}`} onClose={() => setShowView(false)}>
          <div style={{ display: "grid", gap: 10 }}>
            <DetailRow label="Region" value={selectedLoad.region} />
            <DetailRow label="Stops/Packages" value={selectedLoad.stops} />
            <DetailRow label="Estimated Hours" value={selectedLoad.estimatedHours} />
            <DetailRow label="Estimated Distance" value={`${Number(selectedLoad.estimatedDistance).toFixed(2)} km`} />
            <DetailRow label="Priority" value={selectedLoad.priority} />
            <DetailRow label="Status" value={selectedLoad.status.label} />
            <DetailRow label="Assigned Driver" value={selectedLoad.assignedDriverName} />
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && selectedLoad && (
        <Modal title={`Edit Load - ${selectedLoad.loadRef || selectedLoad.id}`} onClose={() => setShowEdit(false)}>
          <LoadForm 
            form={form} 
            setForm={handleFieldChange}
            onBlur={handleFieldBlur}
            errors={validationErrors}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button className="action-link" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="btn-primary" onClick={onEditSave}>Save</button>
          </div>
        </Modal>
      )}

      {/* UPLOAD MODAL */}
      {showUpload && (
        <Modal title="Upload Loads (CSV)" onClose={() => { setShowUpload(false); setUploadErrors([]); }}>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />

            <div style={{ fontSize: 12, color: "#6b7280" }}>
              CSV required columns: <b>region, stops, estimatedDistance, priority</b><br />
              Optional: <b>estimatedHours</b> (if missing → auto-calculated using Chennai traffic)
            </div>

            {uploadErrors.length > 0 && (
              <div style={{ 
                padding: 12, 
                background: "#fef2f2", 
                border: "1px solid #fecaca", 
                borderRadius: 8,
                maxHeight: 200,
                overflowY: "auto"
              }}>
                <div style={{ fontWeight: 600, color: "#991b1b", marginBottom: 8 }}>
                  Invalid Rows ({uploadErrors.length}):
                </div>
                {uploadErrors.map((err, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#7f1d1d" }}>
                    Line {err.line}: {err.reason}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="action-link" onClick={() => { setShowUpload(false); setUploadErrors([]); }}>Cancel</button>
              <button className="btn-primary" onClick={uploadLoads}>Upload</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// =================== SMALL COMPONENTS =================== //
function StatCard({ title, value }) {
  return (
    <div style={{ flex: "1 1 160px", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, backgroundColor: "#ffffff" }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{value ?? 0}</div>
    </div>
  );
}

function LoadForm({ form, setForm, onBlur, errors }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontSize: 12, color: "#6b7280" }}>Region *</label>
        <input
          type="text"
          value={form.region}
          onChange={(e) => setForm("region", e.target.value)}
          onBlur={(e) => onBlur("region", e.target.value)}
          placeholder="Enter region (ex: Porur / Anna Nagar / Tambaram)"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
        />
        {errors.region && (
          <span style={{ color: "#dc2626", fontSize: "11px" }}>{errors.region}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontSize: 12, color: "#6b7280" }}>Packages (Stops) *</label>
        <input
          type="number"
          min="1"
          value={form.stops}
          onChange={(e) => setForm("stops", e.target.value)}
          onBlur={(e) => onBlur("stops", e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
        />
        {errors.stops && (
          <span style={{ color: "#dc2626", fontSize: "11px" }}>{errors.stops}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontSize: 12, color: "#6b7280" }}>Estimated Distance (km) *</label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={form.estimatedDistance}
          onChange={(e) => {
            const distance = e.target.value;
            const AVG_SPEED_KMH = 20;
            const hrs = distance && Number(distance) > 0 ? (Number(distance) / AVG_SPEED_KMH).toFixed(1) : "";
            setForm("estimatedDistance", distance);
            setForm("estimatedHours", hrs);
          }}
          onBlur={(e) => onBlur("estimatedDistance", e.target.value)}
          placeholder="Enter distance in km"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
        />
        {errors.estimatedDistance && (
          <span style={{ color: "#dc2626", fontSize: "11px" }}>{errors.estimatedDistance}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontSize: 12, color: "#6b7280" }}>Estimated Hours (Auto)</label>
        <input
          type="text"
          value={form.estimatedHours}
          readOnly
          placeholder="Auto calculated based on distance"
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "not-allowed",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontSize: 12, color: "#6b7280" }}>Priority *</label>
        <select
          value={form.priority}
          onChange={(e) => setForm("priority", e.target.value)}
          onBlur={(e) => onBlur("priority", e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        {errors.priority && (
          <span style={{ color: "#dc2626", fontSize: "11px" }}>{errors.priority}</span>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default LoadManagement;
            