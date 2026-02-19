import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../utilities/axiosInterceptor";
import { getToken } from "../utilities/Auth";
import RupiahFormat from "../utilities/RupiahFormat";
import dayjs from "dayjs";
import {
  swalError,
  swalLoading,
  swalSuccess,
  swalSuccessAutoClose,
} from "../utilities/Swal";

const DraftPenjualan = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("draft");
  const [dataTransaksi, setDataTransaksi] = useState([]);

  const handleTab = (tabStatus) => {
    setTab(tabStatus);
  };

  // get data
  const getDataTransaksi = async () => {
    swalLoading("Silahkan tunggu...", "Sedang mendapatkan data");
    try {
      const token = getToken();
      const response = await api.get(
        `list-transaksi-data-barang-cabang-booking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDataTransaksi(response.data.data || []);
      swalSuccessAutoClose("Berhasil", "Data berhasil didapatkan", 1000);
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

  const hanldeTransaksi = async (cart_id) => {
    // get data
    const token = getToken();
    swalLoading("Silahkan tunggu...", "Sedang memproses data");
    // const toastDraft = toast.loading("Silahkan Tunggu...");
    try {
      let params = { cart_id: cart_id };
      const response = await api.post("change-status-by-cart-id", params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        navigate("/pos");
        swalSuccess("Berhasil", "Silahkan untuk melakukan transaksi kembali");
      } else {
        swalError("error", response.data.message);
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="h-[86%]">
        <div className="h-full overflow-auto p-10">
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
                <th className="px-1 py-3 border border-gray-200">
                  Date Create
                </th>
                <th className="px-1 py-3 border border-gray-200">Cart ID</th>
                <th className="px-1 py-3 border border-gray-200">Pelanggan</th>
                <th className="px-1 py-3 border border-gray-200">Uang Muka</th>
                <th className="px-1 py-3 border border-gray-200">Tagihan</th>
                <th className="px-1 py-3 border border-gray-200">Note</th>
                <th className="px-1 py-3 border border-gray-200">Aksi</th>
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
                  <td className="px-6 py-3 border border-gray-200 text-sm text-center">
                    <button
                      onClick={() => hanldeTransaksi(val.cart_id)}
                      className="bg-colorPrimary rounded-sm text-white py-2 px-1 w-20"
                    >
                      Transaksi <i className="fa fa-play"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DraftPenjualan;
