import React, { useState } from "react";
import AsyncSelect from "../components/AsyncSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import RupiahFormat from "../utilities/RupiahFormat";

function Pos() {
  const [cart, SetCart] = useState([]);
  const [no, setNo] = useState(1);
  const dataCart = (childData) => {
    // console.log(childData);
    if (childData === null) {
    } else {
      // Cek apakah ID sudah ada dalam array
      const isExist = cart.some((item) => item.barang_cabang_id === childData);
      // Jika ID belum ada, tambahkan item baru
      if (!isExist) {
        // Fungsi async untuk mengambil data dari API
        const fetchData = async () => {
          try {
            let params = {
              barang_cabang_id: childData,
            };
            const response = await axios.post(
              "http://127.0.0.1:8000/api/detail-api-barcode-data-barang-cabang",
              params,
              {
                headers: {
                  // Authorization: `Bearer ${token}`, // Sisipkan token di header
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            ); // Gantilah URL dengan API Anda

            // setData(response.data); // Menyimpan data yang diterima
            // console.log(response.data.barang_master);
            const draftCart = response.data.barang_master;
            const draftDataCart = {
              no_urut: no,
              barang_cabang_id: childData,
              barang_nama: draftCart.barang_nama,
              barang_barcode: draftCart.barang_barcode,
              barang_harga_jual: draftCart.barang_harga_jual,
              pusat_id: draftCart.pusat_id,
              transaksi_qty: 1,
              transaksi_subtotal: draftCart.barang_harga_jual,
            };
            SetCart([...cart, draftDataCart]);
            setNo(no + 1);
          } catch (err) {
            toast.error("Terjadi kesalahan saat mengambil data.", {
              autoClose: 5000, // Durasi toast muncul dalam milidetik
            });
            // setError("Terjadi kesalahan saat mengambil data"); // Menangani error
          } finally {
            // setIsLoading(false); // Menandakan bahwa proses pengambilan data sudah selesai
          }
        };
        fetchData();

        // insert table cart
      } else {
        toast.error("Data sudah ada.", {
          autoClose: 5000, // Durasi toast muncul dalam milidetik
        });
        // console.log("ID sudah ada, item tidak ditambahkan");
      }
    }
  };

  const handleInputChange = (index, event) => {
    const values = [...cart];
    if (event.target.name === "transaksi_qty") {
      let subTotal = values[index]["barang_harga_jual"] * event.target.value;
      values[index]["transaksi_subtotal"] = subTotal;
    }
    values[index][event.target.name] = event.target.value;
    SetCart(values);
  };
  const sortedCart = cart.sort((a, b) => b.no_urut - a.no_urut);

  const handleRemoveField = (index) => {
    const values = [...cart];
    values.splice(index, 1);
    SetCart(values);
  };
  // console.log(cart);
  //
  const transaksiSubtotal = cart.reduce((total, item) => {
    // Jumlahkan harga jual setiap item ke dalam total
    return total + parseInt(item.transaksi_subtotal);
  }, 0);

  const rowTable = (item, index, resNo) => {
    return (
      <tr className="text-center" key={index}>
        <td>{resNo}</td>
        <td>{item.barang_barcode}</td>
        <td>{item.barang_nama}</td>
        <td>
          <input
            value={item.transaksi_qty}
            type="number"
            name="transaksi_qty"
            onChange={(event) => handleInputChange(index, event)}
            className="input-qty"
            required
          ></input>
        </td>
        <td className="text-right px-2">
          {RupiahFormat(item.barang_harga_jual)}
        </td>
        <td className="text-right px-2">
          {RupiahFormat(item.transaksi_subtotal)}
        </td>
        <td>
          <i
            onClick={() => handleRemoveField(index)}
            className="cursor-pointer fa fa-trash text-red-500 text-ml md:text-xl"
          ></i>
        </td>
      </tr>
    );
  };
  let number = 1;
  return (
    <div className="px-5 py-3 h-[86%] font-poppins">
      <div className="grid grid-rows-[auto,auto,330px] md:grid-rows-[auto,auto,400px] lg:grid-rows-[auto,auto,450px] h-full">
        <div className="bg-white md:grid md:grid-cols-2 gap-5 md:my-4">
          <div className="my-4 md:my-0">
            <div className="mb-1">
              <span className="text-colorPrimary font-semibold text-sm md:text-xl">
                <i className="fa fa-plus"></i> Tambah Item
              </span>
            </div>
            <ToastContainer />
            <AsyncSelect sendDataToParent={dataCart} />
          </div>
          <div>
            <div className="my-1">
              <span className="text-colorPrimary font-semibold text-sm md:text-xl">
                <i className="fa fa-calculator"></i> Total
              </span>
            </div>
            <div className="bg-gray-100 p-2 rounded text-right">
              <div className="text-lg md:text-2xl text-colorPrimary font-bold">
                {RupiahFormat(transaksiSubtotal)}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <span className="text-colorPrimary font-semibold text-sm md:text-xl">
            <i className="fa fa-shopping-cart"></i> Keranjang
          </span>
        </div>
        <form className="grid grid-rows-[1fr,auto] h-full">
          <div className="overflow-auto mt-2">
            <table className="table-auto border-collapse w-[110%] md:w-full text-xs md:text-xl">
              <thead>
                <tr>
                  <th className="w-[5%]">No</th>
                  <th className="w-[20%]">Barcode</th>
                  <th className="w-[20%]">Nama</th>
                  <th className="w-[25%] md:w-[15%]">Qty</th>
                  <th className="w-[17%]">Harga</th>
                  <th className="w-[17%]">SubTotal</th>
                  <th className="w-[6%]">Hapus</th>
                </tr>
              </thead>
              <tbody>
                {sortedCart &&
                  sortedCart.map((item, index) => {
                    const resNo = number++;
                    return rowTable(item, index, resNo);
                  })}
              </tbody>
            </table>
          </div>
          <button
            type="submit"
            className="bg-colorPrimary text-white py-2 mt-2 text-sm md:text-lg"
          >
            Bayar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pos;
