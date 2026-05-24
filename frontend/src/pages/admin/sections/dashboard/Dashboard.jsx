// import { useEffect, useState } from "react";
// import Header from "../../../../layouts/Header/Header.jsx";
// import Footer from "../../../../layouts/Footer/Footer.jsx";

// import "./Dashboard.css"; // Optional: for styling
// const Dashboard = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch sales data from API
//   useEffect(() => {
//     fetch("http://127.0.0.1:8080/api/orders")
//       .then((res) => {
//         if (!res.ok) throw new Error("Network response was not ok");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Dữ liệu nhận được từ Backend:", data); // Xem ở F12 Trình duyệt
//         const finalData = Array.isArray(data) ? data : data.recordset || [];
//         setSalesData(finalData);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Lỗi kết nối API:", err);
//         setLoading(false);
//       });
//   }, []);

//   // Render loading state
//   if (loading) return <div className="loading">Loading...</div>;

//   // Render error state
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <>
//       <div className="dashboard">
//         <h1>Sales Report Dashboard</h1>
//         <div className="sales-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer ID</th>
//                 <th>Customer Name</th>
//                 <th>Yoyo ID</th>
//                 <th>Yoyo Name</th>
//                 <th>Quantity</th>
//                 <th>Total Price</th>
//                 <th>Order Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesData.map((order) => (
//                 <tr key={order.order_id}>
//                   <td>{order.id}</td>
//                   <td>{order.customer_id}</td>
//                   <td>{order.customer_name}</td>
//                   <td>{order.yoyo_id}</td>
//                   <td>{order.yoyo_name}</td>
//                   <td>{order.quantity}</td>
//                   <td>{order.total_price} VNĐ</td>
//                   <td>
//                     {new Date(order.date).toLocaleDateString("en-GB")}
//                   </td>{" "}
//                   <td>{order.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setSalesData(Array.isArray(data) ? data : data.recordset || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
        setLoading(false);
      });
  }, []);

  // Summary stats
  const totalOrders = salesData.length;
  const totalRevenue = salesData.reduce(
    (sum, o) => sum + (o.total_price || 0),
    0,
  );
  const completedOrders = salesData.filter(
    (o) => o.status === "completed",
  ).length;

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1 className="section-title">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <p className="card-label">Total Orders</p>
          <p className="card-value">{totalOrders}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Completed</p>
          <p className="card-value">{completedOrders}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Revenue</p>
          <p className="card-value">{totalRevenue.toLocaleString()} VNĐ</p>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Yoyo</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "#555",
                    padding: "40px",
                  }}
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              salesData.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name || "Guest"}</td>
                  <td>{order.yoyo_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.total_price?.toLocaleString()} VNĐ</td>
                  <td>{new Date(order.date).toLocaleDateString("en-GB")}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
