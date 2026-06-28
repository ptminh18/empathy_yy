// const path = require("path");
// const fs = require("fs");
// const express = require("express");
// const sql = require("mssql");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// require("dotenv").config();
// require("@paypal/checkout-server-sdk");

// const app = express();

// // =============================
// // MIDDLEWARE
// // =============================

// app.use(cors());
// app.use(express.json());

// // =============================
// // PAYPAL SETUP
// // npm install @paypal/checkout-server-sdk dotenv
// // =============================

// const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// function paypalClient() {
//   const clientId = process.env.PAYPAL_CLIENT_ID;
//   const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
//   const mode = process.env.PAYPAL_MODE || "sandbox";

//   const environment =
//     mode === "production"
//       ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
//       : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

//   return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
// }

// // =============================
// // CREATE PAYPAL ORDER
// // POST /api/paypal/create-order
// // Body: { amount: "25.00", currency: "USD" }
// // =============================

// app.post("/api/paypal/create-order", async (req, res) => {
//   try {
//     const { amount, currency = "USD" } = req.body;

//     if (!amount) return res.status(400).json({ error: "Amount is required" });

//     const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: currency,
//             value: amount,
//           },
//         },
//       ],
//     });

//     const order = await paypalClient().execute(request);
//     res.json({ id: order.result.id });
//   } catch (err) {
//     console.error("PayPal create-order error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/paypal/capture-order", async (req, res) => {
//   try {
//     const {
//       orderID,
//       customer_id,
//       customer_name,
//       yoyo_id,
//       yoyo_name,
//       quantity,
//       total_price,
//     } = req.body;

//     if (!orderID) return res.status(400).json({ error: "orderID is required" });

//     // Step 1: Capture payment with PayPal
//     const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
//     request.requestBody({});

//     const capture = await paypalClient().execute(request);
//     const status = capture.result.status;

//     if (status !== "COMPLETED") {
//       return res.status(400).json({ success: false, status });
//     }

//     // Step 2: Payment confirmed — save order to DB
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input("customer_id", sql.Int, customer_id || null)
//       .input("customer_name", sql.NVarChar(255), customer_name || "Guest")
//       .input("yoyo_id", sql.Int, yoyo_id)
//       .input("yoyo_name", sql.NVarChar(255), yoyo_name)
//       .input("quantity", sql.Int, quantity)
//       .input("total_price", sql.Decimal(18, 2), total_price)
//       .input("status", sql.NVarChar(50), "completed").query(`
//         INSERT INTO Orders
//           (customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price, date, status)
//         OUTPUT INSERTED.id
//         VALUES
//           (@customer_id, @customer_name, @yoyo_id, @yoyo_name, @quantity, @total_price, GETDATE(), @status)
//       `);

//     res.json({
//       success: true,
//       status,
//       order_id: result.recordset[0].id,
//       details: capture.result,
//     });
//   } catch (err) {
//     console.error("PayPal capture-order error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.use(
//   "/uploads/yoyos",
//   express.static(path.join(__dirname, "uploads/yoyos")),
// );
// app.use(
//   "/uploads/color-images",
//   express.static(path.join(__dirname, "uploads/color-images")),
// );
// app.use(
//   "/uploads/players",
//   express.static(path.join(__dirname, "uploads/players")),
// );

// // =============================
// // DATABASE CONFIG
// // =============================

// const config = {
//   user: "sa",
//   password: "123456aA@",
//   server: "localhost",
//   database: "master",
//   options: { encrypt: false, trustServerCertificate: true },
//   port: 1433,
// };

// // =============================
// // MULTER CONFIG
// // =============================

// // For yoyo main images
// const yoyoStorage = multer.diskStorage({
//   destination: "uploads/yoyos",
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage: yoyoStorage });

// // For color images
// const colorStorage = multer.diskStorage({
//   destination: "uploads/color-images",
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const uploadColor = multer({ storage: colorStorage });

// // =============================
// // GET ALL PRODUCTS
// // =============================

// app.get("/api/products", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT id, name, price, stock, image_main, image_1, image_2,
//              description, diameter, width, weight, gap_width, material
//       FROM Yoyos
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("SQL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // GET SINGLE PRODUCT
// // =============================

// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { id } = req.params;
//     const result = await pool.request().input("id", sql.Int, id).query(`
//         SELECT id, name, price, stock, image_main, image_1, image_2,
//                description, diameter, width, weight, gap_width, material
//         FROM Yoyos WHERE id = @id
//       `);
//     if (!result.recordset[0])
//       return res.status(404).json({ error: "Product not found" });
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error("SQL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================
// // GET COLORS BY YOYO ID
// // ============================

// app.get("/api/color-images/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(
//         `SELECT id, yoyo_id, color, image FROM Yoyos_Colors WHERE yoyo_id = @id`,
//       );
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("SQL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // GET PLAYERS
// // =============================

// app.get("/api/players", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT id, name, translator_name, image, signature_model, signature_link FROM Players
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("SQL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // ADD PRODUCT
// // =============================

// app.post(
//   "/api/products",
//   upload.fields([
//     { name: "image_main", maxCount: 1 },
//     { name: "image_1", maxCount: 1 },
//     { name: "image_2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const pool = await sql.connect(config);
//       const {
//         name,
//         price,
//         stock,
//         description,
//         diameter,
//         width,
//         weight,
//         gap_width,
//         material,
//       } = req.body;

//       if (!req.files || !req.files.image_main) {
//         return res.status(400).json({ error: "Main image is required" });
//       }

//       const image_main = `/uploads/yoyos/${req.files.image_main[0].filename}`;
//       const image_1 = req.files.image_1
//         ? `/uploads/yoyos/${req.files.image_1[0].filename}`
//         : null;
//       const image_2 = req.files.image_2
//         ? `/uploads/yoyos/${req.files.image_2[0].filename}`
//         : null;

//       // Insert product and return new id
//       const insertResult = await pool
//         .request()
//         .input("name", sql.NVarChar(255), name)
//         .input("price", sql.Decimal(18, 2), price)
//         .input("stock", sql.Int, stock)
//         .input("description", sql.NVarChar(sql.MAX), description || "")
//         .input("image_main", sql.NVarChar(500), image_main)
//         .input("image_1", sql.NVarChar(500), image_1)
//         .input("image_2", sql.NVarChar(500), image_2)
//         .input("diameter", sql.Decimal(10, 2), diameter || null)
//         .input("width", sql.Decimal(10, 2), width || null)
//         .input("weight", sql.Decimal(10, 2), weight || null)
//         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
//         .input("material", sql.NVarChar(255), material || null).query(`
//           INSERT INTO Yoyos (name, price, stock, description, image_main, image_1, image_2, diameter, width, weight, gap_width, material)
//           OUTPUT INSERTED.id
//           VALUES (@name, @price, @stock, @description, @image_main, @image_1, @image_2, @diameter, @width, @weight, @gap_width, @material)
//         `);

//       const newYoyoId = insertResult.recordset[0].id;
//       res.json({ success: true, id: newYoyoId });
//     } catch (err) {
//       console.error("ADD ERROR:", err);
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // =============================
// // UPDATE PRODUCT
// // =============================

// app.put(
//   "/api/products/:id",
//   upload.fields([
//     { name: "image_main", maxCount: 1 },
//     { name: "image_1", maxCount: 1 },
//     { name: "image_2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const pool = await sql.connect(config);
//       const { id } = req.params;
//       const {
//         name,
//         price,
//         stock,
//         description,
//         diameter,
//         width,
//         weight,
//         gap_width,
//         material,
//       } = req.body;

//       const image_main =
//         req.files && req.files.image_main
//           ? `/uploads/yoyos/${req.files.image_main[0].filename}`
//           : null;
//       const image_1 =
//         req.files && req.files.image_1
//           ? `/uploads/yoyos/${req.files.image_1[0].filename}`
//           : null;
//       const image_2 =
//         req.files && req.files.image_2
//           ? `/uploads/yoyos/${req.files.image_2[0].filename}`
//           : null;

//       await pool
//         .request()
//         .input("id", sql.Int, id)
//         .input("name", sql.NVarChar(255), name)
//         .input("price", sql.Decimal(18, 2), price)
//         .input("stock", sql.Int, stock)
//         .input("description", sql.NVarChar(sql.MAX), description || "")
//         .input("image_main", sql.NVarChar(500), image_main)
//         .input("image_1", sql.NVarChar(500), image_1)
//         .input("image_2", sql.NVarChar(500), image_2)
//         .input("diameter", sql.Decimal(10, 2), diameter || null)
//         .input("width", sql.Decimal(10, 2), width || null)
//         .input("weight", sql.Decimal(10, 2), weight || null)
//         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
//         .input("material", sql.NVarChar(255), material || null).query(`
//           UPDATE Yoyos SET
//             name        = @name,
//             price       = @price,
//             stock       = @stock,
//             description = @description,
//             image_main  = COALESCE(@image_main, image_main),
//             image_1     = COALESCE(@image_1, image_1),
//             image_2     = COALESCE(@image_2, image_2),
//             diameter    = COALESCE(@diameter, diameter),
//             width       = COALESCE(@width, width),
//             weight      = COALESCE(@weight, weight),
//             gap_width   = COALESCE(@gap_width, gap_width),
//             material    = COALESCE(@material, material)
//           WHERE id = @id
//         `);

//       res.json({ success: true });
//     } catch (err) {
//       console.error("UPDATE ERROR:", err);
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // ============================
// // DELETE PRODUCT
// // ============================

// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { id } = req.params;

//     const result = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`SELECT image_main, image_1, image_2 FROM Yoyos WHERE id = @id`);

//     const product = result.recordset[0];
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     [product.image_main, product.image_1, product.image_2].forEach((img) => {
//       if (img) {
//         const filePath = "." + img;
//         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//       }
//     });

//     // Also delete color images from disk
//     const colorResult = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`SELECT image FROM Yoyos_Colors WHERE yoyo_id = @id`);

//     colorResult.recordset.forEach((c) => {
//       if (c.image) {
//         const filePath = "." + c.image;
//         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//       }
//     });

//     await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`DELETE FROM Yoyos_Colors WHERE yoyo_id = @id`);
//     await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`DELETE FROM Yoyos WHERE id = @id`);

//     res.json({ success: true });
//   } catch (err) {
//     console.error("DELETE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================
// // ADD COLOR TO YOYO
// // ============================

// app.post("/api/color-images", uploadColor.single("image"), async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { yoyo_id, color } = req.body;

//     if (!req.file)
//       return res.status(400).json({ error: "Color image is required" });
//     if (!yoyo_id || !color)
//       return res.status(400).json({ error: "yoyo_id and color are required" });

//     const imagePath = `/uploads/color-images/${req.file.filename}`;

//     const result = await pool
//       .request()
//       .input("yoyo_id", sql.Int, yoyo_id)
//       .input("color", sql.NVarChar(100), color)
//       .input("image", sql.NVarChar(500), imagePath).query(`
//         INSERT INTO Yoyos_Colors (yoyo_id, color, image)
//         OUTPUT INSERTED.id
//         VALUES (@yoyo_id, @color, @image)
//       `);

//     res.json({ success: true, id: result.recordset[0].id });
//   } catch (err) {
//     console.error("ADD COLOR ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================
// // UPDATE COLOR
// // ============================

// app.put(
//   "/api/color-images/:id",
//   uploadColor.single("image"),
//   async (req, res) => {
//     try {
//       const pool = await sql.connect(config);
//       const { id } = req.params;
//       const { color } = req.body;

//       const imagePath = req.file
//         ? `/uploads/color-images/${req.file.filename}`
//         : null;

//       await pool
//         .request()
//         .input("id", sql.Int, id)
//         .input("color", sql.NVarChar(100), color)
//         .input("image", sql.NVarChar(500), imagePath).query(`
//         UPDATE Yoyos_Colors SET
//           color = @color,
//           image = COALESCE(@image, image)
//         WHERE id = @id
//       `);

//       res.json({ success: true });
//     } catch (err) {
//       console.error("UPDATE COLOR ERROR:", err);
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // ============================
// // DELETE COLOR
// // ============================

// app.delete("/api/color-images/:id", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { id } = req.params;

//     const result = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`SELECT image FROM Yoyos_Colors WHERE id = @id`);

//     const color = result.recordset[0];
//     if (!color) return res.status(404).json({ error: "Color not found" });

//     if (color.image) {
//       const filePath = "." + color.image;
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`DELETE FROM Yoyos_Colors WHERE id = @id`);

//     res.json({ success: true });
//   } catch (err) {
//     console.error("DELETE COLOR ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // REGISTER
// // =============================

// app.post("/api/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const pool = await sql.connect(config);

//     const checkUser = await pool
//       .request()
//       .input("email", sql.VarChar, email)
//       .query("SELECT id FROM Accounts WHERE email = @email");

//     if (checkUser.recordset.length > 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await pool
//       .request()
//       .input("email", sql.VarChar, email)
//       .input("password", sql.VarChar, hashedPassword)
//       .input("is_admin", sql.Bit, 0)
//       .query(
//         `INSERT INTO Accounts (email, password, is_admin, date_created) VALUES (@email, @password, @is_admin, GETDATE())`,
//       );

//     res.json({ success: true, message: "Register success" });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // LOGIN
// // =============================

// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const pool = await sql.connect(config);

//     const result = await pool
//       .request()
//       .input("email", sql.VarChar, email)
//       .query(
//         `SELECT id, email, password, is_admin FROM Accounts WHERE email = @email`,
//       );

//     const user = result.recordset[0];
//     if (!user)
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid email or password" });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid)
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid email or password" });

//     res.json({
//       success: true,
//       user: { id: user.id, email: user.email, is_admin: user.is_admin },
//     });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // =============================
// // GET ALL ORDERS
// // =============================

// app.get("/api/orders", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT
//         id, customer_id, customer_name,
//         yoyo_id, yoyo_name, quantity,
//         total_price, date, status
//       FROM Orders
//       ORDER BY date DESC
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("GET ORDERS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // CREATE ORDER
// // Called after PayPal payment is captured successfully
// // Body: { customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price }
// // =============================

// app.post("/api/orders", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const {
//       customer_id,
//       customer_name,
//       yoyo_id,
//       yoyo_name,
//       quantity,
//       total_price,
//     } = req.body;

//     if (!yoyo_id || !quantity || !total_price) {
//       return res
//         .status(400)
//         .json({ error: "yoyo_id, quantity and total_price are required" });
//     }

//     const result = await pool
//       .request()
//       .input("customer_id", sql.Int, customer_id || null)
//       .input("customer_name", sql.NVarChar(255), customer_name || "Guest")
//       .input("yoyo_id", sql.Int, yoyo_id)
//       .input("yoyo_name", sql.NVarChar(255), yoyo_name)
//       .input("quantity", sql.Int, quantity)
//       .input("total_price", sql.Decimal(18, 2), total_price)
//       .input("status", sql.NVarChar(50), "pending").query(`
//         INSERT INTO Orders
//           (customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price, date, status)
//         OUTPUT INSERTED.id
//         VALUES
//           (@customer_id, @customer_name, @yoyo_id, @yoyo_name, @quantity, @total_price, GETDATE(), @status)
//       `);

//     res.json({ success: true, id: result.recordset[0].id });
//   } catch (err) {
//     console.error("CREATE ORDER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // UPDATE ORDER STATUS
// // Body: { status: "completed" | "cancelled" | "pending" }
// // =============================

// app.put("/api/orders/:id/status", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status) return res.status(400).json({ error: "status is required" });

//     await pool
//       .request()
//       .input("id", sql.Int, id)
//       .input("status", sql.NVarChar(50), status).query(`
//         UPDATE Orders SET status = @status WHERE id = @id
//       `);

//     res.json({ success: true });
//   } catch (err) {
//     console.error("UPDATE ORDER STATUS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // SERVER START
// // =============================

// const PORT = 8080;

// // Bắt buộc phải thêm '0.0.0.0' để mở cổng ra môi trường Internet của Render
// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`🚀 Server running on port: ${PORT}`),
// );

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { Pool } = require("pg");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
require("dotenv").config();

const app = express();

// =============================
// MIDDLEWARE
// =============================

app.use(cors());
app.use(express.json());

app.use(
  "/uploads/yoyos",
  express.static(path.join(__dirname, "uploads/yoyos")),
);
app.use(
  "/uploads/color-images",
  express.static(path.join(__dirname, "uploads/color-images")),
);
app.use(
  "/uploads/players",
  express.static(path.join(__dirname, "uploads/players")),
);

// =============================
// DATABASE CONFIG — Supabase PostgreSQL
// =============================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// Helper to run queries
const query = (text, params) => pool.query(text, params);

// =============================
// MULTER CONFIG
// =============================

const yoyoStorage = multer.diskStorage({
  destination: "uploads/yoyos",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: yoyoStorage });

const colorStorage = multer.diskStorage({
  destination: "uploads/color-images",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadColor = multer({ storage: colorStorage });

// =============================
// PAYPAL SETUP
// =============================

function paypalClient() {
  const environment =
    process.env.PAYPAL_MODE === "production"
      ? new checkoutNodeJssdk.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET,
        )
      : new checkoutNodeJssdk.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET,
        );
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
}

// =============================
// GET ALL PRODUCTS
// =============================

app.get("/api/products", async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, price, stock, image_main, image_1, image_2,
             description, diameter, width, weight, gap_width, material
      FROM yoyos
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET SINGLE PRODUCT
// =============================

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, name, price, stock, image_main, image_1, image_2,
              description, diameter, width, weight, gap_width, material
       FROM yoyos WHERE id = $1`,
      [id],
    );
    if (!result.rows[0])
      return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET COLORS BY YOYO ID
// ============================

app.get("/api/color-images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, yoyo_id, color, image FROM yoyos_colors WHERE yoyo_id = $1`,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET COLORS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET PLAYERS
// =============================

app.get("/api/players", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, translator_name, image, signature_model, signature_link FROM players`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET PLAYERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// ADD PRODUCT
// =============================

app.post(
  "/api/products",
  upload.fields([
    { name: "image_main", maxCount: 1 },
    { name: "image_1", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        price,
        stock,
        description,
        diameter,
        width,
        weight,
        gap_width,
        material,
      } = req.body;

      if (!req.files || !req.files.image_main) {
        return res.status(400).json({ error: "Main image is required" });
      }

      const image_main = `/uploads/yoyos/${req.files.image_main[0].filename}`;
      const image_1 = req.files.image_1
        ? `/uploads/yoyos/${req.files.image_1[0].filename}`
        : null;
      const image_2 = req.files.image_2
        ? `/uploads/yoyos/${req.files.image_2[0].filename}`
        : null;

      const result = await query(
        `INSERT INTO yoyos (name, price, stock, description, image_main, image_1, image_2, diameter, width, weight, gap_width, material)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id`,
        [
          name,
          price,
          stock,
          description || "",
          image_main,
          image_1,
          image_2,
          diameter || null,
          width || null,
          weight || null,
          gap_width || null,
          material || null,
        ],
      );

      res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// =============================
// UPDATE PRODUCT
// =============================

app.put(
  "/api/products/:id",
  upload.fields([
    { name: "image_main", maxCount: 1 },
    { name: "image_1", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        stock,
        description,
        diameter,
        width,
        weight,
        gap_width,
        material,
      } = req.body;

      const image_main =
        req.files && req.files.image_main
          ? `/uploads/yoyos/${req.files.image_main[0].filename}`
          : null;
      const image_1 =
        req.files && req.files.image_1
          ? `/uploads/yoyos/${req.files.image_1[0].filename}`
          : null;
      const image_2 =
        req.files && req.files.image_2
          ? `/uploads/yoyos/${req.files.image_2[0].filename}`
          : null;

      await query(
        `UPDATE yoyos SET
          name        = $1,
          price       = $2,
          stock       = $3,
          description = $4,
          image_main  = COALESCE($5, image_main),
          image_1     = COALESCE($6, image_1),
          image_2     = COALESCE($7, image_2),
          diameter    = COALESCE($8, diameter),
          width       = COALESCE($9, width),
          weight      = COALESCE($10, weight),
          gap_width   = COALESCE($11, gap_width),
          material    = COALESCE($12, material)
         WHERE id = $13`,
        [
          name,
          price,
          stock,
          description || "",
          image_main,
          image_1,
          image_2,
          diameter || null,
          width || null,
          weight || null,
          gap_width || null,
          material || null,
          id,
        ],
      );

      res.json({ success: true });
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// ============================
// DELETE PRODUCT
// ============================

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const productResult = await query(
      `SELECT image_main, image_1, image_2 FROM yoyos WHERE id = $1`,
      [id],
    );
    const product = productResult.rows[0];
    if (!product) return res.status(404).json({ error: "Product not found" });

    [product.image_main, product.image_1, product.image_2].forEach((img) => {
      if (img) {
        const filePath = "." + img;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    const colorResult = await query(
      `SELECT image FROM yoyos_colors WHERE yoyo_id = $1`,
      [id],
    );
    colorResult.rows.forEach((c) => {
      if (c.image) {
        const filePath = "." + c.image;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await query(`DELETE FROM yoyos_colors WHERE yoyo_id = $1`, [id]);
    await query(`DELETE FROM yoyos WHERE id = $1`, [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ADD COLOR
// ============================

app.post("/api/color-images", uploadColor.single("image"), async (req, res) => {
  try {
    const { yoyo_id, color } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Color image is required" });
    if (!yoyo_id || !color)
      return res.status(400).json({ error: "yoyo_id and color are required" });

    const imagePath = `/uploads/color-images/${req.file.filename}`;
    const result = await query(
      `INSERT INTO yoyos_colors (yoyo_id, color, image) VALUES ($1,$2,$3) RETURNING id`,
      [yoyo_id, color, imagePath],
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("ADD COLOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// UPDATE COLOR
// ============================

app.put(
  "/api/color-images/:id",
  uploadColor.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { color } = req.body;
      const imagePath = req.file
        ? `/uploads/color-images/${req.file.filename}`
        : null;

      await query(
        `UPDATE yoyos_colors SET color = $1, image = COALESCE($2, image) WHERE id = $3`,
        [color, imagePath, id],
      );
      res.json({ success: true });
    } catch (err) {
      console.error("UPDATE COLOR ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// ============================
// DELETE COLOR
// ============================

app.delete("/api/color-images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`SELECT image FROM yoyos_colors WHERE id = $1`, [
      id,
    ]);
    const color = result.rows[0];
    if (!color) return res.status(404).json({ error: "Color not found" });

    if (color.image) {
      const filePath = "." + color.image;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await query(`DELETE FROM yoyos_colors WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE COLOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// REGISTER
// =============================

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await query(`SELECT id FROM accounts WHERE email = $1`, [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query(
      `INSERT INTO accounts (email, password, is_admin, date_created) VALUES ($1,$2,$3,NOW())`,
      [email, hashedPassword, false],
    );
    res.json({ success: true, message: "Register success" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// LOGIN
// =============================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query(
      `SELECT id, email, password, is_admin FROM accounts WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    res.json({
      success: true,
      user: { id: user.id, email: user.email, is_admin: user.is_admin },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET ALL ORDERS
// =============================

app.get("/api/orders", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, customer_id, customer_name, yoyo_id, yoyo_name,
              quantity, total_price, date, status
       FROM orders ORDER BY date DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// CREATE ORDER
// =============================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customer_id,
      customer_name,
      yoyo_id,
      yoyo_name,
      quantity,
      total_price,
    } = req.body;
    if (!yoyo_id || !quantity || !total_price) {
      return res
        .status(400)
        .json({ error: "yoyo_id, quantity and total_price are required" });
    }

    const result = await query(
      `INSERT INTO orders (customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price, date, status)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),$7) RETURNING id`,
      [
        customer_id || null,
        customer_name || "Guest",
        yoyo_id,
        yoyo_name,
        quantity,
        total_price,
        "pending",
      ],
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// UPDATE ORDER STATUS
// =============================

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });

    await query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// PAYPAL — CREATE ORDER
// =============================

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount, currency = "USD" } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value: amount } }],
    });

    const order = await paypalClient().execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("PayPal create-order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// PAYPAL — CAPTURE ORDER
// =============================

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const {
      orderID,
      customer_id,
      customer_name,
      yoyo_id,
      yoyo_name,
      quantity,
      total_price,
    } = req.body;
    if (!orderID) return res.status(400).json({ error: "orderID is required" });

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await paypalClient().execute(request);

    if (capture.result.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ success: false, status: capture.result.status });
    }

    const result = await query(
      `INSERT INTO orders (customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price, date, status)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),$7) RETURNING id`,
      [
        customer_id || null,
        customer_name || "Guest",
        yoyo_id,
        yoyo_name,
        quantity,
        total_price,
        "completed",
      ],
    );

    res.json({
      success: true,
      status: "COMPLETED",
      order_id: result.rows[0].id,
      details: capture.result,
    });
  } catch (err) {
    console.error("PayPal capture-order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// SERVER START
// =============================

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port: ${PORT}`),
);
