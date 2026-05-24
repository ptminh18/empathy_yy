/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "./AdminPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./sections/dashboard/Dashboard.jsx";
import ProductManager from "./sections/product-manager/ProductManager.jsx";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth guard — check localStorage for is_admin === 1
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.is_admin !== 1) {
      navigate("/"); // redirect non-admins to homepage
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [navigate]);

  if (checking) return null;
  if (!authorized) return null;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>

          <button
            className={`admin-nav-item ${activeSection === "products" ? "active" : ""}`}
            onClick={() => setActiveSection("products")}
          >
            <span className="nav-icon">📦</span>
            Product Management
          </button>
        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Log out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "products" && <ProductManager />}
      </main>
    </div>
  );
};

export default AdminPage;
