"use client";

import "./Product.css";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image_main);
      })
      .catch((err) => console.error("Fetch product error:", err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  const images = [product.image_main, product.image_1, product.image_2].filter(
    Boolean,
  );

  return (
    <>
      <Header />

      <div className="product-container">
        {/* LEFT GALLERY */}
        <div className="product-gallery">
          <img
            className="main-image"
            src={`http://127.0.0.1:8080${mainImage}`}
            alt={product.name}
          />

          <div className="thumbnail-row">
            {images.map((img, i) => (
              <img
                key={i}
                src={`http://127.0.0.1:8080${img}`}
                onClick={() => setMainImage(img)}
                className="thumb"
              />
            ))}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-price">
            {product.price.toLocaleString()} VND
            <span className="stock-status">
              {product.stock > 0 ? "In stock" : "Sold out"}
            </span>
          </div>

          {/* COLOR */}
          <div className="product-option">
            <p>Color</p>
            <button className="color-btn">polished baby blue</button>
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

          {/* DESCRIPTION */}

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="divider"></div>

          {/* SPECIFICATIONS */}

          <div className="specs">
            <h3>Specifications</h3>

            <p>diameter: 54mm</p>
            <p>width: 48.5mm</p>
            <p>weight: 66.1g</p>
            <p>gap width: 4.5mm</p>
            <p>material: 7075 aluminium</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
