/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "./Cart.css";
import "../../../styles/notification.css";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import PayPalButton from "../../../components/PaypalButton/PaypalButton.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080";
const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null); // "success" | null

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  // Sync cart state back to localStorage whenever it changes
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleIncrease = (index) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    saveCart(updated);
  };

  const handleDecrease = (index) => {
    const updated = [...cart];
    if (updated[index].quantity === 1) {
      // Remove item if quantity reaches 0
      updated.splice(index, 1);
    } else {
      updated[index].quantity -= 1;
    }
    saveCart(updated);
  };

  const handleDelete = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const totalVND = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalUSD = (totalVND / EXCHANGE_RATE).toFixed(2);

  // Read user from localStorage if logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Build orderInfo for PayPal — one combined order for all cart items
  // We send the first item's yoyo_id/name; for multi-item you'd want an Orders table that supports it
  const orderInfo = cart.map((item) => ({
    yoyo_id: item.yoyo_id,
    yoyo_name: item.yoyo_name,
    quantity: item.quantity,
    total_price: item.price * item.quantity,
    customer_id: user?.id || null,
    customer_name: user?.email || "Guest",
  }));

  const handlePaymentSuccess = () => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
    setCart([]);
    setNotification("success");
  };

  return (
    <>
      <Header />

      {/* SUCCESS NOTIFICATION BOX */}
      {notification === "success" && (
        <div className="notification-overlay blocking">
          <div className="notification-box">
            <div className="notification-tick">✓</div>
            <p>
              Thank you for supporting us,
              <br />
              your package will be transferred soon!
            </p>
            <button className="notification-back" onClick={() => navigate("/")}>
              Back to homepage
            </button>
          </div>
        </div>
      )}

      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="btn-back-shop" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img
                    src={`${API_BASE}${item.image}`}
                    alt={item.yoyo_name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.yoyo_name}</p>
                    <p className="cart-item-color">{item.color}</p>
                    <p className="cart-item-price">
                      {(item.price * item.quantity).toLocaleString()} VND
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-box">
                      <button onClick={() => handleDecrease(index)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(index)}>+</button>
                    </div>
                    <button
                      className="cart-delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p className="cart-total">
                Total: <span>{totalVND.toLocaleString()} VND</span>
              </p>
              <p className="cart-total-usd">≈ ${totalUSD} USD</p>

              <div className="paypal-wrapper">
                <PayPalButton
                  amount={totalUSD}
                  orderInfo={orderInfo[0]} // passes first item; extend if needed
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    alert("Payment failed. Please try again.");
                    console.error(err);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
