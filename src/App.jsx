import "./App.css";
import Homepage from "./components/Homepage/Homepage.jsx";
import YoyosPage from "./components/YoyosPage/YoyosPage.jsx";
import TeamPage from "./components/TeamPage/TeamPage.jsx";
import BlogPage from "./components/BlogPage/BlogPage.jsx";
import ContactPage from "./components/ContactPage/ContactPage.jsx";
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
      </Routes>
    </>
  );
}

export default App;
