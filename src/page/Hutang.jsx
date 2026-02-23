import React, { useEffect, useState } from "react";
import api from "../utilities/axiosInterceptor";
import { getToken } from "../utilities/Auth";
import RupiahFormat from "../utilities/RupiahFormat";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";
import ModalDetailHutang from "../components/ModalDetailHutang";
import {
  swalError,
  swalLoading,
  swalSuccessAutoClose,
} from "../utilities/Swal";
import ModalListCart from "../components/ModalListCart";

const Hutang = () => {
  // state
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [tab, setTab] = useState("hutang");
  const token = getToken();
  // get data
  const getDataTransaksi = async () => {
    swalLoading("Silahkan tunggu...", "Sedang mendapatkan data");
    try {
      const response = await api.get(
        `list-transaksi-data-barang-cabang-hutang`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDataTransaksi(response.data.data || []);
      swalSuccessAutoClose("Berhasil", "Data berhasil didapatkan", 500);
    } catch (error) {
      swalError(
        "Opps..!",
        error?.response?.data?.message || error.message || "Terjadi kesalahan",
      );
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
  const [stModalList, setStModalList] = useState(false);
  const [cartId, setCartId] = useState(null);
  const handleNota = (cart_id) => {
    setStModal(!stModal);
    setCartId(cart_id);
  };

  const handleTab = (tabStatus) => {
    setTab(tabStatus);
  };

  const handleListCart = (cart_id) => {
    setCartId(cart_id);
    setStModalList(!stModalList);
  };

  const loadData = () => {
    getDataTransaksi();
  };
  return (
    <div className="">
      <div className="h-full overflow-auto px-4 pt-12 md:py-14 md:px-10">
        <div className="flex justify-end">
          <div className="flex justify-end">
            <Link
              to={"/dashboard"}
              className="font-poppins rounded-sm bg-colorPrimary text-white px-2 py-1 text-xs md:text-sm"
            >
              <i className="fa fa-arrow-left"></i> Home
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center font-poppins">
          <Link
            to={"/penjualan"}
            className={`text-xs md:text-sm cursor-pointer w-full my-2 px-3 py-2 rounded-md ${tab == "penjualan" ? "bg-colorPrimary text-white" : "bg-gray-300 text-black"}`}
            onClick={() => handleTab("penjualan")}
          >
            Riwayat Penjualan
          </Link>
          <Link
            to={"/hutang"}
            className={`text-xs md:text-sm cursor-pointer w-full my-2 px-3 py-2 rounded-md ${tab == "hutang" ? "bg-colorPrimary text-white" : "bg-gray-300 text-black"}`}
            onClick={() => handleTab("hutang")}
          >
            Daftar Hutang
          </Link>
          <Link
            to={"/draft-penjualan"}
            className={`text-xs md:text-sm cursor-pointer w-full my-2 px-3 py-2 rounded-md ${tab == "draft" ? "bg-colorPrimary text-white" : "bg-gray-300 text-black"}`}
            onClick={() => handleTab("draft")}
          >
            Draft Penjualan
          </Link>
        </div>
        <table className="min-w-full border-collapse border border-gray-200 shadow-md rounded-lg text-xs md:text-sm font-poppins">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-center">
              <th className="px-1 py-3 border border-gray-200">No</th>
              <th className="px-1 py-3 border border-gray-200">Date Create</th>
              <th className="px-1 py-3 border border-gray-200">Cart ID</th>
              <th className="px-1 py-3 border border-gray-200">Pelanggan</th>
              <th className="px-1 py-3 border border-gray-200">Uang Muka</th>
              <th className="px-1 py-3 border border-gray-200">Tagihan</th>
              <th className="px-1 py-3 border border-gray-200">Note</th>
              <th className="px-1 py-3 border border-gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataTransaksi &&
              dataTransaksi.map((val, index) => (
                <tr
                  key={index}
                  className="border border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 border border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 border border-gray-200 text-center">
                    {formatDate(val.created_at)}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {val.cart_id}
                  </td>
                  <td className="px-6 py-3 border border-gray-200 text-center">
                    {val.cart_draft.draft_pelanggan}
                  </td>
                  <td className="px-6 py-3 border border-gray-200 text-right">
                    {RupiahFormat(val.cart_draft.draft_uang_muka)}
                  </td>
                  <td className="px-6 py-3 border border-gray-200 text-right">
                    {RupiahFormat(val.cart_draft.draft_uang_tagihan)}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {val.cart_draft.draft_note}
                  </td>
                  <td className="px-2 py-3 border border-gray-200 text-base md:text-xl text-center">
                    <Link
                      onClick={() => handleListCart(val.cart_id)}
                      title="Lihat Data Barang"
                      className="fa fa-eye text-colorPrimary md:mr-3"
                    ></Link>
                    <Link
                      onClick={() => handleNota(val.cart_id)}
                      title="Bayar hutang"
                      className="fa fa-money-bill-alt text-red-600"
                    ></Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {stModal && (
        <ModalDetailHutang
          isOpen={true}
          onClose={handleNota}
          cartId={cartId}
          loadData={loadData}
        />
      )}
      {stModalList && <ModalListCart isOpen={true} cartId={cartId} />}
    </div>
  );
};

export default Hutang;
