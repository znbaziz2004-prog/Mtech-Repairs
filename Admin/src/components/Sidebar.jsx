import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Package,
  Headphones,
  Users,
  Settings,
  LogOut,
  X,
  CreditCard,
  MessageSquare,

} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mtech_admin_logged_in");

    navigate("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Orders",
      path: "/orders",
      icon: ShoppingBag,
    },
    {
      label: "Repair Bookings",
      path: "/repairs",
      icon: Wrench,
    },

    {
  label: "Services",
  path: "/services",
  icon: Wrench,
},
    {
      label: "Products",
      path: "/products",
      icon: Package,
    },

    { label: "Accessories", path: "/accessories", icon: Headphones },

    {
  label: "Payments",
  path: "/payments",
  icon: CreditCard,
},
    
    {
      label: "Customers",
      path: "/customers",
      icon: Users,
    },

   
    { label: "Messages", path: "/messages", icon: MessageSquare },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* LOGO */}
        <div className="sidebar-logo-area">

          <div className="sidebar-logo">
            M
          </div>

          <div className="sidebar-brand">
            <strong>
              MTech
            </strong>

            <span>
              Repairs
            </span>
          </div>

          <button
            className="sidebar-mobile-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          <span className="sidebar-section-title">
            MAIN MENU
          </span>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );

          })}

        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Settings size={19} />

            <span>
              Settings
            </span>
          </NavLink>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;