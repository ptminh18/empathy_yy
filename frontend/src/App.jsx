import "./App.css";
import Homepage from "./pages/user/home/Home.jsx";
import YoyosPage from "./pages/user/yoyos/Yoyos.jsx";
import TeamPage from "./pages/user/team/Team.jsx";
import BlogPage from "./pages/user/blog/Blog.jsx";
import ContactPage from "./pages/user/contact/Contact.jsx";
import LoginPage from "./pages/login/Login";
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/yoyos" element={<YoyosPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
