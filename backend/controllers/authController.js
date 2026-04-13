// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sql = require("mssql"); // Thư viện kết nối SQL Server

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // 1. Tìm user trong Database
//     const result =
//       await sql.query`SELECT * FROM accounts WHERE email = ${email}`;
//     const user = result.recordset[0];

//     if (!user) {
//       return res.status(401).json({ message: "Email không tồn tại!" });
//     }

//     // 2. Kiểm tra mật khẩu (So sánh pass thuần với pass đã hash trong DB)
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Sai mật khẩu!" });
//     }

//     // 3. Tạo Token JWT
//     const token = jwt.sign(
//       { id: user.id, role: user.role }, // Payload: Lưu id và quyền
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }, // Token hết hạn sau 1 ngày
//     );

//     res.json({
//       message: "Đăng nhập thành công",
//       token,
//       user: { email: user.email, role: user.role },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server!" });
//   }
// };

// module.exports = { login };
