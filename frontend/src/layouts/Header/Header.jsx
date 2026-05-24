// // import { useState, useEffect, useRef } from "react";
// // import logoHeader from "../../assets/images/empathy-icon-removebg.png";
// // import {
// //   IoPersonOutline,
// //   IoBagOutline,
// //   IoLogoInstagram,
// //   IoLogoYoutube,
// // } from "react-icons/io5";
// // import { IoCloseOutline } from "react-icons/io5";
// // import "./Header.css";
// // import SearchBar from "../../components/SearchBar/SearchBar.jsx";

// // const Header = () => {
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const logoRef = useRef(null);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       if (window.innerWidth > 768) {
// //         if (window.scrollY > 50) {
// //           logoRef.current.classList.add("smaller");
// //         } else {
// //           logoRef.current.classList.remove("smaller");
// //         }
// //       }
// //     };
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   useEffect(() => {
// //     if (menuOpen) {
// //       const scrollbarWidth =
// //         window.innerWidth - document.documentElement.clientWidth;
// //       document.body.style.overflow = "hidden";
// //       document.body.style.paddingRight = `${scrollbarWidth}px`;
// //     } else {
// //       document.body.style.overflow = "";
// //       document.body.style.paddingRight = "";
// //     }
// //     return () => {
// //       document.body.style.overflow = "";
// //       document.body.style.paddingRight = "";
// //     };
// //   }, [menuOpen]);

// //   return (
// //     <>
// //       <div className="upper-header">
// //         <h5>\'ehmpǝθi\</h5>
// //       </div>
// //       <div className="header">
// //         {/* LEFT — logo + desktop nav */}
// //         <div className="header-left">
// //           {/* Mobile hamburger */}
// //           <button
// //             className="hamburger"
// //             onClick={() => setMenuOpen(!menuOpen)} // 🔄 This toggles it back and forth automatically
// //             aria-label={menuOpen ? "Close menu" : "Open menu"}
// //           >
// //             {menuOpen ? (
// //               /* 1. IF MENU IS OPEN: Show the "X" Icon */
// //               <span
// //                 style={{
// //                   position: "relative",
// //                   display: "block",
// //                   width: "24px",
// //                   height: "24px",
// //                 }}
// //               >
// //                 {/* Diagonal Line 1 */}
// //                 <span
// //                   style={{
// //                     position: "absolute",
// //                     top: "11px",
// //                     left: "0",
// //                     width: "100%",
// //                     height: "2px",
// //                     backgroundColor: "#ffffff",
// //                     transform: "rotate(45deg)",
// //                   }}
// //                 ></span>
// //                 {/* Diagonal Line 2 */}
// //                 <span
// //                   style={{
// //                     position: "absolute",
// //                     top: "11px",
// //                     left: "0",
// //                     width: "100%",
// //                     height: "2px",
// //                     backgroundColor: "#ffffff",
// //                     transform: "rotate(-45deg)",
// //                   }}
// //                 ></span>
// //               </span>
// //             ) : (
// //               /* 2. IF MENU IS CLOSED: Show the Triple Line Hamburger Icon */
// //               <>
// //                 <span></span>
// //                 <span></span>
// //                 <span></span>
// //               </>
// //             )}
// //           </button>

// //           {/* Logo — always visible */}
// //           <a href="/" className="logo-link">
// //             <img
// //               ref={logoRef}
// //               className="logo-header"
// //               src={logoHeader}
// //               alt="empathy"
// //             />
// //           </a>

// //           {/* Desktop nav links */}
// //           <nav className="menu">
// //             <a href="/yoyos">yoyos</a>
// //             <a href="/team">team</a>
// //             <a href="/blog">blog</a>
// //             <a href="/contact">contact us</a>
// //           </nav>
// //         </div>

// //         {/* RIGHT */}
// //         <div className="nav-icons">
// //           <SearchBar />
// //           <a href="/login" className="desktop-only">
// //             <IoPersonOutline size={25} />
// //           </a>
// //           <a href="/cart">
// //             <IoBagOutline size={25} />
// //           </a>
// //         </div>
// //       </div>
// //       {/* MOBILE MENU OVERLAY */}
// //       {menuOpen && (
// //         <>
// //           {/* Backdrop */}
// //           <div
// //             className="mobile-nav-backdrop"
// //             onClick={() => setMenuOpen(false)}
// //           ></div>
// //           {/* <button
// //             className="mobile-nav-close"
// //             onClick={() => setMenuOpen(false)}
// //           >
// //             <IoCloseOutline size={30} color="#fff" />
// //           </button> */}
// //           <div className="mobile-nav">
// //             {/* Nav links */}
// //             <div className="mobile-nav-links">
// //               <a href="/yoyos" onClick={() => setMenuOpen(false)}>
// //                 yoyos
// //               </a>
// //               <a href="/team" onClick={() => setMenuOpen(false)}>
// //                 team
// //               </a>
// //               <a href="/blog" onClick={() => setMenuOpen(false)}>
// //                 blog
// //               </a>
// //               <a href="/contact" onClick={() => setMenuOpen(false)}>
// //                 contact us
// //               </a>
// //             </div>

// //             {/* Bottom — login + social */}
// //             <div className="mobile-nav-bottom">
// //               <a
// //                 href="/login"
// //                 className="mobile-nav-login"
// //                 onClick={() => setMenuOpen(false)}
// //               >
// //                 <IoPersonOutline size={20} />
// //                 Log in
// //               </a>
// //               <div className="mobile-nav-social">
// //                 <a
// //                   href="https://instagram.com"
// //                   target="_blank"
// //                   rel="noreferrer"
// //                 >
// //                   <IoLogoInstagram size={24} />
// //                 </a>
// //                 <a href="https://youtube.com" target="_blank" rel="noreferrer">
// //                   <IoLogoYoutube size={24} />
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}{" "}
// //     </>
// //   );
// // };

// // export default Header;

import { useState, useEffect, useRef } from "react";
import logoHeader from "../../assets/images/empathy-icon-removebg.png";
import {
  IoPersonOutline,
  IoBagOutline,
  IoLogoInstagram,
  IoLogoYoutube,
} from "react-icons/io5";
import "./Header.css";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wasMounted, setWasMounted] = useState(false);
  const logoRef = useRef(null);

  // 1. TIMING FIX: Delay animations by 100ms so the browser paints the hidden state first
  useEffect(() => {
    const timer = setTimeout(() => {
      setWasMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 2. SCROLL FIX: Shrink logo on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        if (window.scrollY > 50) {
          logoRef.current?.classList.add("smaller");
        } else {
          logoRef.current?.classList.remove("smaller");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. OVERFLOW FIX: Lock background scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="upper-header">
        <h5>\'ehmpǝθi\</h5>
      </div>

      <div className="header">
        {/* LEFT — Hamburger + Logo + Desktop Nav */}
        <div className="header-left">
          {/* Mobile hamburger toggler */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              /* "X" Close Button */
              <div className="menu-icon-close">
                <span></span>
                <span></span>
              </div>
            ) : (
              /* Triple Line Hamburger */
              <div className="menu-icon-open">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>

          {/* Logo */}
          <a href="/" className="logo-link">
            <img
              ref={logoRef}
              className="logo-header"
              src={logoHeader}
              alt="empathy"
            />
          </a>

          {/* Desktop nav links */}
          <nav className="menu">
            <a href="/yoyos">yoyos</a>
            <a href="/team">team</a>
            <a href="/blog">blog</a>
            <a href="/contact">contact us</a>
          </nav>
        </div>

        {/* RIGHT — Icons */}
        <div className="nav-icons">
          <SearchBar />
          <a href="/login" className="desktop-only">
            <IoPersonOutline size={25} />
          </a>
          <a href="/cart">
            <IoBagOutline size={25} />
          </a>
        </div>
      </div>

      {/* MOBILE BACKDROP — Only mounts to dim the screen when open */}
      {menuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU OVERLAY — Stays in DOM, slides via CSS classes */}
      <div
        className={`mobile-nav ${menuOpen ? "open" : ""} ${wasMounted ? "allow-animation" : ""}`}
      >
        <div className="mobile-nav-links">
          <a href="/yoyos" onClick={() => setMenuOpen(false)}>
            yoyos
          </a>
          <a href="/team" onClick={() => setMenuOpen(false)}>
            team
          </a>
          <a href="/blog" onClick={() => setMenuOpen(false)}>
            blog
          </a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>
            contact us
          </a>
        </div>

        <div className="mobile-nav-bottom">
          <a
            href="/login"
            className="mobile-nav-login"
            onClick={() => setMenuOpen(false)}
          >
            <IoPersonOutline size={20} />
            Log in
          </a>
          <div className="mobile-nav-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <IoLogoInstagram size={24} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <IoLogoYoutube size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
