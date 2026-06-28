"use client";

import { Link } from "react-router-dom";

const ProductCard = ({ products }) => {
  // Kiểm tra nếu không có products để tránh lỗi map
  if (!products || !Array.isArray(products)) {
    return <p>No products found.</p>;
  }
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080";

  return (
    <div className="product-grid">
      {products.map((item) => (
        <Link
          to={`/products/${item.id}`}
          key={item.id} // Key nằm ở đây là đủ
          className="product-link"
        >
          <div className="product-card">
            <div className="image-container">
              <img src={`${API_BASE}${item.image_main}`} alt={item.name} />
              {/* Ảnh hover */}
              {item.image_1 && (
                <img
                  src={`${API_BASE}${item.image_1}`}
                  alt={`${item.name} hover`}
                  className="img-hover"
                />
              )}
              {item.stock <= 0 && <span className="badge">Sold out</span>}
            </div>

            <div className="product-information">
              <h5 className="product-name">{item.name}</h5>
              <p className="price">
                {item.price ? item.price.toLocaleString() : 0} VND
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
