const path = require("path");
const fs = require("fs");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();

// =============================
// MIDDLEWARE
// =============================

app.use(cors());
app.use(express.json());

// cho phép truy cập ảnh upload
app.use(
  "/uploads/yoyos",
  express.static(path.join(__dirname, "uploads/yoyos")),
);
// cho phép truy cập ảnh players
app.use(
  "/uploads/players",
  express.static(path.join(__dirname, "uploads/players")),
);
// =============================
// DATABASE CONFIG
// =============================

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

// =============================
// MULTER CONFIG
// =============================

const storage = multer.diskStorage({
  destination: "uploads/yoyos",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// =============================
// GET PRODUCTS
// =============================

app.get("/api/products", async (req, res) => {
  try {
    let pool = await sql.connect(config);

    let result = await pool.request().query(`
  SELECT
    id,
    name,
    price,
    stock,
    image_main,
    image_1,
    image_2,
    description
  FROM Yoyos
`);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET PLAYERS
// =============================
app.get("/api/players", async (req, res) => {
  try {
    let pool = await sql.connect(config);

    let result = await pool.request().query(`
  SELECT
    id,
    name,
    translator_name,
    image,
    signature_model,
    signature_link
  FROM Players
`);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL ERROR:", err);
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
      const pool = await sql.connect(config);

      const { name, price, stock, description } = req.body;

      if (!req.files.image_main) {
        return res.status(400).json({ error: "Main image is required" });
      }

      const image_main = `/uploads/yoyos/${req.files.image_main[0].filename}`;

      const image_1 = req.files.image_1
        ? `/uploads/yoyos/${req.files.image_1[0].filename}`
        : null;

      const image_2 = req.files.image_2
        ? `/uploads/yoyos/${req.files.image_2[0].filename}`
        : null;

      await pool
        .request()
        .input("name", sql.NVarChar(255), name)
        .input("price", sql.Decimal(18, 2), price)
        .input("stock", sql.Int, stock)
        .input("description", sql.NVarChar(sql.MAX), description)
        .input("image_main", sql.NVarChar(500), image_main)
        .input("image_1", sql.NVarChar(500), image_1)
        .input("image_2", sql.NVarChar(500), image_2).query(`
          INSERT INTO Yoyos
          (name, price, stock, description, image_main, image_1, image_2)
          VALUES
          (@name,@price,@stock,@description,@image_main,@image_1,@image_2)
        `);

      res.json({ success: true });
    } catch (err) {
      console.error("ADD ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);
// =============================
// REGISTER
// =============================
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    let pool = await sql.connect(config);

    const checkUser = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM Accounts WHERE email=@email");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("is_admin", sql.Bit, 0).query(`
        INSERT INTO Accounts (email,password,is_admin,date_created)
        VALUES (@email,@password,@is_admin,GETDATE())
      `);

    res.json({
      success: true,
      message: "Register success",
    });
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

    let pool = await sql.connect(config);

    const result = await pool.request().input("email", sql.VarChar, email)
      .query(`
        SELECT id,email,password,is_admin
        FROM Accounts
        WHERE email=@email
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

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
      const pool = await sql.connect(config);

      const { id } = req.params;
      const { name, price, stock, description } = req.body;

      const image_main = req.files.image_main
        ? `/uploads/yoyos/${req.files.image_main[0].filename}`
        : null;

      const image_1 = req.files.image_1
        ? `/uploads/yoyos/${req.files.image_1[0].filename}`
        : null;

      const image_2 = req.files.image_2
        ? `/uploads/yoyos/${req.files.image_2[0].filename}`
        : null;

      await pool
        .request()
        .input("id", sql.Int, id)
        .input("name", sql.NVarChar(255), name)
        .input("price", sql.Decimal(18, 2), price)
        .input("stock", sql.Int, stock)
        .input("description", sql.NVarChar(sql.MAX), description)
        .input("image_main", sql.NVarChar(500), image_main)
        .input("image_1", sql.NVarChar(500), image_1)
        .input("image_2", sql.NVarChar(500), image_2).query(`
          UPDATE Yoyos
          SET
            name=@name,
            price=@price,
            stock=@stock,
            description=@description,
            image_main = COALESCE(@image_main,image_main),
            image_1 = COALESCE(@image_1,image_1),
            image_2 = COALESCE(@image_2,image_2)
          WHERE id=@id
        `);

      res.json({ success: true });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },
);
// ============================
// DELETE PRODUCT
// ============================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { id } = req.params;

    const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT image_main,image_1,image_2
      FROM Yoyos
      WHERE id=@id
    `);

    const product = result.recordset[0];

    const images = [product.image_main, product.image_1, product.image_2];

    images.forEach((img) => {
      if (img) {
        const filePath = "." + img;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Yoyos WHERE id=@id
    `);

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// =============================
// SERVER START
// =============================

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
