const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../config/db");

// ======================================================
// ADMIN LOGIN
// ======================================================

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        password,
        role,
        is_active AS isActive,
        notify_orders AS notifyOrders,
        notify_repairs AS notifyRepairs,
        notify_stock AS notifyStock
      FROM admins
      WHERE email = ?
      LIMIT 1
      `,
      [email.toLowerCase().trim()]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "This admin account has been disabled.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        notifications: {
          orders: Boolean(admin.notifyOrders),
          repairs: Boolean(admin.notifyRepairs),
          stock: Boolean(admin.notifyStock),
        },
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
};

// ======================================================
// GET ADMIN PROFILE
// ======================================================

exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        notify_orders AS notifyOrders,
        notify_repairs AS notifyRepairs,
        notify_stock AS notifyStock
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [adminId]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone || "",
        role: admin.role,
        notifications: {
          orders: Boolean(admin.notifyOrders),
          repairs: Boolean(admin.notifyRepairs),
          stock: Boolean(admin.notifyStock),
        },
      },
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading admin profile.",
    });
  }
};

// ======================================================
// UPDATE ADMIN PROFILE
// ======================================================

exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : null;

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    // Check whether another admin already uses this email
    const [existing] = await pool.query(
      `
      SELECT id
      FROM admins
      WHERE email = ?
      AND id != ?
      LIMIT 1
      `,
      [cleanEmail, adminId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already being used by another admin.",
      });
    }

    await pool.query(
      `
      UPDATE admins
      SET
        name = ?,
        email = ?,
        phone = ?
      WHERE id = ?
      `,
      [cleanName, cleanEmail, cleanPhone, adminId]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [adminId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      admin: rows[0],
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile.",
    });
  }
};

// ======================================================
// CHANGE ADMIN PASSWORD
// ======================================================

exports.changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT password
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [adminId]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE admins
      SET password = ?
      WHERE id = ?
      `,
      [hashedPassword, adminId]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Admin Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while changing password.",
    });
  }
};

// ======================================================
// UPDATE ADMIN NOTIFICATIONS
// ======================================================

exports.updateAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user.id;

    const {
      orders,
      repairs,
      stock,
    } = req.body;

    await pool.query(
      `
      UPDATE admins
      SET
        notify_orders = ?,
        notify_repairs = ?,
        notify_stock = ?
      WHERE id = ?
      `,
      [
        orders ? 1 : 0,
        repairs ? 1 : 0,
        stock ? 1 : 0,
        adminId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully.",
      notifications: {
        orders: Boolean(orders),
        repairs: Boolean(repairs),
        stock: Boolean(stock),
      },
    });
  } catch (error) {
    console.error("Update Admin Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating notifications.",
    });
  }
};