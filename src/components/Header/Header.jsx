import logoHeader from "../../assets/images/empathy-icon-removebg.png";
import "./Header.css";

const Header = () => {
  const smallerLogo = document.querySelector(".logo-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      smallerLogo.classList.add("smaller");
    } else {
      smallerLogo.classList.remove("smaller");
    }
  });
  return (
    <>
      <div className="upper-header">
        <h5>\'ehmpǝθi\</h5>
      </div>
      <div className="header">
        <nav className="menu">
          <a href="/">
            <div className="logo-wrapper">
              <img className="logo-header" src={logoHeader} alt="empathy" />
            </div>
          </a>
          <a href="/yoyos">yoyos</a>
          <a href="/team">team</a>
          <a href="/blog">blog</a>
          <a href="/contact">contact us</a>
        </nav>
        <div className="icons">
          <span>🔍</span>
          <span>👤</span>
          <span>🛍</span>
        </div>
      </div>
    </>
  );
};

export default Header;
