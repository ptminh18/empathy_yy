import React, { useState } from "react";
import Header from "../../layouts/Header/Header.jsx";
import Footer from "../../layouts/Footer/Footer.jsx";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
  };

  return (
    <>
      <Header />
      <div className="login-wrapper">
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <a href="/forgot-password">Forgot your password?</a>
          </div>

          <button type="submit" className="btn-sign-in">
            Sign in
          </button>

          <div className="form-footer">
            <a href="/register">Create account</a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
