import Header from "../../../layouts/Header/Header.jsx";
import Footer from "../../../layouts/Footer/Footer.jsx";
import ProductList from "../../../components/ProductList/ProductList.jsx";
import Pagination from "../../../components/Pagination/Pagination.jsx";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Yoyos.css";

function YoyosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [yoyosData, setYoyosData] = useState([]);

  // 1. Lấy trang hiện tại trực tiếp từ URL (?page=x). Mặc định là 1.
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  // 2. Fetch dữ liệu từ API
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setYoyosData(data);
        }
      })
      .catch((err) => console.error("Lỗi fetch data:", err));
  }, []);

  // 3. Behavior: Tự động cuộn lên đầu trang mỗi khi currentPage thay đổi
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt mà
    });
  }, [currentPage]); // Theo dõi sự thay đổi của currentPage

  // 4. Tính toán logic phân trang
  const totalPages = Math.ceil(yoyosData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentYoyos = yoyosData.slice(indexOfFirstItem, indexOfLastItem);

  // 5. Hàm xử lý chuyển trang thông qua URL
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  return (
    <>
      <Header />
      <div className="page-container">
        {yoyosData.length > 0 ? (
          <>
            {/* Hiển thị danh sách sản phẩm đã cắt */}
            <ProductList products={currentYoyos} />

            {/* Bộ điều hướng phân trang */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="loading-state">Đang nạp danh sách sản phẩm...</div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default YoyosPage;
