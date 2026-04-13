const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// --- CẤU HÌNH CORS CHUẨN ---
app.use(cors());
app.use(express.json());

const config = {
  user: "sa",
  password: "123456aA@",
  server: "localhost",
  database: "master",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433,
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

// Route register - hash password và lưu vào database
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    let pool = await sql.connect(config);

    // Kiểm tra email đã tồn tại chưa
    let checkResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM Accounts WHERE email = @email");

    if (checkResult.recordset.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert vào database
    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("is_admin", sql.Bit, 0)
      .query(
        "INSERT INTO Accounts (email, password, is_admin, date_created) VALUES (@email, @password, @is_admin, GETDATE())",
      );

    res.json({
      success: true,
      message: "Registration successful!",
    });
  } catch (err) {
    console.error("Lỗi truy vấn SQL:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route login với xác thực email và password
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password có được gửi lên không
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    let pool = await sql.connect(config);

    // Tìm user theo email
    let result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        "SELECT id, email, password, is_admin FROM Accounts WHERE email = @email",
      );

    const user = result.recordset[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Kiểm tra password có khớp không
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Đăng nhập thành công
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error("Lỗi truy vấn SQL:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("Server Empathy Yoyo đang hoạt động!");
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đã sẵn sàng tại http://localhost:${PORT}`);
  console.log(`Kiểm tra dữ liệu tại: http://localhost:${PORT}/api/products`);
  console.log(`Dữ liệu players tại: http://localhost:${PORT}/api/players`);
  console.log(`Đăng nhập tại: POST http://localhost:${PORT}/api/login`);
  console.log(`Đăng ký tại: POST http://localhost:${PORT}/api/register`);
});
