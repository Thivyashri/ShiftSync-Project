import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("DRIVER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    
    // Navigate based on selected role
    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/driver-dashboard");
    }
  }

  return (
    <div className="ss-page-root">
      <div className="ss-center-wrap">
        <header className="ss-header">
          <img
            src="src/assets/truck.png"
            alt="truck"
            className="ss-truck-inline"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h1 className="ss-title-inline">ShiftSync</h1>
        </header>

        <div className="ss-tabs-wrap">
          <div className="ss-tabs" role="tablist" aria-label="role tabs">
            <button
              className={`ss-tab ${role === "DRIVER" ? "ss-tab-active" : ""}`}
              onClick={() => setRole("DRIVER")}
              aria-pressed={role === "DRIVER"}
            >
              DRIVER
            </button>
            <button
              className={`ss-tab ${role === "ADMIN" ? "ss-tab-active" : ""}`}
              onClick={() => setRole("ADMIN")}
              aria-pressed={role === "ADMIN"}
            >
              ADMIN
            </button>
          </div>
        </div>

        <form className="ss-form" onSubmit={handleLogin}>
          <div className="ss-field">
            <input
              className="ss-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              aria-label="username"
            />
          </div>

          <div className="ss-field ss-password-field">
            <input
              className="ss-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-label="password"
            />
            <button
              type="button"
              className="ss-eye-btn"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="ss-eye-icon" aria-hidden>
                  <path d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ss-eye-icon" aria-hidden>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11-3a3 3 0 110 6 3 3 0 010-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </button>
          </div>

          <label className="ss-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember Me</span>
          </label>
          <div className="ss-login-wrap">
            <button type="submit" className="ss-login-btn" aria-label="Login">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}