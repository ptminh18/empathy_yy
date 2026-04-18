import empathyPronunciation from "../../../assets/images/empathy-pronunciation.png";
import empathyNoirShiny from "../../../assets/images/yoyos/empathy-noir-shiny.png";
import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import "./Home.css";

function Homepage() {
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
        <iframe
          width="800"
          height="510"
          src="https://www.youtube.com/embed/Wl65Wmdya_o?si=XaHtrJZD9K8CiatP&amp;start=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
      <Footer />
    </>
  );
}
export default Homepage;
