import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // Optional: for styling
const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSalesData(data.data || data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (loading) return <div className="loading">Loading...</div>;

  // Render error state
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>📊 Sales Report Dashboard</h1>
      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Yoyo Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((order) => (
              <tr key={order.yoyo_id}>
                <td>{order.yoyo_name || "N/A"}</td>
                <td>{order.quantity || "N/A"}</td>
                <td>{order.total_price || "N/A"}</td>
                <td>{order.order_date || "N/A"}</td>
                <td>{order.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
