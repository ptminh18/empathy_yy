"use client";

import "./ProductList.css";
// import { useEffect, useState } from "react";

// const ProductCard = (item) => {
//   return (
//     <>
//       <div className="product-card">
//         <div className="image-container">
//           <img src={item.image} alt={item.name} />
//           {item.isSoldOut && <span className="badge">Sold out</span>}
//         </div>
//         <div className="product-information">
//           <h5 className="product-name">{item.name}</h5>
//           <p className="price">{item.price}</p>
//         </div>
//       </div>
//     </>
//   );
// };
// Main List Component
const ProductList = ({ products }) => {
  // const [loading, setLoading] = useState(true);
  // const [products, setProducts] = useState([]);
  const productCount = products.length;

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8080/api/products")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Network response was not ok");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Dữ liệu nhận được từ Backend:", data); // Xem ở F12 Trình duyệt
  //       const finalData = Array.isArray(data) ? data : data.recordset || [];
  //       setProducts(finalData);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Lỗi kết nối API:", err);
  //       setLoading(false);
  //     });
  // }, []);
  // if (loading) return <p>yoyo list is loading</p>;
  return (
    <>
      <div className="filter-and-product-count">
        <h5>Filter</h5>
        <h5>{productCount} products</h5>
      </div>
      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="image-container">
              <img src={item.image} alt={item.name} />
              {item.stock <= 0 && <span className="badge">Sold out</span>}
            </div>
            <div className="product-information">
              <h5 className="product-name">{item.name}</h5>
              <p className="price">{item.price.toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
