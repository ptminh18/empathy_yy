import logoHeader from "../../assets/images/empathy-icon-removebg.png";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoBagOutline,
} from "react-icons/io5";
import "./Header.css";

const Header = () => {
  // const smallerLogo = document.querySelector(".logo-header");

  // window.addEventListener("scroll", function () {
  //   if (window.scrollY > 50) {
  //     smallerLogo.classList.add("smaller");
  //   } else {
  //     smallerLogo.classList.remove("smaller");
  //   }
  // });
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
        <div className="nav-icons">
          <a>
            <IoSearchOutline size={25} />
          </a>
          <a href="/login">
            <IoPersonOutline size={25} />
          </a>
          <a>
            <IoBagOutline size={25} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
