/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import "./ProductManager.css";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_main: null,
    image_1: null,
    image_2: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (e) => {
  //   setFormData({ ...formData, imageFile: e.target.files[0] });
  // };
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  // =========================
  // OPEN EDIT
  // =========================

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image_main: null,
      image_1: null,
      image_2: null,
    });
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
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description || "");

    // Gửi đúng các field ảnh
    if (formData.image_main) data.append("image_main", formData.image_main);
    if (formData.image_1) data.append("image_1", formData.image_1);
    if (formData.image_2) data.append("image_2", formData.image_2);

    try {
      const url = editingId
        ? `http://127.0.0.1:8080/api/products/${editingId}`
        : "http://127.0.0.1:8080/api/products";

      // Lưu ý: Một số Backend yêu cầu PATCH thay vì PUT khi gửi FormData (multipart)
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data, // Không set Header Content-Type, trình duyệt sẽ tự làm
      });

      if (res.ok) {
        setOpen(false);
        setEditingId(null);
        // Reset form sạch sẽ
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          image_main: null,
          image_1: null,
          image_2: null,
        });
        fetchProducts();
      } else {
        const errorText = await res.text();
        console.log("Lỗi: " + errorText);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Product Management</h1>
        </div>

        <button
          className="btn-add"
          onClick={() => {
            setEditingId(null);
            setOpen(true);
          }}
        >
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
                    src={`http://127.0.0.1:8080${item.image_main}`}
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
          <div className="modal-content">
            <h2>{editingId ? "Update Product" : "Add new product"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <label>Price (VNĐ)</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />

                <label>Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />

                <label>Select Main Image</label>
                <input
                  name="image_main"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label>Select Image 1</label>
                <input
                  name="image_1"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label>Select Image 2</label>
                <input
                  name="image_2"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn">
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
