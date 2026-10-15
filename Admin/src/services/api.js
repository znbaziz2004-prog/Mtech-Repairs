
const API_BASE_URL = "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("mtech_admin_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    localStorage.removeItem("mtech_admin_token");
    localStorage.removeItem("mtech_admin");
    localStorage.removeItem("mtech_admin_logged_in");

    throw new Error(
      data.message || "Session expired. Please log in again."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};


/* =========================================================
   PRODUCTS
========================================================= */

// GET ALL PRODUCTS
export const getProducts = async () => {
  return apiRequest("/products");
};

// GET SINGLE PRODUCT
export const getProductById = async (id) => {
  return apiRequest(`/products/${id}`);
};

// CREATE PRODUCT
export const createProduct = async (productData) => {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

// UPDATE PRODUCT
export const updateProduct = async (id, productData) => {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
};



/* =========================================================
   ACCESSORIES
========================================================= */

// GET ALL ACCESSORIES
export const getAccessories = async () => {
  return apiRequest("/accessories");
};

// GET SINGLE ACCESSORY
export const getAccessoryById = async (id) => {
  return apiRequest(`/accessories/${id}`);
};

// CREATE ACCESSORY
export const createAccessory = async (accessoryData) => {
  return apiRequest("/accessories", {
    method: "POST",
    body: JSON.stringify(accessoryData),
  });
};

// UPDATE ACCESSORY
export const updateAccessory = async (id, accessoryData) => {
  return apiRequest(`/accessories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(accessoryData),
  });
};

// DELETE ACCESSORY
export const deleteAccessory = async (id) => {
  return apiRequest(`/accessories/${id}`, {
    method: "DELETE",
  });
};

/* =========================================================
   REPAIR BOOKINGS
========================================================= */

// GET ALL BOOKINGS
export const getBookings = async () => {
  return apiRequest("/bookings");
};

// GET SINGLE BOOKING
export const getBookingById = async (id) => {
  return apiRequest(`/bookings/${id}`);
};

// UPDATE BOOKING
export const updateBooking = async (id, bookingData) => {
  return apiRequest(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(bookingData),
  });
};

/* =========================================================
   CUSTOMERS
========================================================= */

export const getCustomers = async () => {
  return apiRequest("/customers");
};

export const getCustomerById = async (id) => {
  return apiRequest(
    `/customers/${encodeURIComponent(id)}`
  );
};
/* =========================================================
   CONTACT MESSAGES
========================================================= */

export const getContactMessages = async () => {
  return apiRequest("/contact");
};

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

// ADMIN LOGIN

export const loginAdmin = async (email, password) => {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/* =========================================================
   ORDERS
========================================================= */

// GET ALL ORDERS
export const getOrders = async ({
  search = "",
  status = "all",
  payment = "all",
  page = 1,
  limit = 10,
} = {}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status !== "all") params.append("status", status);
  if (payment !== "all") params.append("payment", payment);

  params.append("page", page);
  params.append("limit", limit);

  return apiRequest(`/orders?${params.toString()}`);
};

// GET ORDER STATISTICS
export const getOrderStats = async () => {
  return apiRequest("/orders/stats");
};

// GET SINGLE ORDER
export const getOrderById = async (id) => {
  return apiRequest(`/orders/${id}`);
};

// CREATE ORDER
export const createOrder = async (orderData) => {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

// UPDATE ORDER
export const updateOrder = async (id, orderData) => {
  return apiRequest(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(orderData),
  });
};

// UPDATE ONLY ORDER STATUS
export const updateOrderStatus = async (id, status) => {
  return apiRequest(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
};

// DELETE ORDER
export const deleteOrder = async (id) => {
  return apiRequest(`/orders/${id}`, {
    method: "DELETE",
  });
};


/* =========================================================
   PAYMENTS
========================================================= */

// GET PAID ONLINE ORDERS
export const getPaidOrders = async () => {
  const response = await getOrders({
    payment: "paid",
    page: 1,
    limit: 100,
  });

  return response;
};

/* =========================================================
   IMAGE UPLOAD
========================================================= */

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export const imageUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_ORIGIN}${path}`;
  }

  return `${API_ORIGIN}/${path}`;
};

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url;
};

export const getServices = async () => {
  return apiRequest("/services");
};

export const createService = async (serviceData) => {
  return apiRequest("/services", {
    method: "POST",
    body: JSON.stringify(serviceData),
  });
};

export const updateService = async (id, serviceData) => {
  return apiRequest(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(serviceData),
  });
};

export const deleteService = async (id) => {
  return apiRequest(`/services/${id}`, {
    method: "DELETE",
  });
};
/* =========================================================
   ADMIN SETTINGS
========================================================= */

// GET ADMIN PROFILE
export const getAdminProfile = async () => {
  const token = localStorage.getItem("mtech_admin_token");

  return apiRequest("/admin/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// UPDATE ADMIN PROFILE
export const updateAdminProfile = async (profileData) => {
  const token = localStorage.getItem("mtech_admin_token");

  return apiRequest("/admin/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
};

// CHANGE ADMIN PASSWORD
export const changeAdminPassword = async (passwordData) => {
  const token = localStorage.getItem("mtech_admin_token");

  return apiRequest("/admin/auth/password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });
};

// UPDATE ADMIN NOTIFICATIONS
export const updateAdminNotifications = async (notifications) => {
  const token = localStorage.getItem("mtech_admin_token");

  return apiRequest("/admin/auth/notifications", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(notifications),
  });
};


export const getAdminPayments = async () => {
  return apiRequest("/payments/admin");
};
