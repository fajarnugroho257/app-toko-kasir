import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import iconPos from "../assets/img/pos.png";
import iconLogout from "../assets/img/logout.png";
import Logout from "../utilities/Logount";
import api from "../utilities/axiosInterceptor";
import Pos from "./Pos";

function Pembayaran() {
  const cabang_nama = localStorage.getItem("cabang_nama");
  const name = localStorage.getItem("name");
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

  const handleLogout = async () => {
    // TOKEN
    const token = localStorage.getItem("token");
    //
    const response = await api.get("/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 200) {
      // Hapus token dari local storage (atau session storage)
      localStorage.removeItem("token");

      // Arahkan ke halaman login
      navigate("/login");
    }
  };

  return (
    <div className="px-5 py-3 h-[86%]">
      <div className="flex items-center">
        <div className="w-full h-fit">
          <h3 className="text-center mt-11 font-poppins text-xl md:text-3xl font-semibold text-gray-800 w-full md:w-1/2 mx-auto mb-10 md:mb-20">
            Selamat Datang {name} <br /> {cabang_nama} <br />
          </h3>
          <div className="flex items-center justify-center">
            <div className="md:w-3/5 grid grid-cols-2 gap-10 md:gap-1 md:grid-cols-2 items-center justify-center">
              <div onClick={() => handleSubmit("pos")}>
                <div className="mx-auto w-28 h-36 md:w-60 md:h-72 bg-colorPrimary rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-colorPrimaryHover">
                  <img src={iconPos} className="w-4/6" alt="iconPos" />
                </div>
                <h3 className="text-center mt-3 text-gray-800 font-poppins font-semibold text-sm md:text-2xl">
                  POS
                </h3>
              </div>
              <div onClick={() => handleLogout()}>
                <div className="mx-auto w-28 h-36 md:w-60 md:h-72 bg-colorPrimary rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:bg-colorPrimaryHover">
                  <img src={iconLogout} className="w-4/6" alt="iconLogout" />
                </div>
                <h3 className="text-center mt-3 text-gray-800 font-poppins font-semibold text-sm md:text-2xl">
                  LOGOUT
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
