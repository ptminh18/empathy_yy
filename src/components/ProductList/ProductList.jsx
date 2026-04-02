import "./ProductList.css";
import AcronymKorean from "../../assets/images/acronym-korean.jpeg";
import Acronym from "../../assets/images/acronym.webp";
import OneLovePack from "../../assets/images/oneLove-pack.jpeg";
import Empty from "../../assets/images/empty.jpeg";

// Sample Data based on your image
const products = [
  {
    id: 1,
    name: "acronym 이화제",
    price: "1.747.000 VND",
    image: AcronymKorean, // Replace with your actual image paths
    isSoldOut: false,
  },
  {
    id: 2,
    name: "acronym",
    price: "1.747.000 VND",
    image: Acronym,
    isSoldOut: true,
  },
  {
    id: 3,
    name: "oneLove pack",
    price: "2.173.000 VND",
    image: OneLovePack,
    isSoldOut: false,
  },
  {
    id: 4,
    name: "empty",
    price: "3.107.000 VND",
    image: Empty,
    isSoldOut: false,
  },
];

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="image-container">
        <img src={product.image} alt={product.name} />
        {product.isSoldOut && <span className="badge">Sold out</span>}
      </div>
      <div className="product-information">
        <h5 className="product-name">{product.name}</h5>
        <p className="price">{product.price}</p>
      </div>
    </div>
  );
};
// Main List Component
const ProductList = () => {
  const ProductCount = products.length;
  return (
    <>
      <div className="filter-and-product-count">
        <a>filter</a>
        <h5>{ProductCount} products</h5>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductList;
