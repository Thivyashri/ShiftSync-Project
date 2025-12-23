import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FiKey,
  FiArrowLeft,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });

  const validateOldPassword = (value) => {
    if (!value || value.trim() === "") {
      return "Current password is required";
    }
    return "";
  };

  const validateNewPassword = (value) => {
    if (!value || value.trim() === "") {
      return "New password is required";
    }
    return "";
  };

  const validateConfirm = (value, newPass) => {
    if (!value || value.trim() === "") {
      return "Please confirm your password";
    }
    if (value !== newPass) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    setOldPassword(value);
    setValidationErrors((prev) => ({ ...prev, oldPassword: "" }));
  };

  const handleOldPasswordBlur = (e) => {
    const msg = validateOldPassword(oldPassword);
    setValidationErrors((prev) => ({
      ...prev,
      oldPassword: msg,
    }));
    e.target.style.borderColor = msg ? "#dc2626" : "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setValidationErrors((prev) => ({ ...prev, newPassword: "" }));

    if (confirm) {
      setValidationErrors((prev) => ({
        ...prev,
        confirm: validateConfirm(confirm, value),
      }));
    }
  };

  const handleNewPasswordBlur = (e) => {
    const msg = validateNewPassword(newPassword);
    setValidationErrors((prev) => ({
      ...prev,
      newPassword: msg,
    }));
    e.target.style.borderColor = msg ? "#dc2626" : "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirm(value);
    setValidationErrors((prev) => ({ ...prev, confirm: "" }));
  };

  const handleConfirmBlur = (e) => {
    const msg = validateConfirm(confirm, newPassword);
    setValidationErrors((prev) => ({
      ...prev,
      confirm: msg,
    }));
    e.target.style.borderColor = msg ? "#dc2626" : "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  const validateForm = () => {
    const errors = {
      oldPassword: validateOldPassword(oldPassword),
      newPassword: validateNewPassword(newPassword),
      confirm: validateConfirm(confirm, newPassword),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/auth/driver-reset-password", { oldPassword, newPassword });

      setSuccess("Password updated successfully!");
      setTimeout(() => navigate("/driver-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#dbeafe",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#3b82f6",
              fontSize: "24px",
            }}
          >
            <FiKey />
          </div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#111827",
              margin: "0 0 6px 0",
            }}
          >
            Reset Password
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            Enter your current password and choose a new one
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              background: "#fee2e2",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #fecaca",
            }}
          >
            <FiAlertCircle style={{ color: "#dc2626", flexShrink: 0 }} />
            <p
              style={{ color: "#991b1b", fontSize: "14px", margin: 0 }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              background: "#d1fae5",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #a7f3d0",
            }}
          >
            <FiCheckCircle style={{ color: "#059669", flexShrink: 0 }} />
            <p
              style={{ color: "#065f46", fontSize: "14px", margin: 0 }}
            >
              {success}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Old password */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Current Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "16px",
                }}
              />
              <input
                type="password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                onBlur={handleOldPasswordBlur}
                placeholder="Enter current password"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  fontSize: "14px",
                  border: `1px solid ${
                    validationErrors.oldPassword ? "#dc2626" : "#d1d5db"
                  }`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
              />
            </div>
            {validationErrors.oldPassword && (
              <span
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {validationErrors.oldPassword}
              </span>
            )}
          </div>

          {/* New password */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "16px",
                }}
              />
              <input
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                onBlur={handleNewPasswordBlur}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  fontSize: "14px",
                  border: `1px solid ${
                    validationErrors.newPassword ? "#dc2626" : "#d1d5db"
                  }`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
              />
            </div>
            {validationErrors.newPassword && (
              <span
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {validationErrors.newPassword}
              </span>
            )}
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Confirm New Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "16px",
                }}
              />
              <input
                type="password"
                value={confirm}
                onChange={handleConfirmChange}
                onBlur={handleConfirmBlur}
                placeholder="Confirm new password"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  fontSize: "14px",
                  border: `1px solid ${
                    validationErrors.confirm ? "#dc2626" : "#d1d5db"
                  }`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
              />
            </div>
            {validationErrors.confirm && (
              <span
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {validationErrors.confirm}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#9ca3af" : "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginBottom: "16px",
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = "#1f2937";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = "#111827";
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver-dashboard")}
            style={{
              width: "100%",
              padding: "12px",
              background: "none",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <FiArrowLeft size={16} />
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
