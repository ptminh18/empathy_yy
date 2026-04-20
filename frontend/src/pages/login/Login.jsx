import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/Header/Header.jsx";
import Footer from "../../layouts/Footer/Footer.jsx";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // Case 1: Admin user
        if (data.user.is_admin === 1 || data.user.is_admin === true) {
          navigate("/admin/product-manager");
        }
        // Case 2: Regular user
        else {
          navigate("/");
        }
      } else {
        // Case 3: Wrong email or password
        setError(
          data.message || "Invalid email or password. Please check again.",
        );
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-wrapper">
        <h1 className="login-title">Login</h1>

        {error && <div className="error-message">{error}</div>}

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

          <button type="submit" className="btn-sign-in" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
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
