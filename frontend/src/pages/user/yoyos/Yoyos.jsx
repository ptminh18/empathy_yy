import Header from "../../../Layouts/Header/Header.jsx";
import Footer from "../../../Layouts/Footer/Footer.jsx";
import ProductList from "../../../components/ProductList/ProductList.jsx";
import "./Yoyos.css";

function YoyosPage() {
  return (
    <div>
      <Header />
      <div>
        <ProductList />
      </div>
      <Footer />
    </div>
  );
}
export default YoyosPage;
