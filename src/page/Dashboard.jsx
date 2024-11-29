import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Shop from "../assets/img/shop.png";
import Database from "../assets/img/database.png";
import Shipped from "../assets/img/shipped.png";
import Report from "../assets/img/report.png";

function Pembayaran() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Tutup dropdown jika klik di luar elemen dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Tutup dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSubmit = (event) => {
    navigate(`/${event}`);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleModalTambah = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="px-5 py-3 h-[86%]">
      <div className="flex items-center">
        <div className="w-full h-fit">
          <h3 className="text-center mt-11 font-poppins text-xl md:text-4xl font-semibold text-gray-800 w-full md:w-2/5 mx-auto mb-10 md:mb-20">
            Aplikasi Kasir
          </h3>
          <div className="flex items-center justify-center">
            <div className="md:w-3/5 grid grid-cols-2 gap-20 md:gap-5 md:grid-cols-4 items-center justify-center">
              <div onClick={() => handleSubmit("pembelian")}>
                <div className="mx-auto w-20 h-28 md:w-36 md:h-40 bg-colorPrimary rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-colorPrimaryHover">
                  <img src={Shop} className="w-4/6" alt="Shop" />
                </div>
                <h3 className="text-center mt-3 text-gray-800 font-poppins font-semibold text-sm">
                  Pembelian
                </h3>
              </div>
              <div onClick={() => handleSubmit("pengiriman")}>
                <div className="mx-auto w-20 h-28 md:w-36 md:h-40 bg-colorPrimary rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-colorPrimaryHover">
                  <img src={Shipped} className="w-4/6" alt="Shipped" />
                </div>
                <h3 className="text-center mt-3 text-gray-800 font-poppins font-semibold text-sm">
                  Pengiriman
                </h3>
              </div>
              <div onClick={() => handleSubmit("laporan")}>
                <div className="mx-auto w-20 h-28 md:w-36 md:h-40 bg-colorPrimary rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-colorPrimaryHover">
                  <img src={Report} className="w-4/6" alt="Report" />
                </div>
                <h3 className="text-center mt-3 text-gray-800 font-poppins font-semibold text-sm">
                  Laporan
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pembayaran;
