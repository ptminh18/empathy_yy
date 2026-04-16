import { useEffect, useState } from "react";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";

import "./Dashboard.css"; // Optional: for styling
const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales data from API
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Dữ liệu nhận được từ Backend:", data); // Xem ở F12 Trình duyệt
        const finalData = Array.isArray(data) ? data : data.recordset || [];
        setSalesData(finalData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối API:", err);
        setLoading(false);
      });
  }, []);

  // Render loading state
  if (loading) return <div className="loading">Loading...</div>;

  // Render error state
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <div className="dashboard">
        <h1>Sales Report Dashboard</h1>
        <div className="sales-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Yoyo ID</th>
                <th>Yoyo Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.id}</td>
                  <td>{order.customer_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.yoyo_id}</td>
                  <td>{order.yoyo_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.total_price} VNĐ</td>
                  <td>
                    {new Date(order.date).toLocaleDateString("en-GB")}
                  </td>{" "}
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
