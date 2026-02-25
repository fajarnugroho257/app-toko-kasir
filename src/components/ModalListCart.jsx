import React, { useState, useEffect } from "react";
import { getToken } from "../utilities/Auth";
import api from "../utilities/axiosInterceptor";
import { QZTrayProvider, useQZTray } from "./QZTrayContext";
import PrintBluethoot from "../utilities/PrintBluethoot";
import RupiahFormat from "../utilities/RupiahFormat";
import PilihPrint from "../utilities/PilihPrint";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";
import {
  swalError,
  swalLoading,
  swalSuccess,
  swalSuccessAutoClose,
} from "../utilities/Swal";

function ModalListCart({ isOpen, onClose, cartId }) {
  //
  const [notaData, setNotaData] = useState([]);
  const [openModal, setOpenModal] = useState(isOpen);
  //
  const detailNota = async () => {
    try {
      swalLoading("Silahkan tunggu...", "Sedang mendapatkan data");
      const token = getToken();
      const response = await api.get(`list-cart-data?cart_id=${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sisipkan token di header
        },
      });
      if (response.data.success) {
        swalSuccessAutoClose("Berhasil", "Data berhasil didapatkan", 500);
        setNotaData(response.data.rs_cart);
      }
      // console.log(response.data.data);
    } catch (error) {
      swalError(
        "Opps..!",
        error?.response?.data?.message || error.message || "Terjadi kesalahan",
      );
    }
  };

  useEffect(() => {
    detailNota();
  }, []);
  let grandTotal = 0;

  const handleClose = () => {
    onClose();
    setOpenModal(!openModal);
  };

  if (!openModal) return null;
  return (
    <>
      {notaData.length >= 1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-poppins">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white w-[90%] md:w-[50%] h-[90%] p-6 rounded-lg shadow-lg relative z-10">
            <h2 className="text-base md:text-lg font-bold mb-4 text-black">
              Detail Keranjang
            </h2>
            <div className="h-[2px] w-full bg-colorPrimary mb-4"></div>
            <div className="w-full overflow-auto">
              <table className="min-w-full border-collapse border border-gray-200 shadow-md rounded-lg text-xs md:text-base">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold text-center">
                    <th className="w-5 px-1 py-3 border border-gray-200">No</th>
                    <th className="px-1 py-3 border border-gray-200">
                      Nama Barang
                    </th>
                    <th className="px-1 py-3 border border-gray-200">Harga</th>
                    <th className="px-1 py-3 border border-gray-200">Jumlah</th>
                    <th className="px-1 py-3 border border-gray-200">
                      SubTotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notaData.map((val, index) => {
                    grandTotal += parseInt(val.cart_subtotal);
                    return (
                      <tr
                        key={index}
                        className={` ${val.cart_diskon === "yes" ? "text-red-500" : ""} border border-gray-200 hover:bg-gray-50`}
                      >
                        <td className="px-6 py-3 border border-gray-200 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 border border-gray-200">
                          {val.cart_nama}{" "}
                          {val.cart_diskon === "yes" ? "(Grosir)" : ""}
                        </td>
                        <td className="px-6 py-3 border border-gray-200 text-center">
                          {RupiahFormat(val.cart_harga_jual)}
                        </td>
                        <td className="px-6 py-3 border border-gray-200 text-right">
                          {val.cart_qty}
                        </td>
                        <td className="px-6 py-3 border border-gray-200 text-right">
                          {RupiahFormat(val.cart_subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-3 border border-gray-200 text-right"
                    >
                      Grand Total
                    </td>
                    <td className="px-6 py-3 border border-gray-200 text-right">
                      {RupiahFormat(grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-5">
              <button
                className="px-2 md:px-4 py-1 md:py-2 bg-colorGray border-2 border-colorBlue font-poppins text-black rounded hover:bg-slate-200"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                // onClick={() => handlePrint()}
                type="submit"
                className="px-2 md:px-4 py-1 md:py-2 bg-colorPrimary font-poppins text-colorGray rounded hover:bg-blue-900"
              >
                <i className="fa fa-print"></i> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalListCart;
