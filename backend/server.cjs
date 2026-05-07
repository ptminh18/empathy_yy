// // const path = require("path");
// // const fs = require("fs");
// // const express = require("express");
// // const sql = require("mssql");
// // const cors = require("cors");
// // const bcrypt = require("bcrypt");
// // const multer = require("multer");

// // const app = express();

// // // =============================
// // // MIDDLEWARE
// // // =============================

// // app.use(cors());
// // app.use(express.json());

// // app.use(
// //   "/uploads/yoyos",
// //   express.static(path.join(__dirname, "uploads/yoyos")),
// // );
// // app.use(
// //   "/uploads/color-images",
// //   express.static(path.join(__dirname, "uploads/color-images")),
// // );
// // app.use(
// //   "/uploads/players",
// //   express.static(path.join(__dirname, "uploads/players")),
// // );

// // // =============================
// // // DATABASE CONFIG
// // // =============================

// // const config = {
// //   user: "sa",
// //   password: "123456aA@",
// //   server: "localhost",
// //   database: "master",
// //   options: {
// //     encrypt: false,
// //     trustServerCertificate: true,
// //   },
// //   port: 1433,
// // };

// // // =============================
// // // MULTER CONFIG
// // // =============================

// // // const storage = multer.diskStorage({
// // //   destination: "uploads/yoyos",
// // //   filename: (req, file, cb) => {
// // //     const unique = Date.now() + "-" + file.originalname;
// // //     cb(null, unique);
// // //   },
// // // });
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     if (file.fieldname.startsWith("color_")) {
// //       cb(null, "uploads/color-images");
// //     } else {
// //       cb(null, "uploads/yoyos");
// //     }
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + path.extname(file.originalname));
// //   },
// // });

// // module.exports = multer({ storage });
// // const upload = multer({ storage });

// // // =============================
// // // GET ALL PRODUCTS
// // // =============================

// // app.get("/api/products", async (req, res) => {
// //   try {
// //     let pool = await sql.connect(config);
// //     let result = await pool.request().query(`
// //       SELECT
// //         id, name, price, stock,
// //         image_main, image_1, image_2,
// //         description, diameter, width, weight, gap_width, material
// //       FROM Yoyos
// //     `);
// //     res.json(result.recordset);
// //   } catch (err) {
// //     console.error("SQL ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =============================
// // // GET SINGLE PRODUCT
// // // =============================

// // app.get("/api/products/:id", async (req, res) => {
// //   try {
// //     const pool = await sql.connect(config);
// //     const { id } = req.params;
// //     const result = await pool.request().input("id", sql.Int, id).query(`
// //         SELECT
// //           id, name, price, stock,
// //           image_main, image_1, image_2,
// //           description, diameter, width, weight, gap_width, material
// //         FROM Yoyos
// //         WHERE id = @id
// //       `);

// //     if (!result.recordset[0]) {
// //       return res.status(404).json({ error: "Product not found" });
// //     }

// //     res.json(result.recordset[0]);
// //   } catch (err) {
// //     console.error("SQL ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ============================
// // // GET COLORS
// // // ============================

// // app.get("/api/color-images/:id", async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     let pool = await sql.connect(config);
// //     let result = await pool.request().input("id", sql.Int, id).query(`
// //         SELECT id, yoyo_id, color, image
// //         FROM Yoyos_Colors
// //         WHERE yoyo_id = @id
// //       `);
// //     res.json(result.recordset);
// //   } catch (err) {
// //     console.error("SQL ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =============================
// // // GET PLAYERS
// // // =============================

// // app.get("/api/players", async (req, res) => {
// //   try {
// //     let pool = await sql.connect(config);
// //     let result = await pool.request().query(`
// //       SELECT id, name, translator_name, image, signature_model, signature_link
// //       FROM Players
// //     `);
// //     res.json(result.recordset);
// //   } catch (err) {
// //     console.error("SQL ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =============================
// // // ADD PRODUCT
// // // =============================

// // app.post(
// //   "/api/products",
// //   // upload.fields([
// //   //   { name: "image_main", maxCount: 1 },
// //   //   { name: "image_1", maxCount: 1 },
// //   //   { name: "image_2", maxCount: 1 },
// //   // ]),
// //   upload.fields([
// //     { name: "image_main", maxCount: 1 },
// //     { name: "image_1", maxCount: 1 },
// //     { name: "image_2", maxCount: 1 },

// //     ...Array.from({ length: 10 }, (_, i) => ({
// //       name: `color_${i}`,
// //       maxCount: 1,
// //     })),
// //   ]),
// //   async (req, res) => {
// //     try {
// //       const pool = await sql.connect(config);
// //       const {
// //         name,
// //         price,
// //         stock,
// //         description,
// //         diameter,
// //         width,
// //         weight,
// //         gap_width,
// //         material,
// //       } = req.body;

// //       if (!req.files.image_main) {
// //         return res.status(400).json({ error: "Main image is required" });
// //       }

// //       const image_main = `/uploads/yoyos/${req.files.image_main[0].filename}`;
// //       const image_1 = req.files.image_1
// //         ? `/uploads/yoyos/${req.files.image_1[0].filename}`
// //         : null;
// //       const image_2 = req.files.image_2
// //         ? `/uploads/yoyos/${req.files.image_2[0].filename}`
// //         : null;

// //       await pool
// //         .request()
// //         .input("name", sql.NVarChar(255), name)
// //         .input("price", sql.Decimal(18, 2), price)
// //         .input("stock", sql.Int, stock)
// //         .input("description", sql.NVarChar(sql.MAX), description)
// //         .input("image_main", sql.NVarChar(500), image_main)
// //         .input("image_1", sql.NVarChar(500), image_1)
// //         .input("image_2", sql.NVarChar(500), image_2)
// //         .input("diameter", sql.Decimal(10, 2), diameter || null)
// //         .input("width", sql.Decimal(10, 2), width || null)
// //         .input("weight", sql.Decimal(10, 2), weight || null)
// //         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
// //         .input("material", sql.NVarChar(255), material || null).query(`
// //           INSERT INTO Yoyos
// //             (name, price, stock, description, image_main, image_1, image_2, diameter, width, weight, gap_width, material)
// //           VALUES
// //             (@name, @price, @stock, @description, @image_main, @image_1, @image_2, @diameter, @width, @weight, @gap_width, @material)
// //         `);

// //       res.json({ success: true });
// //     } catch (err) {
// //       console.error("ADD ERROR:", err);
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // =============================
// // // UPDATE PRODUCT
// // // =============================

// // app.put(
// //   "/api/products/:id",
// //   upload.fields([
// //     { name: "image_main", maxCount: 1 },
// //     { name: "image_1", maxCount: 1 },
// //     { name: "image_2", maxCount: 1 },
// //   ]),
// //   async (req, res) => {
// //     try {
// //       const pool = await sql.connect(config);
// //       const { id } = req.params;
// //       const {
// //         name,
// //         price,
// //         stock,
// //         description,
// //         diameter,
// //         width,
// //         weight,
// //         gap_width,
// //         material,
// //       } = req.body;

// //       const image_main = req.files.image_main
// //         ? `/uploads/yoyos/${req.files.image_main[0].filename}`
// //         : null;
// //       const image_1 = req.files.image_1
// //         ? `/uploads/yoyos/${req.files.image_1[0].filename}`
// //         : null;
// //       const image_2 = req.files.image_2
// //         ? `/uploads/yoyos/${req.files.image_2[0].filename}`
// //         : null;

// //       await pool
// //         .request()
// //         .input("id", sql.Int, id)
// //         .input("name", sql.NVarChar(255), name)
// //         .input("price", sql.Decimal(18, 2), price)
// //         .input("stock", sql.Int, stock)
// //         .input("description", sql.NVarChar(sql.MAX), description)
// //         .input("image_main", sql.NVarChar(500), image_main)
// //         .input("image_1", sql.NVarChar(500), image_1)
// //         .input("image_2", sql.NVarChar(500), image_2)
// //         .input("diameter", sql.Decimal(10, 2), diameter || null)
// //         .input("width", sql.Decimal(10, 2), width || null)
// //         .input("weight", sql.Decimal(10, 2), weight || null)
// //         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
// //         .input("material", sql.NVarChar(255), material || null).query(`
// //           UPDATE Yoyos SET
// //             name        = @name,
// //             price       = @price,
// //             stock       = @stock,
// //             description = @description,
// //             image_main  = COALESCE(@image_main, image_main),
// //             image_1     = COALESCE(@image_1, image_1),
// //             image_2     = COALESCE(@image_2, image_2),
// //             diameter    = COALESCE(@diameter, diameter),
// //             width       = COALESCE(@width, width),
// //             weight      = COALESCE(@weight, weight),
// //             gap_width   = COALESCE(@gap_width, gap_width),
// //             material    = COALESCE(@material, material)
// //           WHERE id = @id
// //         `);

// //       res.json({ success: true });
// //     } catch (err) {
// //       console.error("UPDATE ERROR:", err);
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // ============================
// // // DELETE PRODUCT
// // // ============================

// // app.delete("/api/products/:id", async (req, res) => {
// //   try {
// //     const pool = await sql.connect(config);
// //     const { id } = req.params;

// //     const result = await pool
// //       .request()
// //       .input("id", sql.Int, id)
// //       .query(`SELECT image_main, image_1, image_2 FROM Yoyos WHERE id = @id`);

// //     const product = result.recordset[0];

// //     if (!product) return res.status(404).json({ error: "Product not found" });

// //     [product.image_main, product.image_1, product.image_2].forEach((img) => {
// //       if (img) {
// //         const filePath = "." + img;
// //         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
// //       }
// //     });

// //     await pool
// //       .request()
// //       .input("id", sql.Int, id)
// //       .query(`DELETE FROM Yoyos WHERE id = @id`);

// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error("DELETE ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =============================
// // // REGISTER
// // // =============================

// // app.post("/api/register", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     let pool = await sql.connect(config);

// //     const checkUser = await pool
// //       .request()
// //       .input("email", sql.VarChar, email)
// //       .query("SELECT id FROM Accounts WHERE email = @email");

// //     if (checkUser.recordset.length > 0) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Email already exists" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     await pool
// //       .request()
// //       .input("email", sql.VarChar, email)
// //       .input("password", sql.VarChar, hashedPassword)
// //       .input("is_admin", sql.Bit, 0).query(`
// //         INSERT INTO Accounts (email, password, is_admin, date_created)
// //         VALUES (@email, @password, @is_admin, GETDATE())
// //       `);

// //     res.json({ success: true, message: "Register success" });
// //   } catch (err) {
// //     console.error("REGISTER ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =============================
// // // LOGIN
// // // =============================

// // app.post("/api/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     let pool = await sql.connect(config);

// //     const result = await pool
// //       .request()
// //       .input("email", sql.VarChar, email)
// //       .query(
// //         `SELECT id, email, password, is_admin FROM Accounts WHERE email = @email`,
// //       );

// //     const user = result.recordset[0];

// //     if (!user) {
// //       return res
// //         .status(401)
// //         .json({ success: false, message: "Invalid email or password" });
// //     }

// //     const valid = await bcrypt.compare(password, user.password);

// //     if (!valid) {
// //       return res
// //         .status(401)
// //         .json({ success: false, message: "Invalid email or password" });
// //     }

// //     res.json({
// //       success: true,
// //       user: { id: user.id, email: user.email, is_admin: user.is_admin },
// //     });
// //   } catch (err) {
// //     console.error("LOGIN ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // =====================
// // // GET NEW YOYO ID
// // // =====================
// // const yoyoResult = await pool.request().query(`
// //   SELECT TOP 1 id FROM Yoyos ORDER BY id DESC
// // `);
// // const yoyoId = yoyoResult.recordset[0].id;

// // // =====================
// // // PARSE COLORS
// // // =====================
// // let colors = [];

// // try {
// //   colors = JSON.parse(req.body.colors || "[]");
// // } catch (err) {
// //   return res.status(400).json({ error: "Invalid colors JSON" });
// // }

// // // =====================
// // // INSERT COLORS
// // // =====================
// // for (let i = 0; i < colors.length; i++) {
// //   const c = colors[i];
// //   const file = req.files[`color_${i}`]?.[0];

// //   const imagePath = file
// //     ? `/uploads/color-images/${file.filename}`
// //     : null;

// //   await pool
// //     .request()
// //     .input("yoyo_id", sql.Int, yoyoId)
// //     .input("color", sql.NVarChar(100), c.name)
// //     .input("image", sql.NVarChar(500), imagePath)
// //     .query(`
// //       INSERT INTO Yoyos_Colors (yoyo_id, color, image)
// //       VALUES (@yoyo_id, @color, @image)
// //     `);
// // }

// // // =============================
// // // SERVER START
// // // =============================

// // const PORT = 8080;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running: http://localhost:${PORT}`);
// // });

// const path = require("path");
// const fs = require("fs");
// const express = require("express");
// const sql = require("mssql");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const multer = require("multer");

// const app = express();

// // =============================
// // MIDDLEWARE
// // =============================

// app.use(cors());
// app.use(express.json());

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
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
//   port: 1433,
// };

// // =============================
// // MULTER CONFIG
// // =============================

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname.startsWith("color_")) {
//       cb(null, "uploads/color-images");
//     } else {
//       cb(null, "uploads/yoyos");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // =============================
// // GET ALL PRODUCTS
// // =============================

// app.get("/api/products", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT id, name, price, stock,
//              image_main, image_1, image_2,
//              description, diameter, width, weight, gap_width, material
//       FROM Yoyos
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
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

//     const product = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`SELECT * FROM Yoyos WHERE id = @id`);

//     if (!product.recordset[0]) {
//       return res.status(404).json({ error: "Not found" });
//     }

//     const colors = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(`SELECT * FROM Yoyos_Colors WHERE yoyo_id = @id`);

//     res.json({
//       ...product.recordset[0],
//       colors: colors.recordset,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// // ADD PRODUCT + COLORS
// // =============================

// app.post(
//   "/api/products",
//   upload.fields([
//     { name: "image_main", maxCount: 1 },
//     { name: "image_1", maxCount: 1 },
//     { name: "image_2", maxCount: 1 },
//     ...Array.from({ length: 10 }, (_, i) => ({
//       name: `color_${i}`,
//       maxCount: 1,
//     })),
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

//       if (!req.files.image_main) {
//         return res.status(400).json({ error: "Main image required" });
//       }

//       const image_main = `/uploads/yoyos/${req.files.image_main[0].filename}`;
//       const image_1 = req.files.image_1
//         ? `/uploads/yoyos/${req.files.image_1[0].filename}`
//         : null;
//       const image_2 = req.files.image_2
//         ? `/uploads/yoyos/${req.files.image_2[0].filename}`
//         : null;

//       // INSERT PRODUCT
//       const insert = await pool
//         .request()
//         .input("name", sql.NVarChar, name)
//         .input("price", sql.Decimal(18, 2), price)
//         .input("stock", sql.Int, stock)
//         .input("description", sql.NVarChar(sql.MAX), description)
//         .input("image_main", sql.NVarChar, image_main)
//         .input("image_1", sql.NVarChar, image_1)
//         .input("image_2", sql.NVarChar, image_2)
//         .input("diameter", sql.Decimal(10, 2), diameter || null)
//         .input("width", sql.Decimal(10, 2), width || null)
//         .input("weight", sql.Decimal(10, 2), weight || null)
//         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
//         .input("material", sql.NVarChar, material || null).query(`
//           INSERT INTO Yoyos (...)
//           OUTPUT INSERTED.id
//           VALUES (...)
//         `);

//       const yoyoId = insert.recordset[0].id;

//       // COLORS
//       const colors = JSON.parse(req.body.colors || "[]");

//       for (let i = 0; i < colors.length; i++) {
//         const c = colors[i];
//         const file = req.files[`color_${i}`]?.[0];

//         await pool
//           .request()
//           .input("yoyo_id", sql.Int, yoyoId)
//           .input("color", sql.NVarChar, c.name)
//           .input(
//             "image",
//             sql.NVarChar,
//             file ? `/uploads/color-images/${file.filename}` : null,
//           ).query(`
//             INSERT INTO Yoyos_Colors (yoyo_id, color, image)
//             VALUES (@yoyo_id, @color, @image)
//           `);
//       }

//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // =============================
// // UPDATE PRODUCT + COLORS
// // =============================

// app.put(
//   "/api/products/:id",
//   upload.fields([
//     { name: "image_main", maxCount: 1 },
//     { name: "image_1", maxCount: 1 },
//     { name: "image_2", maxCount: 1 },
//     ...Array.from({ length: 10 }, (_, i) => ({
//       name: `color_${i}`,
//       maxCount: 1,
//     })),
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

//       const image_main = req.files.image_main
//         ? `/uploads/yoyos/${req.files.image_main[0].filename}`
//         : null;
//       const image_1 = req.files.image_1
//         ? `/uploads/yoyos/${req.files.image_1[0].filename}`
//         : null;
//       const image_2 = req.files.image_2
//         ? `/uploads/yoyos/${req.files.image_2[0].filename}`
//         : null;

//       await pool
//         .request()
//         .input("id", sql.Int, id)
//         .input("name", sql.NVarChar, name)
//         .input("price", sql.Decimal(18, 2), price)
//         .input("stock", sql.Int, stock)
//         .input("description", sql.NVarChar(sql.MAX), description)
//         .input("image_main", sql.NVarChar, image_main)
//         .input("image_1", sql.NVarChar, image_1)
//         .input("image_2", sql.NVarChar, image_2)
//         .input("diameter", sql.Decimal(10, 2), diameter || null)
//         .input("width", sql.Decimal(10, 2), width || null)
//         .input("weight", sql.Decimal(10, 2), weight || null)
//         .input("gap_width", sql.Decimal(10, 2), gap_width || null)
//         .input("material", sql.NVarChar, material || null).query(`
//           UPDATE Yoyos SET ...
//           WHERE id = @id
//         `);

//       // DELETE OLD COLORS
//       await pool
//         .request()
//         .input("yoyo_id", sql.Int, id)
//         .query(`DELETE FROM Yoyos_Colors WHERE yoyo_id = @yoyo_id`);

//       // INSERT NEW COLORS
//       const colors = JSON.parse(req.body.colors || "[]");

//       for (let i = 0; i < colors.length; i++) {
//         const c = colors[i];
//         const file = req.files[`color_${i}`]?.[0];

//         await pool
//           .request()
//           .input("yoyo_id", sql.Int, id)
//           .input("color", sql.NVarChar, c.name)
//           .input(
//             "image",
//             sql.NVarChar,
//             file ? `/uploads/color-images/${file.filename}` : null,
//           ).query(`
//             INSERT INTO Yoyos_Colors (yoyo_id, color, image)
//             VALUES (@yoyo_id, @color, @image)
//           `);
//       }

//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // =============================
// // DELETE PRODUCT
// // =============================

// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const { id } = req.params;

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
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // =============================
// app.listen(8080, () => {
//   console.log("🚀 Server running at http://localhost:8080");
// });

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
// DATABASE CONFIG
// =============================

const config = {
  user: "sa",
  password: "123456aA@",
  server: "localhost",
  database: "master",
  options: { encrypt: false, trustServerCertificate: true },
  port: 1433,
};

// =============================
// MULTER CONFIG
// =============================

// For yoyo main images
const yoyoStorage = multer.diskStorage({
  destination: "uploads/yoyos",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: yoyoStorage });

// For color images
const colorStorage = multer.diskStorage({
  destination: "uploads/color-images",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadColor = multer({ storage: colorStorage });

// =============================
// GET ALL PRODUCTS
// =============================

app.get("/api/products", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT id, name, price, stock, image_main, image_1, image_2,
             description, diameter, width, weight, gap_width, material
      FROM Yoyos
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET SINGLE PRODUCT
// =============================

app.get("/api/products/:id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { id } = req.params;
    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT id, name, price, stock, image_main, image_1, image_2,
               description, diameter, width, weight, gap_width, material
        FROM Yoyos WHERE id = @id
      `);
    if (!result.recordset[0])
      return res.status(404).json({ error: "Product not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET COLORS BY YOYO ID
// ============================

app.get("/api/color-images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        `SELECT id, yoyo_id, color, image FROM Yoyos_Colors WHERE yoyo_id = @id`,
      );
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
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT id, name, translator_name, image, signature_model, signature_link FROM Players
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

      // Insert product and return new id
      const insertResult = await pool
        .request()
        .input("name", sql.NVarChar(255), name)
        .input("price", sql.Decimal(18, 2), price)
        .input("stock", sql.Int, stock)
        .input("description", sql.NVarChar(sql.MAX), description || "")
        .input("image_main", sql.NVarChar(500), image_main)
        .input("image_1", sql.NVarChar(500), image_1)
        .input("image_2", sql.NVarChar(500), image_2)
        .input("diameter", sql.Decimal(10, 2), diameter || null)
        .input("width", sql.Decimal(10, 2), width || null)
        .input("weight", sql.Decimal(10, 2), weight || null)
        .input("gap_width", sql.Decimal(10, 2), gap_width || null)
        .input("material", sql.NVarChar(255), material || null).query(`
          INSERT INTO Yoyos (name, price, stock, description, image_main, image_1, image_2, diameter, width, weight, gap_width, material)
          OUTPUT INSERTED.id
          VALUES (@name, @price, @stock, @description, @image_main, @image_1, @image_2, @diameter, @width, @weight, @gap_width, @material)
        `);

      const newYoyoId = insertResult.recordset[0].id;
      res.json({ success: true, id: newYoyoId });
    } catch (err) {
      console.error("ADD ERROR:", err);
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
      const pool = await sql.connect(config);
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

      await pool
        .request()
        .input("id", sql.Int, id)
        .input("name", sql.NVarChar(255), name)
        .input("price", sql.Decimal(18, 2), price)
        .input("stock", sql.Int, stock)
        .input("description", sql.NVarChar(sql.MAX), description || "")
        .input("image_main", sql.NVarChar(500), image_main)
        .input("image_1", sql.NVarChar(500), image_1)
        .input("image_2", sql.NVarChar(500), image_2)
        .input("diameter", sql.Decimal(10, 2), diameter || null)
        .input("width", sql.Decimal(10, 2), width || null)
        .input("weight", sql.Decimal(10, 2), weight || null)
        .input("gap_width", sql.Decimal(10, 2), gap_width || null)
        .input("material", sql.NVarChar(255), material || null).query(`
          UPDATE Yoyos SET
            name        = @name,
            price       = @price,
            stock       = @stock,
            description = @description,
            image_main  = COALESCE(@image_main, image_main),
            image_1     = COALESCE(@image_1, image_1),
            image_2     = COALESCE(@image_2, image_2),
            diameter    = COALESCE(@diameter, diameter),
            width       = COALESCE(@width, width),
            weight      = COALESCE(@weight, weight),
            gap_width   = COALESCE(@gap_width, gap_width),
            material    = COALESCE(@material, material)
          WHERE id = @id
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

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT image_main, image_1, image_2 FROM Yoyos WHERE id = @id`);

    const product = result.recordset[0];
    if (!product) return res.status(404).json({ error: "Product not found" });

    [product.image_main, product.image_1, product.image_2].forEach((img) => {
      if (img) {
        const filePath = "." + img;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    // Also delete color images from disk
    const colorResult = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT image FROM Yoyos_Colors WHERE yoyo_id = @id`);

    colorResult.recordset.forEach((c) => {
      if (c.image) {
        const filePath = "." + c.image;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Yoyos_Colors WHERE yoyo_id = @id`);
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Yoyos WHERE id = @id`);

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ADD COLOR TO YOYO
// ============================

app.post("/api/color-images", uploadColor.single("image"), async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { yoyo_id, color } = req.body;

    if (!req.file)
      return res.status(400).json({ error: "Color image is required" });
    if (!yoyo_id || !color)
      return res.status(400).json({ error: "yoyo_id and color are required" });

    const imagePath = `/uploads/color-images/${req.file.filename}`;

    const result = await pool
      .request()
      .input("yoyo_id", sql.Int, yoyo_id)
      .input("color", sql.NVarChar(100), color)
      .input("image", sql.NVarChar(500), imagePath).query(`
        INSERT INTO Yoyos_Colors (yoyo_id, color, image)
        OUTPUT INSERTED.id
        VALUES (@yoyo_id, @color, @image)
      `);

    res.json({ success: true, id: result.recordset[0].id });
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
      const pool = await sql.connect(config);
      const { id } = req.params;
      const { color } = req.body;

      const imagePath = req.file
        ? `/uploads/color-images/${req.file.filename}`
        : null;

      await pool
        .request()
        .input("id", sql.Int, id)
        .input("color", sql.NVarChar(100), color)
        .input("image", sql.NVarChar(500), imagePath).query(`
        UPDATE Yoyos_Colors SET
          color = @color,
          image = COALESCE(@image, image)
        WHERE id = @id
      `);

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
    const pool = await sql.connect(config);
    const { id } = req.params;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT image FROM Yoyos_Colors WHERE id = @id`);

    const color = result.recordset[0];
    if (!color) return res.status(404).json({ error: "Color not found" });

    if (color.image) {
      const filePath = "." + color.image;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Yoyos_Colors WHERE id = @id`);

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
    const pool = await sql.connect(config);

    const checkUser = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM Accounts WHERE email = @email");

    if (checkUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("is_admin", sql.Bit, 0)
      .query(
        `INSERT INTO Accounts (email, password, is_admin, date_created) VALUES (@email, @password, @is_admin, GETDATE())`,
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
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        `SELECT id, email, password, is_admin FROM Accounts WHERE email = @email`,
      );

    const user = result.recordset[0];
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
// SERVER START
// =============================

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running: http://localhost:${PORT}`),
);
