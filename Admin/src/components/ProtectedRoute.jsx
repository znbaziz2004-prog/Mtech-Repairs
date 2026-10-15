
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("mtech_admin_token");
  const admin = localStorage.getItem("mtech_admin");

  let validSession = false;

  if (token && admin) {
    try {
      const parsedAdmin = JSON.parse(admin);

      validSession =
        typeof token === "string" &&
        token.trim().length > 0 &&
        Boolean(parsedAdmin?.id);
    } catch {
      validSession = false;
    }
  }

  if (!validSession) {
    localStorage.removeItem("mtech_admin_token");
    localStorage.removeItem("mtech_admin");
    localStorage.removeItem("mtech_admin_logged_in");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
