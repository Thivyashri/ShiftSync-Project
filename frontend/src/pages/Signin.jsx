import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("DRIVER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: ""
  });

  // Validation functions
  const validateUsername = (value) => {
    if (!value || value.trim() === "") {
      return "Username/phone/email is required";
    }

    // Check if it looks like an email
    const hasAtSymbol = value.includes("@");
    
    if (hasAtSymbol) {
      // Email validation: must contain @ and .com
      if (!value.includes(".com")) {
        return "Email must contain @ and .com";
      }
    } else {
      // Phone number validation: must be exactly 10 digits
      if (!/^\d{10}$/.test(value.trim())) {
        return "Phone must be exactly 10 digits";
      }
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value || value.trim() === "") {
      return "Password is required";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setValidationErrors(prev => ({ ...prev, username: "" }));
  };

  const handleUsernameBlur = () => {
    setValidationErrors(prev => ({ 
      ...prev, 
      username: validateUsername(username) 
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidationErrors(prev => ({ ...prev, password: "" }));
  };

  const handlePasswordBlur = () => {
    setValidationErrors(prev => ({ 
      ...prev, 
      password: validatePassword(password) 
    }));
  };

  const validateForm = () => {
    const errors = {
      username: validateUsername(username),
      password: validatePassword(password)
    };

    setValidationErrors(errors);

    return !Object.values(errors).some(error => error !== "");
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5028/api/auth/login", {
        username,
        password
      });

      const { token, user } = response.data;

      // Block wrong role-type login
      if (role !== user.role) {
        setError("Can't login, please check your role");
        return;
      }

      // Save token & details
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("driverId", user.id);
      localStorage.setItem("driverData", JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role
      }));

      // Attach token to axios globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on actual backend user role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "DRIVER") {
        navigate("/driver-dashboard");
      } else {
        setError("Unknown role returned by server.");
      }

    } catch (err) {
      setError("Invalid username or password");
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
          />
          <h1 className="ss-title-inline">ShiftSync</h1>
        </header>

        <div className="ss-tabs-wrap">
          <div className="ss-tabs" role="tablist">
            <button
              className={`ss-tab ${role === "DRIVER" ? "ss-tab-active" : ""}`}
              onClick={() => setRole("DRIVER")}
            >
              DRIVER
            </button>

            <button
              className={`ss-tab ${role === "ADMIN" ? "ss-tab-active" : ""}`}
              onClick={() => setRole("ADMIN")}
            >
              ADMIN
            </button>
          </div>
        </div>

        <form className="ss-form" onSubmit={handleLogin}>
          {error && <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>}

          <div className="ss-field">
            <input
              className="ss-input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              placeholder={
                role === "ADMIN" ? "Username or Email" : "Phone or Email"
              }
              style={{
                borderColor: validationErrors.username ? "#dc2626" : undefined
              }}
            />
            {validationErrors.username && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '12px', 
                marginTop: '4px', 
                display: 'block' 
              }}>
                {validationErrors.username}
              </span>
            )}
          </div>

          <div className="ss-field ss-password-field">
            <input
              className="ss-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder="Enter your password"
              style={{
                borderColor: validationErrors.password ? "#dc2626" : undefined
              }}
            />

            <button
              type="button"
              className="ss-eye-btn"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            
            {validationErrors.password && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '12px', 
                marginTop: '4px', 
                display: 'block',
                position: 'absolute',
                bottom: '-20px',
                left: 0
              }}>
                {validationErrors.password}
              </span>
            )}
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
            <button type="submit" className="ss-login-btn">
              LOGIN
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}