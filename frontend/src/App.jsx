import "./App.css";
import Homepage from "./pages/user/home/Home.jsx";
import YoyosPage from "./pages/user/yoyos/Yoyos.jsx";
import TeamPage from "./pages/user/team/Team.jsx";
import BlogPage from "./pages/user/blog/Blog.jsx";
import ContactPage from "./pages/user/contact/Contact.jsx";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/Register.jsx";
import Dashboard from "./pages/admin/dashboard/Dashboard.jsx";
import ProductManager from "./pages/admin/product-manager/ProductManager.jsx";
import ProductPage from "./pages/user/product/Product.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/yoyos" element={<YoyosPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product-manager" element={<ProductManager />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
