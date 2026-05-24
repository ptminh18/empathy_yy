import empathyPronunciation from "../../../assets/images/empathy-pronunciation.png";
import empathyNoirShiny from "../../../assets/images/yoyos/empathy-noir-shiny.png";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import "./Home.css";
import { useState, useEffect } from "react";

function Homepage() {
  const [videoWidth, setVideoWidth] = useState("50%");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setVideoWidth("92%");
      else if (window.innerWidth <= 1024) setVideoWidth("70%");
      else setVideoWidth("50%");
    };
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Header />
      <div className="main">
        <img
          className="main-img"
          src={empathyPronunciation}
          alt="empathy pronunciation"
        />
        <img className="main-img" src={empathyNoirShiny} alt="empathy noir" />
        <h5 className="yoyo-name">bête noire</h5>
        <a className="yoyo-link" href="https://www.empathyoyo.com/bete-noir">
          out now
        </a>
        <div
          style={{
            position: "relative",
            width: videoWidth,
            paddingBottom: `calc(${videoWidth} * 0.5625)`,
            height: 0,
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/Wl65Wmdya_o?si=XaHtrJZD9K8CiatP&amp;start=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Homepage;
