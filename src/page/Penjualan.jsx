import React, { useEffect, useState } from "react";
import api from "../utilities/axiosInterceptor";
import { getToken } from "../utilities/Auth";
import RupiahFormat from "../utilities/RupiahFormat";
import dayjs from "dayjs";
import "dayjs/locale/id";
import ModalDetailNota from "../components/ModalDetailNota";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  swalError,
  swalLoading,
  swalSuccess,
  swalSuccessAutoClose,
} from "../utilities/Swal";
import ModalRetur from "../components/ModalRetur";
import ModalDelete from "../components/ModalDelete";

const Penjualan = () => {
  // state
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [tab, setTab] = useState("penjualan");
  const [tanggal, setTanggal] = useState({
    start: "",
    end: "",
  });
  // get data
  const getDataTransaksi = async (start, end) => {
    swalLoading("Silahkan tunggu...", "Sedang mendapatkan data");
    try {
      const params = { start: start, end: end };
      const token = getToken();
      const response = await api.post(
        `list-transaksi-data-barang-cabang`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDataTransaksi(response.data.data || []);
      swalSuccessAutoClose("Berhasil", "Data berhasil didapatkan", 500);
      const dataTanggal = { start, end };
      localStorage.setItem("filterTanggal", JSON.stringify(dataTanggal));
    } catch (error) {
      swalError(
        "Opps..!",
        error?.response?.data?.message || error.message || "Terjadi kesalahan",
      );
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("filterTanggal");
    let parsed = {};
    if (saved) {
      parsed = JSON.parse(saved);
      setTanggal(parsed);
    }
    getDataTransaksi(parsed.start, parsed.end);
  }, []);

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("id").format("DD MMM YYYY [jam] HH:mm:ss");
  };

  // modal nota
  const [stModal, setStModal] = useState(false);
  const [stModalRetur, setStModalRetur] = useState(false);
  const [stModalDelete, setStModalDelete] = useState(false);
  const [cartId, setCartId] = useState(null);
  const handleNota = (cart_id) => {
    setStModal(!stModal);
    setCartId(cart_id);
  };

  const handleRetur = (cart_id) => {
    setStModalRetur(!stModalRetur);
    setCartId(cart_id);
  };

  const handleDelete = (cart_id) => {
    setStModalDelete(!stModalDelete);
    setCartId(cart_id);
  };

  const handleTab = (tabStatus) => {
    setTab(tabStatus);
  };

  const handleCari = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const start = formData.get("start");
    const end = formData.get("end");
    const dataTanggal = { start, end };
    // localStorage.setItem("filterTanggal", JSON.stringify(dataTanggal));
    // simpan ke state
    setTanggal(dataTanggal);
    getDataTransaksi(start, end);
    // fetch data
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDefaultTanggal = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: formatDateLocal(firstDay),
      end: formatDateLocal(today),
    };
  };

  const handleReset = () => {
    const resTgl = getDefaultTanggal();
    setTanggal({ start: resTgl.start, end: resTgl.end });
    getDataTransaksi(resTgl.start, resTgl.end);
  };

  let ttlBelanja = 0;
  let ttlCash = 0;
  let ttlKembalian = 0;

  return (
    <div className="">
      <div className="h-full overflow-auto px-4 pt-12 md:py-14 md:px-10">
        <div className="flex justify-end">
          <Link
            to={"/dashboard"}
            className="font-poppins rounded-sm bg-colorPrimary text-white px-2 py-1 text-xs md:text-sm"
          >
            <i className="fa fa-arrow-left"></i> Home
          </Link>
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
        <form onSubmit={handleCari}>
          <div className="my-3 flex gap-2 justify-end">
            <input
              type="date"
              name="start"
              value={tanggal.start}
              onChange={(e) =>
                setTanggal({ ...tanggal, start: e.target.value })
              }
              className="border px-1 py-1 text-sm md:text-base text-center"
            />
            <input
              type="date"
              name="end"
              value={tanggal.end}
              onChange={(e) => setTanggal({ ...tanggal, end: e.target.value })}
              className="border px-1 py-1 text-sm md:text-base text-center"
            />
            <Link
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-500 text-white px-3 rounded-sm text-sm md:text-base flex items-center"
            >
              <i className="fa fa-times"></i>
            </Link>
            <button
              type="submit"
              className="bg-colorPrimary hover:bg-colorPrimaryHover text-white px-3 rounded-sm text-sm md:text-base"
            >
              <i className="fa fa-search"></i> Cari
            </button>
          </div>
        </form>
        <table className="min-w-full border-collapse border border-gray-200 shadow-md rounded-lg text-xs md:text-sm font-poppins">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold text-center">
              <th className="px-1 py-3 border border-gray-200">No</th>
              <th className="px-1 py-3 border border-gray-200">ID Keranjang</th>
              <th className="px-1 py-3 border border-gray-200">Date Time</th>
              <th className="px-1 py-3 border border-gray-200">Pelanggan</th>
              <th className="px-1 py-3 border border-gray-200 bg-green-200">
                Ttl Belanja
              </th>
              <th className="px-1 py-3 border border-gray-200">Cash</th>
              <th className="px-1 py-3 border border-gray-200">Kembalian</th>
              <th className="px-1 py-3 border border-gray-200">Kasir</th>
              <th className="px-1 py-3 border border-gray-200">Nota</th>
            </tr>
          </thead>
          <tbody>
            {dataTransaksi && dataTransaksi.length > 0 ? (
              dataTransaksi.map((val, index) => {
                ttlBelanja += parseInt(val.trans_total);
                ttlCash += parseInt(val.trans_bayar);
                ttlKembalian += parseInt(val.trans_kembalian);
                return (
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
                    <td className="px-6 py-3 border border-gray-200 text-right bg-green-200">
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
                    <td className="px-6 py-3 border border-gray-200 text-center ">
                      <button
                        onClick={() => handleNota(val.cart_id)}
                        className="px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded"
                      >
                        <i className="fa fa-print"></i>
                      </button>
                      <Link
                        onClick={() => handleRetur(val.cart_id)}
                        title="Retur"
                        className="px-2 py-1 text-white my-1 md:my-0 mx-0 md:mx-2 bg-green-500 hover:bg-green-600 rounded"
                      >
                        <i className="fa fa-undo"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(val.cart_id)}
                        className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="border border-gray-200 hover:bg-gray-50 text-center"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            )}
            <tr className="bg-gray-100">
              <td
                colSpan={4}
                className="px-6 py-3 border border-gray-200 text-right"
              >
                Jumlah
              </td>
              <td className="px-6 py-3 border border-gray-200 text-right bg-green-200">
                {RupiahFormat(ttlBelanja)}
              </td>
              <td className="px-6 py-3 border border-gray-200 text-right">
                {RupiahFormat(ttlCash)}
              </td>
              <td className="px-6 py-3 border border-gray-200 text-right">
                {RupiahFormat(ttlKembalian)}
              </td>
              <td className="px-6 py-3 border border-gray-200 text-right"></td>
              <td className="px-6 py-3 border border-gray-200 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <ToastContainer />
      {stModal && (
        <ModalDetailNota isOpen={true} onClose={handleNota} cartId={cartId} />
      )}
      {stModalRetur && (
        <ModalRetur
          isOpen={true}
          cartId={cartId}
          stateTable={getDataTransaksi}
          setStModalRetur={setStModalRetur}
        />
      )}
      {stModalDelete && (
        <ModalDelete
          isOpen={stModalDelete}
          cartId={cartId}
          stateTable={getDataTransaksi}
          setStModalDelete={setStModalDelete}
        />
      )}
    </div>
  );
};

export default Penjualan;
