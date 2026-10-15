import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Repairs from "./pages/Repairs";
import RepairDetails from "./pages/RepairDetails";
import Products from "./pages/Products";
import Accessories from "./pages/Accessories";
import Payments from "./pages/Payments";
import ProductDetails from "./pages/ProductDetails";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Settings from "./pages/Settings";
import Services from "./pages/Services";


import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED ADMIN AREA */}
        <Route element={<ProtectedRoute />}>

          <Route element={<AdminLayout />}>

            {/* DASHBOARD */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* ORDERS */}
            <Route
              path="/orders"
              element={<Orders />}
            />

            {/* ORDER DETAILS */}
            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />

            {/* REPAIRS */}
            <Route
              path="/repairs"
              element={<Repairs />}
            />

            <Route
  path="/repairs/:id"
  element={<RepairDetails />}
/>

            {/* PRODUCTS */}
            <Route
              path="/products"
              element={<Products />}
            />

<Route
  path="/services"
  element={<Services />}
/>
            <Route path="/products/:id" element={<ProductDetails />} />

            <Route path="/accessories" element={<Accessories />} />

            {/* PAYMENTS */}
<Route path="/payments" element={<Payments />} />


            {/* CUSTOMERS */}
            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route path="/customers/:id" element={<CustomerDetails />} />

            {/* SETTINGS */}
            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;