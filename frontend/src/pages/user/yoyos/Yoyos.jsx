import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import ProductList from "../../../components/ProductList/ProductList.jsx";
import Pagination from "../../../components/Pagination/Pagination.jsx";
import { useState, useEffect } from "react";

import "./Yoyos.css";

function YoyosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [yoyosData, setYoyosData] = useState([]);
  const itemsPerPage = 12; // Số lượng yoyo hiển thị mỗi trang
  const totalPages = Math.ceil(yoyosData.length / itemsPerPage);

  // Cắt dữ liệu để chỉ lấy phần cần hiển thị cho trang hiện tại
  const currentYoyos = yoyosData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handlePageChange = (pageNumber) => {
    console.log("Số trang vừa bấm:", pageNumber);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/products")
      .then((res) => res.json())
      .then((data) => setYoyosData(data));
  }, []);
  return (
    <>
      <Header />
      <div className="page-container">
        {/* Truyền dữ liệu đã được phân trang vào ProductList */}
        <ProductList products={currentYoyos} />

        {/* Render bộ nút bấm chuyển trang ở đây */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />

      {/* // <div>
    //   <Header />
    //   <div>
    //     <ProductList />
    //   </div>
    //   <Footer />
    // </div> */}
    </>
  );
}
export default YoyosPage;
