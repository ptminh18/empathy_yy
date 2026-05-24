// "use client";

// import "./Product.css";
// import Header from "../../../layouts/Header/Header.jsx";
// import Footer from "../../../layouts/Footer/Footer.jsx";
// import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
// import PayPalButton from "../../../components/PayPalButton/PayPalButton.jsx";
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND — update to your real rate

// const ProductPage = () => {
//   const { id } = useParams();
//   const API_BASE = "http://127.0.0.1:8080";

//   const [product, setProduct] = useState(null);
//   const [colors, setColors] = useState([]);
//   const [mainImage, setMainImage] = useState(null);
//   const [selectedColorName, setSelectedColorName] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   // 1. Fetch main product (Table Yoyos)
//   useEffect(() => {
//     fetch(`${API_BASE}/api/products/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProduct(data);
//         setMainImage(data.image_main);
//         setSelectedColorName(data.color_default || data.name);
//       })
//       .catch((err) => console.error("Fetch product error:", err));
//   }, [id]);

//   // 2. Fetch color variants (Table Yoyos_Colors)
//   // First color always becomes the default image
//   useEffect(() => {
//     fetch(`${API_BASE}/api/color-images/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const colorList = Array.isArray(data) ? data : [data];
//         setColors(colorList);
//         if (colorList.length > 0) {
//           setMainImage(colorList[0].image);
//           setSelectedColorName(colorList[0].color);
//         }
//       })
//       .catch((err) => console.error("Fetch colors error:", err));
//   }, [id]);

//   // 3. Fetch related products — exclude current, pick 4 random
//   useEffect(() => {
//     fetch(`${API_BASE}/api/products`)
//       .then((res) => res.json())
//       .then((data) => {
//         const others = data.filter((p) => p.id !== parseInt(id));
//         const shuffled = others.sort(() => Math.random() - 0.5);
//         setRelatedProducts(shuffled.slice(0, 4));
//       })
//       .catch((err) => console.error("Fetch related products error:", err));
//   }, [id]);

//   if (!product) return <p>Loading product...</p>;

//   const thumbnailImages = [
//     product.image_main,
//     product.image_1,
//     product.image_2,
//   ].filter(Boolean);

//   // PayPal amount: convert VND → USD, multiply by quantity
//   const amountUSD = ((product.price * quantity) / EXCHANGE_RATE).toFixed(2);

//   // Order info passed to PayPal capture route
//   const orderInfo = {
//     yoyo_id: product.id,
//     yoyo_name: product.name,
//     quantity: quantity,
//     total_price: product.price * quantity,
//     // customer_id and customer_name: fill in from your auth/session if available
//     customer_id: null,
//     customer_name: "Guest",
//   };

//   return (
//     <>
//       <Header />

//       <div className="product-container">
//         {/* LEFT GALLERY */}
//         <div className="product-gallery">
//           <img
//             className="main-image"
//             src={`${API_BASE}${mainImage}`}
//             alt={product.name}
//           />

//           <div className="thumbnail-row">
//             {thumbnailImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={`${API_BASE}${img}`}
//                 onClick={() => {
//                   setMainImage(img);
//                   if (colors.length === 1)
//                     setSelectedColorName(colors[0].color);
//                 }}
//                 className={`thumb ${mainImage === img ? "active" : ""}`}
//                 alt="thumbnail"
//               />
//             ))}
//           </div>
//         </div>

//         {/* RIGHT INFO */}
//         <div className="product-info">
//           <h1 className="product-title">{product.name}</h1>

//           <div className="price-container">
//             <span className="current-price">
//               {product.price?.toLocaleString()} VND
//             </span>
//             <span className="sold-out-badge">
//               {product.stock > 0 ? "" : "Sold out"}
//             </span>
//           </div>
//           <p className="tax-note">Tax included.</p>

//           {/* COLOR PILLS */}
//           <div className="product-option">
//             <div className="color-pills">
//               {colors.map((colorItem, index) => (
//                 <button
//                   key={index}
//                   className={`color-btn ${colors.length === 1 || mainImage === colorItem.image ? "selected" : ""}`}
//                   onClick={() => {
//                     setMainImage(colorItem.image);
//                     setSelectedColorName(colorItem.color);
//                   }}
//                 >
//                   {colorItem.color}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* QUANTITY */}
//           <div className="product-option">
//             <p>Quantity</p>
//             <div className="quantity-box">
//               <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
//                 -
//               </button>
//               <span>{quantity}</span>
//               <button onClick={() => setQuantity((q) => q + 1)}>+</button>
//             </div>
//           </div>

//           {/* ACTION BUTTONS */}
//           <button
//             className={`add-cart ${product.stock === 0 ? "disabled" : ""}`}
//             disabled={product.stock === 0}
//           >
//             {product.stock === 0 ? "Sold out" : "Add to cart"}
//           </button>

//           {/* PAYPAL BUTTON — only show if in stock */}
//           {product.stock > 0 && (
//             <div className="paypal-wrapper">
//               {paymentSuccess ? (
//                 <p className="payment-success">
//                   ✅ Payment successful! Your order has been placed.
//                 </p>
//               ) : (
//                 <PayPalButton
//                   amount={amountUSD}
//                   orderInfo={orderInfo}
//                   onSuccess={(result) => {
//                     setPaymentSuccess(true);
//                     console.log("Order placed:", result.order_id);
//                   }}
//                   onError={(err) => {
//                     alert("Payment failed. Please try again.");
//                     console.error(err);
//                   }}
//                 />
//               )}
//             </div>
//           )}

//           <div className="divider"></div>

//           {/* DESCRIPTION */}
//           <div className="description">
//             <h3>Description</h3>
//             <p>{product.description}</p>
//           </div>

//           <div className="divider"></div>

//           {/* SPECS */}
//           <div className="specs">
//             <h3>Specifications</h3>
//             <p>
//               <b>diameter:</b> {product.diameter}mm
//             </p>
//             <p>
//               <b>width:</b> {product.width}mm
//             </p>
//             <p>
//               <b>weight:</b> {product.weight}g
//             </p>
//             <p>
//               <b>gap width:</b> {product.gap_width}mm
//             </p>
//             <p>
//               <b>material:</b> {product.material}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
//       {relatedProducts.length > 0 && (
//         <div className="related-products">
//           <div className="related-products-title">
//             <h2>You may also like</h2>
//           </div>
//           <ProductCard products={relatedProducts} />
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;

import "./Product.css";
import "../../../styles/notification.css";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [notification, setNotification] = useState(null); // "added" | null

  // 1. Fetch main product
  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image_main);
        setSelectedColorName(data.color_default || data.name);
      })
      .catch((err) => console.error("Fetch product error:", err));
  }, [id]);

  // 2. Fetch color variants
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

  // 3. Fetch related products
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const others = data.filter((p) => p.id !== parseInt(id));
        const shuffled = others.sort(() => Math.random() - 0.5);
        setRelatedProducts(shuffled.slice(0, 4));
      })
      .catch((err) => console.error("Fetch related products error:", err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  const thumbnailImages = [
    product.image_main,
    product.image_1,
    product.image_2,
  ].filter(Boolean);

  // Add to cart — saves into localStorage
  const handleAddToCart = () => {
    if (product.stock === 0) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if same product + same color already in cart
    const existingIndex = cart.findIndex(
      (item) => item.yoyo_id === product.id && item.color === selectedColorName,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        yoyo_id: product.id,
        yoyo_name: product.name,
        color: selectedColorName,
        image: mainImage,
        price: product.price,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Show "Added to cart!" notification for 2 seconds
    setNotification("added");
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <>
      <Header />

      {/* NOTIFICATION BOX */}
      {notification === "added" && (
        <div className="notification-overlay">
          <div className="notification-box">
            <p>Added to cart!</p>
          </div>
        </div>
      )}

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

          {/* COLOR PILLS */}
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

          {/* ADD TO CART */}
          <button
            className={`add-cart ${product.stock === 0 ? "disabled" : ""}`}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
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

          {/* SPECS */}
          <div className="specs">
            <h3>Specifications</h3>
            <p>
              <b>diameter:</b> {product.diameter}mm
            </p>
            <p>
              <b>width:</b> {product.width}mm
            </p>
            <p>
              <b>weight:</b> {product.weight}g
            </p>
            <p>
              <b>gap width:</b> {product.gap_width}mm
            </p>
            <p>
              <b>material:</b> {product.material}
            </p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <div className="related-products-title">
            <h2>You may also like</h2>
          </div>
          <ProductCard products={relatedProducts} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductPage;
