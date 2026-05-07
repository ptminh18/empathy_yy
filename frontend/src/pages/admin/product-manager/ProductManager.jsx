import React, { useState, useEffect } from "react";
import "./ProductManager.css";

const API_BASE = "http://127.0.0.1:8080";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  diameter: "",
  width: "",
  weight: "",
  gap_width: "",
  material: "",
  image_main: null,
  image_1: null,
  image_2: null,
  colors: [],
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // =========================
  // COLOR HANDLERS
  // =========================

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { name: "", image: null, existingId: null, toDelete: false },
      ],
    }));
  };

  const handleColorChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], name: value };
      return { ...prev, colors: updated };
    });
  };

  const handleColorImageChange = (index, file) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], image: file };
      return { ...prev, colors: updated };
    });
  };

  const handleRemoveColor = (index) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      // If existing color (has id), mark for deletion; if new row, just remove
      if (updated[index].existingId) {
        updated[index] = { ...updated[index], toDelete: true };
      } else {
        updated.splice(index, 1);
      }
      return { ...prev, colors: updated };
    });
  };

  // =========================
  // OPEN EDIT
  // =========================

  const handleEdit = async (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      diameter: product.diameter || "",
      width: product.width || "",
      weight: product.weight || "",
      gap_width: product.gap_width || "",
      material: product.material || "",
      image_main: null,
      image_1: null,
      image_2: null,
      colors: [],
    });

    // Fetch existing colors from backend
    try {
      const res = await fetch(`${API_BASE}/api/color-images/${product.id}`);
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        colors: data.map((c) => ({
          existingId: c.id,
          name: c.color,
          image: null,
          imagePreview: `${API_BASE}${c.image}`,
          toDelete: false,
        })),
      }));
    } catch (err) {
      console.error("Fetch colors error:", err);
    }

    setOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpen(true);
  };

  // =========================
  // SUBMIT (ADD or UPDATE)
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !formData.image_main) {
      alert("Main image is required");
      return;
    }

    // Step 1: Save product
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description || "");
    data.append("diameter", formData.diameter || "");
    data.append("width", formData.width || "");
    data.append("weight", formData.weight || "");
    data.append("gap_width", formData.gap_width || "");
    data.append("material", formData.material || "");
    if (formData.image_main) data.append("image_main", formData.image_main);
    if (formData.image_1) data.append("image_1", formData.image_1);
    if (formData.image_2) data.append("image_2", formData.image_2);

    try {
      const url = editingId
        ? `${API_BASE}/api/products/${editingId}`
        : `${API_BASE}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: data });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Product save error:", errText);
        alert("Failed to save product: " + errText);
        return;
      }

      const result = await res.json();
      const yoyoId = editingId || result.id;

      // Step 2: Handle colors
      for (const row of formData.colors) {
        if (row.toDelete && row.existingId) {
          // Delete existing color
          await fetch(`${API_BASE}/api/color-images/${row.existingId}`, {
            method: "DELETE",
          });
        } else if (row.existingId && !row.toDelete) {
          // Update existing color
          const colorForm = new FormData();
          colorForm.append("color", row.name);
          if (row.image) colorForm.append("image", row.image);
          await fetch(`${API_BASE}/api/color-images/${row.existingId}`, {
            method: "PUT",
            body: colorForm,
          });
        } else if (!row.existingId && !row.toDelete && row.name && row.image) {
          // Add new color
          const colorForm = new FormData();
          colorForm.append("yoyo_id", yoyoId);
          colorForm.append("color", row.name);
          colorForm.append("image", row.image);
          await fetch(`${API_BASE}/api/color-images`, {
            method: "POST",
            body: colorForm,
          });
        }
      }

      setOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Product Management</h1>
        </div>
        <button className="btn-add" onClick={handleOpenAdd}>
          Add Product
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={item.id || index}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={`${API_BASE}${item.image_main}`}
                    alt="yoyo"
                    className="img-preview"
                  />
                </td>
                <td className="product-name">{item.name}</td>
                <td>{item.price?.toLocaleString()} đ</td>
                <td>{item.stock}</td>
                <td>
                  <div className="action-group">
                    <button className="btn" onClick={() => handleEdit(item)}>
                      Update
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal-content modern">
            <h2>{editingId ? "Update Product" : "Add New Product"}</h2>

            <form onSubmit={handleSubmit}>
              {/* BASIC INFO */}
              <div className="section">
                <div className="grid-2">
                  <div>
                    <label>Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Price (VNĐ)</label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SPECS */}
              <div className="section">
                <h3>Specifications</h3>
                <div className="grid-2">
                  <div>
                    <label>Diameter (mm)</label>
                    <input
                      name="diameter"
                      type="number"
                      step="0.01"
                      value={formData.diameter}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Width (mm)</label>
                    <input
                      name="width"
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Weight (g)</label>
                    <input
                      name="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Gap Width (mm)</label>
                    <input
                      name="gap_width"
                      type="number"
                      step="0.01"
                      value={formData.gap_width}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Material</label>
                    <input
                      name="material"
                      type="text"
                      value={formData.material}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* COLORS */}
              <div className="section">
                <div className="section-header">
                  <h3>Colors</h3>
                  <button
                    type="button"
                    className="btn-add"
                    onClick={handleAddColor}
                  >
                    + Add Color
                  </button>
                </div>

                <div className="color-grid">
                  {formData.colors.map((c, index) =>
                    c.toDelete ? null : (
                      <div key={index} className="color-card">
                        <input
                          type="text"
                          placeholder="Color name"
                          value={c.name}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleColorImageChange(index, e.target.files[0])
                          }
                        />
                        {/* Show new file preview or existing image */}
                        {c.image ? (
                          <img
                            src={URL.createObjectURL(c.image)}
                            className="preview"
                            alt="preview"
                          />
                        ) : c.imagePreview ? (
                          <img
                            src={c.imagePreview}
                            className="preview"
                            alt="preview"
                          />
                        ) : null}
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => handleRemoveColor(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* IMAGES */}
              <div className="section">
                <h3>Images</h3>
                <div className="grid-3">
                  <div>
                    <label>
                      Main Image {editingId ? "(blank = keep current)" : "*"}
                    </label>
                    <input
                      name="image_main"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <label>Image 1 (optional)</label>
                    <input
                      name="image_1"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <label>Image 2 (optional)</label>
                    <input
                      name="image_2"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="section">
                <h3>Description</h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* ACTIONS */}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
