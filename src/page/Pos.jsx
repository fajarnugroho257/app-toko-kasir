import React, { useEffect, useState } from "react";
import AsyncSelect from "../components/AsyncSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import RupiahFormat from "../utilities/RupiahFormat";
import api from "../utilities/axiosInterceptor";
import ModalPembayaran from "../components/ModalPembeyaran";

function Pos() {
  // TOKEN
  const token = localStorage.getItem("token");
  const cabang_id = localStorage.getItem("cabang_id");
  //
  const [cart, SetCart] = useState([]);
  const [cart_id, setCartId] = useState(null);
  const [openBayar, setOpenBayar] = useState(false);
  // jika ada yang draft
  useEffect(() => {
    const fectData = async () => {
      //fetching
      const response = await api.get(`get-cart-draft`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sisipkan token di header
        },
      });
      if (response.status === 200) {
        //get response data
        const cart_data = await response.data.data;
        if (Object.keys(cart_data).length !== 0) {
          SetCart(cart_data);
        }
      } else {
        console.log(response.status);
      }
    };
    fectData();
  }, []);

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
              id_cabang: cabang_id,
            };
            // console.log(params);
            const response = await api.post(
              "/detail-api-barcode-data-barang-cabang",
              params,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Sisipkan token di header
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
              barang_harga_beli: draftCart.barang_harga_beli,
              awal_barang_harga_jual: draftCart.barang_harga_jual,
              barang_harga_jual: draftCart.barang_harga_jual,
              barang_grosir_pembelian: draftCart.barang_grosir_pembelian,
              barang_grosir_harga_jual: draftCart.barang_grosir_harga_jual,
              barang_grosir_diskon: draftCart.barang_grosir_harga_jual,
              barang_st_diskon: false,
              pusat_id: draftCart.pusat_id,
              cart_qty: 1,
              cart_subtotal: draftCart.barang_harga_jual,
            };
            // console.log(draftDataCart);
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
        const audio = new Audio("sounds/error-sound.mp3");
        audio.volume = 1;
        audio.play();
        toast.error("Data sudah ada.", {
          autoClose: 5000, // Durasi toast muncul dalam milidetik
        });
        // console.log("ID sudah ada, item tidak ditambahkan");
      }
    }
  };
  // console.log(cart);
  const handleInputChange = (index, event) => {
    const values = [...cart];
    // console.log(values);
    if (event.target.name === "cart_qty") {
      let nilai_qty = event.target.value;
      let result_harga =
        parseInt(nilai_qty) >=
        parseInt(values[index]["barang_grosir_pembelian"])
          ? values[index]["barang_grosir_harga_jual"]
          : values[index]["awal_barang_harga_jual"];
      values[index]["barang_harga_jual"] = result_harga;
      let subTotal = result_harga * event.target.value;
      values[index]["cart_subtotal"] = subTotal;
      // status diskon
      let stDiskon = false;
      if (
        parseInt(nilai_qty) >=
        parseInt(values[index]["barang_grosir_pembelian"])
      ) {
        stDiskon = true;
      } else {
        stDiskon = false;
      }
      values[index]["barang_st_diskon"] = stDiskon;
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
    return total + parseInt(item.cart_subtotal);
  }, 0);

  const rowTable = (item, index, resNo) => {
    // console.log(item);
    return (
      <tr className="text-center text-xs md:text-lg" key={index}>
        <td>{resNo}</td>
        <td>{item.barang_barcode}</td>
        <td>{item.barang_nama}</td>
        <td>
          <input
            value={item.cart_qty}
            type="number"
            name="cart_qty"
            onChange={(event) => handleInputChange(index, event)}
            className="input-qty"
            required
          ></input>
        </td>
        <td className="text-right px-2">
          <p
            className={item.barang_st_diskon ? "line-through text-red-500" : ""}
          >
            {RupiahFormat(item.awal_barang_harga_jual)}
          </p>
          <div
            className={`flex justify-between items-center ${
              item.barang_st_diskon ? "" : "hidden"
            }`}
          >
            <span className="text-xs">Grosir : </span>
            <p>{RupiahFormat(item.barang_harga_jual)}</p>
          </div>
        </td>
        <td className="text-right px-2">{RupiahFormat(item.cart_subtotal)}</td>
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
  // handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menyimpan data ini?"
    );
    if (isConfirmed) {
      // console.log(sortedCart);
      // console.log(cabang_id);
      // toas
      const toastId = toast.loading("Sending data...");
      // console.log(sortedCart);
      try {
        const params = {
          keranjang: sortedCart,
        };
        const response = await api.post("/api-store-cart-data", params, {
          headers: {
            Authorization: `Bearer ${token}`, // Sisipkan token di header
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (response.status === 200) {
          if (response.data.success === false) {
            toast.update(toastId, {
              render: response.data.message,
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          } else {
            // open modal bayar
            setOpenBayar(true);
            setCartId(response.data.cart_id);
            // console.log(response.data);
            toast.update(toastId, {
              render: "Sukses menambah ke keranjang",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
          }
        }
        // console.log(response.data);
      } catch (error) {
        const errors = error.response?.data?.errors;
        let errorMessages;
        if (errors) {
          // Jika errors ada, buat string gabungan dari pesan error
          errorMessages = Object.keys(errors)
            .map((field) => `${field}: ${errors[field].join(", ")}`)
            .join("\n");

          console.log(errorMessages);
        } else {
          // Jika errors tidak ada
          errorMessages = "No errors found in the response.";
          console.log("No errors found in the response.");
        }
        toast.update(toastId, {
          render: `Error sending data ! \n${errorMessages}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error(`Error sending data ! \n${errorMessages}`);
      }
    }
  };
  const handleCloseBayar = () => {
    setOpenBayar(false);
  };
  // delete all cart id success
  const deleteCart = () => {
    SetCart([]);
  };
  // console.log(cart_id);
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
        <form
          onSubmit={handleSubmit}
          className="grid grid-rows-[1fr,auto] h-full"
        >
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
            className="bg-yellow-500 text-white py-2 mt-2 text-sm md:text-lg"
          >
            Masukkan Keranjang
          </button>
        </form>
      </div>
      {openBayar && (
        <ModalPembayaran
          isOpen={openBayar}
          onClose={handleCloseBayar}
          ttlBayar={transaksiSubtotal}
          cart_id={cart_id}
          deleteCart={deleteCart}
          cart_data={cart}
        />
      )}
    </div>
  );
}

export default Pos;
