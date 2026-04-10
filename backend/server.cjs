const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

// --- CẤU HÌNH CORS CHUẨN ---
// Sử dụng cors() như một middleware cho tất cả các route.
// Nó sẽ tự động xử lý các request OPTIONS (Preflight) mà không cần app.options('*')
app.use(cors());
app.use(express.json());

const config = {
  user: "sa",
  password: "123456aA@", // Khớp chính xác với lệnh trên
  server: "localhost",
  database: "master",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433, // add this
};

// Route lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM Yoyos");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi truy vấn SQL:", err);
    res.status(500).json({ error: err.message });
  }
});

//Route lấy danh sách player

app.get("/api/players", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM Players");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi truy vấn SQL:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route kiểm tra server (để bạn test nhanh trên trình duyệt)
app.get("/", (req, res) => {
  res.send("Server Empathy Yoyo đang hoạt động!");
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đã sẵn sàng tại http://localhost:${PORT}`);
  console.log(`Kiểm tra dữ liệu tại: http://localhost:${PORT}/api/products`);
  console.log(`Dữ liệu players tại: http://localhost:${PORT}/api/players`);
});
