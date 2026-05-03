"use client";

import { Link } from "react-router";
import "./ProductList.css";
import ProductCard from "../ProductCard/ProductCard.jsx";
const ProductList = ({ products = [] }) => {
  const productCount = products.length;
  return (
    <>
      <div className="filter-and-product-count">
        <h5>Filter</h5>
        <h5>{productCount} products</h5>
      </div>
      <div>
        <ProductCard products={products} />
      </div>
    </>
  );
};

export default ProductList;
