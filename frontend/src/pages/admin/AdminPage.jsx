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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    // is_admin is a MSSQL bit — comes back as true/false (boolean)
    // use truthy check to handle both boolean true and number 1
    if (!user || !user.is_admin) {
      navigate("/"); // not admin → homepage
    } else {
      setAuthorized(true); // is admin → show page, no navigate()
    }
    setChecking(false);
  }, []); // empty deps — only run once on mount, no navigate dependency

  if (checking) return null;
  if (!authorized) return null;

  return (
    <div className="admin-layout">
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

      <main className="admin-main">
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "products" && <ProductManager />}
      </main>
    </div>
  );
};

export default AdminPage;
