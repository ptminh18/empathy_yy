import Header from "../../../Layouts/Header/Header.jsx";
import Footer from "../../../Layouts/Footer/Footer.jsx";
import { useState, useEffect } from "react";
import "./Team.css";

function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/players")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Dữ liệu nhận được từ Backend:", data);
        const finalData = Array.isArray(data) ? data : data.recordset || [];
        setPlayers(finalData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối API:", err);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>team member is loading</p>;

  return (
    <div>
      <Header />
      <div className="player-grid">
        <div>
          {players.map((item) => (
            <>
              <div className="player-container">
                <div className="player-image-container">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="player-information">
                  <div className="player-name">
                    <h2>{item.name}</h2>
                    <p>{item.translator_name}</p>
                  </div>
                  <div className="player-signature">
                    {item.signature_model && (
                      <a href={item.signature_link}>{item.signature_model}</a>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default TeamPage;
