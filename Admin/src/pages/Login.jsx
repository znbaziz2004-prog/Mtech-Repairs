import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const API_BASE_URL = "https://mtechnrepairs.hostless.app/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Save authentication data
      localStorage.setItem(
        "mtech_admin_token",
        data.token
      );

      localStorage.setItem(
        "mtech_admin",
        JSON.stringify(data.admin)
      );

      // Keep this only if your ProtectedRoute currently
      // checks this flag.
      localStorage.setItem(
        "mtech_admin_logged_in",
        "true"
      );

      navigate("/");
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT BRAND AREA */}
      <div className="login-brand">

        <div className="login-brand-content">

          <div className="login-logo">
            <span>M</span>
          </div>

          <span className="login-eyebrow">
            MTECH & REPAIRS
          </span>

          <h1>
            Repair business,
            <br />
            <span>made easier.</span>
          </h1>

          <p>
            Manage orders, repair bookings, products and
            customers from one powerful admin dashboard.
          </p>

          <div className="login-brand-line"></div>

          <div className="login-brand-footer">
            <span>ADMINISTRATOR PANEL</span>
            <span>•</span>
            <span>PRIVATE ACCESS</span>
          </div>

        </div>

      </div>

      {/* LOGIN AREA */}
      <div className="login-content">

        <div className="login-box">

          <div className="login-mobile-logo">

            <div className="login-logo small">
              <span>M</span>
            </div>

            <strong>
              MTECH & REPAIRS
            </strong>

          </div>

          <div className="login-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Admin Login
            </h2>

            <p>
              Sign in to access your repair management dashboard.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="login-form-group">

              <label>
                Email Address
              </label>

              <div className="login-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="admin@mtechrepairs.co.uk"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="login-form-group">

              <label>
                Password
              </label>

              <div className="login-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </span>

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

          <div className="login-security">

            <Lock size={14} />

            <span>
              This area is restricted to authorized administrators.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
