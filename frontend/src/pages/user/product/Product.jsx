"use client";

import "./Product.css";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const API_BASE = "http://127.0.0.1:8080";

  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [selectedColorName, setSelectedColorName] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 1. Fetch main product (Table Yoyos)
  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        // image_main is only a fallback — colors useEffect will override if colors exist
        setMainImage(data.image_main);
        setSelectedColorName(data.color_default || data.name);
      })
      .catch((err) => console.error("Fetch product error:", err));
  }, [id]);

  // 2. Fetch color variants (Table Yoyos_Colors)
  // First color always becomes the default image, regardless of how many colors exist
  useEffect(() => {
    fetch(`${API_BASE}/api/color-images/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const colorList = Array.isArray(data) ? data : [data];
        setColors(colorList);
        if (colorList.length > 0) {
          setMainImage(colorList[0].image);
          setSelectedColorName(colorList[0].color);
        }
      })
      .catch((err) => console.error("Fetch colors error:", err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  const thumbnailImages = [
    product.image_main,
    product.image_1,
    product.image_2,
  ].filter(Boolean);

  return (
    <>
      <Header />

      <div className="product-container">
        {/* LEFT GALLERY */}
        <div className="product-gallery">
          <img
            className="main-image"
            src={`${API_BASE}${mainImage}`}
            alt={product.name}
          />

          <div className="thumbnail-row">
            {thumbnailImages.map((img, i) => (
              <img
                key={i}
                src={`${API_BASE}${img}`}
                onClick={() => {
                  setMainImage(img);
                  if (colors.length === 1)
                    setSelectedColorName(colors[0].color);
                }}
                className={`thumb ${mainImage === img ? "active" : ""}`}
                alt="thumbnail"
              />
            ))}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="price-container">
            <span className="current-price">
              {product.price?.toLocaleString()} VND
            </span>
            <span className="sold-out-badge">
              {product.stock > 0 ? "" : "Sold out"}
            </span>
          </div>
          <p className="tax-note">Tax included.</p>

          <div className="product-option">
            <div className="color-pills">
              {colors.map((colorItem, index) => (
                <button
                  key={index}
                  className={`color-btn ${colors.length === 1 || mainImage === colorItem.image ? "selected" : ""}`}
                  onClick={() => {
                    setMainImage(colorItem.image);
                    setSelectedColorName(colorItem.color);
                  }}
                >
                  {colorItem.color}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="product-option">
            <p>Quantity</p>
            <div className="quantity-box">
              <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <button
            className={`add-cart ${product.stock === 0 ? "disabled" : ""}`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Sold out" : "Add to cart"}
          </button>

          <button className="buy-shop">Buy with shop</button>

          <div className="divider"></div>

          {/* DESCRIPTION & SPECS */}
          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="divider"></div>

          <div className="specs">
            <h3>Specifications</h3>
            <p>diameter: {product.diameter}mm</p>
            <p>width: {product.width}mm</p>
            <p>weight: {product.weight}g</p>
            <p>gap width: {product.gap_width}mm</p>
            <p>material: {product.material}</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
