import React, { useEffect, useState } from "react";
import api from "../utilities/axiosInterceptor";
import { getToken } from "../utilities/Auth";
import RupiahFormat from "../utilities/RupiahFormat";
import dayjs from "dayjs";
import "dayjs/locale/id";
import ModalDetailNota from "../components/ModalDetailNota";
import { ToastContainer } from "react-toastify";

const Penjualan = () => {
  // state
  const [dataTransaksi, setDataTransaksi] = useState([]);
  // get data
  const getDataTransaksi = async () => {
    try {
      const token = getToken();
      const response = await api.get(`list-transaksi-data-barang-cabang`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sisipkan token di header
        },
      });
      if (response.data.success) {
        setDataTransaksi(response.data.data);
      }
      //   console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataTransaksi();
  }, []);

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("id").format("DD MMM YYYY [jam] HH:mm:ss");
  };

  // modal nota
  const [stModal, setStModal] = useState(false);
  const [cartId, setCartId] = useState(null);
  const handleNota = (cart_id) => {
    setStModal(!stModal);
    setCartId(cart_id);
  };

  return (
    <div className="px-5 py-3 h-[86%]">
      <div className="h-full overflow-auto p-10">
        <table className="min-w-full border-collapse border border-gray-200 shadow-md rounded-lg text-xs md:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold text-center">
              <th className="px-1 py-3 border border-gray-200">No</th>
              <th className="px-1 py-3 border border-gray-200">ID Keranjang</th>
              <th className="px-1 py-3 border border-gray-200">Date Time</th>
              <th className="px-1 py-3 border border-gray-200">Pelanggan</th>
              <th className="px-1 py-3 border border-gray-200">Total</th>
              <th className="px-1 py-3 border border-gray-200">Cash</th>
              <th className="px-1 py-3 border border-gray-200">Kembalian</th>
              <th className="px-1 py-3 border border-gray-200">Kasir</th>
              <th className="px-1 py-3 border border-gray-200">Nota</th>
            </tr>
          </thead>
          <tbody>
            {dataTransaksi.map((val, index) => (
              <tr
                key={index}
                className="border border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 border border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-3 border border-gray-200">
                  {val.cart_id}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-center">
                  {formatDate(val.trans_date)}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-center">
                  {val.trans_pelanggan}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-right">
                  {RupiahFormat(val.trans_total)}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-right">
                  {RupiahFormat(val.trans_bayar)}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-right">
                  {RupiahFormat(val.trans_kembalian)}
                </td>
                <td className="px-6 py-3 border border-gray-200">
                  {val.users.name}
                </td>
                <td className="px-6 py-3 border border-gray-200 text-center">
                  <button
                    onClick={() => handleNota(val.cart_id)}
                    className="px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    <i className="fa fa-print"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
      {stModal && (
        <ModalDetailNota isOpen={true} onClose={handleNota} cartId={cartId} />
      )}
    </div>
  );
};

export default Penjualan;
