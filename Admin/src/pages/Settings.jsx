import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateAdminNotifications,
} from "../services/api";

import "./Settings.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    repairs: true,
    stock: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ======================================================
  // LOAD ADMIN SETTINGS
  // ======================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getAdminProfile();

        if (response.success && response.admin) {
          setProfile({
            name: response.admin.name || "",
            email: response.admin.email || "",
            phone: response.admin.phone || "",
          });

          setNotifications({
            orders: response.admin.notifications?.orders ?? true,
            repairs: response.admin.notifications?.repairs ?? true,
            stock: response.admin.notifications?.stock ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to load admin settings:", error);

        setErrorMessage(
          error.message || "Unable to load admin settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ======================================================
  // CLEAR MESSAGES
  // ======================================================

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ======================================================
  // PROFILE
  // ======================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // PASSWORD
  // ======================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ======================================================
  // SAVE SETTINGS
  // ======================================================

  const handleSave = async () => {
    clearMessages();

    try {
      setSaving(true);

      // --------------------------------------------------
      // PROFILE
      // --------------------------------------------------

      if (activeSection === "profile") {
        if (!profile.name.trim() || !profile.email.trim()) {
          setErrorMessage("Name and email are required.");
          return;
        }

        const response = await updateAdminProfile({
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
        });

        if (response.success) {
          const existingAdmin = JSON.parse(
            localStorage.getItem("mtech_admin") || "{}"
          );

          localStorage.setItem(
            "mtech_admin",
            JSON.stringify({
              ...existingAdmin,
              ...response.admin,
            })
          );

          setSuccessMessage(
            response.message || "Profile updated successfully."
          );
        }

        return;
      }

      // --------------------------------------------------
      // PASSWORD
      // --------------------------------------------------

      if (activeSection === "password") {
        if (
          !password.current ||
          !password.newPassword ||
          !password.confirm
        ) {
          setErrorMessage("Please fill in all password fields.");
          return;
        }

        if (password.newPassword !== password.confirm) {
          setErrorMessage(
            "New password and confirm password do not match."
          );
          return;
        }

        if (password.newPassword.length < 6) {
          setErrorMessage(
            "New password must be at least 6 characters long."
          );
          return;
        }

        const response = await changeAdminPassword({
          currentPassword: password.current,
          newPassword: password.newPassword,
          confirmPassword: password.confirm,
        });

        if (response.success) {
          setSuccessMessage(
            response.message || "Password changed successfully."
          );

          setPassword({
            current: "",
            newPassword: "",
            confirm: "",
          });
        }

        return;
      }

      // --------------------------------------------------
      // NOTIFICATIONS
      // --------------------------------------------------

      if (activeSection === "notifications") {
        const response = await updateAdminNotifications(notifications);

        if (response.success) {
          setSuccessMessage(
            response.message ||
              "Notification settings updated successfully."
          );
        }
      }
    } catch (error) {
      console.error("Settings save error:", error);

      setErrorMessage(
        error.message || "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // SECTION CHANGE
  // ======================================================

  const handleSectionChange = (section) => {
    clearMessages();
    setActiveSection(section);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          Loading settings...
        </div>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Settings</h1>

          <p>
            Manage your administrator profile, security and
            notification preferences.
          </p>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            padding: "12px 15px",
            borderRadius: "10px",
            background: "#f0f9e8",
            border: "1px solid #cfe7b8",
            color: "#4d752c",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          <CheckCircle2 size={17} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            padding: "12px 15px",
            borderRadius: "10px",
            background: "#fff0f0",
            border: "1px solid #f0caca",
            color: "#b33a3a",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          <AlertCircle size={17} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="settings-layout">

        {/* SIDEBAR */}
        <aside className="settings-navigation">

          <button
            className={
              activeSection === "profile"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => handleSectionChange("profile")}
          >
            <User size={19} />

            <div>
              <strong>Admin Profile</strong>
              <span>Personal information</span>
            </div>
          </button>

          <button
            className={
              activeSection === "password"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => handleSectionChange("password")}
          >
            <Lock size={19} />

            <div>
              <strong>Password</strong>
              <span>Account security</span>
            </div>
          </button>

          <button
            className={
              activeSection === "notifications"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              handleSectionChange("notifications")
            }
          >
            <Bell size={19} />

            <div>
              <strong>Notifications</strong>
              <span>Notification preferences</span>
            </div>
          </button>

        </aside>

        {/* CONTENT */}
        <main className="settings-content">

          {/* ==================================================
              PROFILE
          ================================================== */}

          {activeSection === "profile" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Admin Profile</h2>
                  <p>
                    Update your administrator account
                    information.
                  </p>
                </div>

                <div className="settings-card-icon">
                  <User size={21} />
                </div>
              </div>

              {/* PROFILE PREVIEW */}
              <div className="profile-preview">
                <div className="large-admin-avatar">
                  {profile.name
                    ? profile.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </div>

                <div>
                  <strong>
                    {profile.name || "Administrator"}
                  </strong>

                  <span>
                    {profile.email || "admin@example.com"}
                  </span>
                </div>
              </div>

              {/* FORM */}
              <div className="settings-form-grid">

                <div className="settings-form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="settings-form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="settings-form-group">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="+44 7700 900000"
                  />
                </div>

                <div className="settings-form-group">
                  <label>Account Role</label>

                  <input
                    type="text"
                    value="Administrator"
                    disabled
                  />
                </div>

              </div>

              <div className="settings-footer">
                <button
                  className="save-settings-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>

            </section>
          )}

          {/* ==================================================
              PASSWORD
          ================================================== */}

          {activeSection === "password" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Change Password</h2>
                  <p>
                    Keep your administrator account secure
                    with a strong password.
                  </p>
                </div>

                <div className="settings-card-icon">
                  <Lock size={21} />
                </div>
              </div>

              <div className="password-form">

                <div className="settings-form-group">
                  <label>Current Password</label>

                  <div className="password-input">
                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      name="current"
                      value={password.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label>New Password</label>

                    <div className="password-input">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="settings-form-group">
                    <label>Confirm Password</label>

                    <div className="password-input">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="password-tip">
                <Info size={17} />

                <div>
                  <strong>Password Security</strong>

                  <span>
                    Use at least 6 characters and avoid
                    using easily guessed information.
                  </span>
                </div>
              </div>

              <div className="settings-footer">
                <button
                  className="save-settings-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>

            </section>
          )}

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          {activeSection === "notifications" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Notifications</h2>
                  <p>
                    Choose which updates you want to
                    receive.
                  </p>
                </div>

                <div className="settings-card-icon">
                  <Bell size={21} />
                </div>
              </div>

              <div className="notification-list">

                {/* ORDERS */}
                <div className="notification-item">

                  <div className="notification-info">

                    <div className="notification-icon orders">
                      <Bell size={18} />
                    </div>

                    <div>
                      <strong>New Orders</strong>

                      <span>
                        Get notified when a new order is
                        placed.
                      </span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className={
                      notifications.orders
                        ? "toggle-switch on"
                        : "toggle-switch"
                    }
                    onClick={() =>
                      toggleNotification("orders")
                    }
                  >
                    <span />
                  </button>

                </div>

                {/* REPAIRS */}
                <div className="notification-item">

                  <div className="notification-info">

                    <div className="notification-icon repairs">
                      <Lock size={18} />
                    </div>

                    <div>
                      <strong>Repair Bookings</strong>

                      <span>
                        Get notified when a customer
                        books a repair.
                      </span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className={
                      notifications.repairs
                        ? "toggle-switch on"
                        : "toggle-switch"
                    }
                    onClick={() =>
                      toggleNotification("repairs")
                    }
                  >
                    <span />
                  </button>

                </div>

                {/* STOCK */}
                <div className="notification-item">

                  <div className="notification-info">

                    <div className="notification-icon stock">
                      <Bell size={18} />
                    </div>

                    <div>
                      <strong>Low Stock</strong>

                      <span>
                        Get notified when products are
                        running low.
                      </span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className={
                      notifications.stock
                        ? "toggle-switch on"
                        : "toggle-switch"
                    }
                    onClick={() =>
                      toggleNotification("stock")
                    }
                  >
                    <span />
                  </button>

                </div>

              </div>

              <div className="settings-footer">
                <button
                  className="save-settings-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Preferences"}
                </button>
              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );
};

export default Settings;