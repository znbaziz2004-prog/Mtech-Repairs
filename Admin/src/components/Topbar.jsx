import { Bell, Menu, Search, UserCircle } from "lucide-react";

import "./Topbar.css";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-title">
          <h1>Admin Panel</h1>
          <p>Manage your repair business</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">
          <div className="profile-avatar">
            <UserCircle size={24} />
          </div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>
              <i></i>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;