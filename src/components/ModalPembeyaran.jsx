import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utilities/axiosInterceptor";

function ModalPembayaran({ isOpen, onClose, ttlBayar, cart_id, deleteCart }) {
  // TOKEN
  const token = localStorage.getItem("token");
  //
  const [number, setNumber] = useState([]);
  const [tagihan, setTagihan] = useState(ttlBayar);
  const [kembalian, setKembalian] = useState(0);

  const result = number.join("");

  const handleNumber = (value) => {
    if (value === "c") {
      setNumber([]);
      setKembalian(0);
    } else {
      // console.log(number.length);
      if (value !== "x") {
        if (number.length < 1 && value === 0) {
        } else {
          var dataInput = [...number, value];
          setNumber(dataInput);
          setKembalian(dataInput.join("") - tagihan);
        }
      }
    }
  };

  const deleteItem = () => {
    var dataInput = number.filter((item, i) => i !== number.length - 1);
    setNumber(dataInput);
    setKembalian(dataInput.join("") - tagihan);
  };
  //

  // Fungsi untuk memformat angka menjadi format Rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // console.log(formatRupiah(result));
  const hitung = () => {
    console.log(result);
  };
  const [valInputBayar, setValInputBayar] = useState("");
  const handleInputBayar = (event) => {
    const val = event.target.value;
    setKembalian(parseInt(val) - parseInt(tagihan));
    setValInputBayar(val);
  };

  const [valInputPelanggan, setValInputPelanggan] = useState("");
  const handleInputPelanggan = (event) => {
    const val = event.target.value;
    setValInputPelanggan(val);
  };
  const closeModalBayar = () => {
    onClose();
  };
  const handleStoreBayar = async () => {
    // alert(cart_id);
    if (valInputBayar <= 0) {
      alert("Nilai pembayaran wajib diisi");
      return;
    }
    if (kembalian < 0) {
      alert("Pembayaran Kurang dari Tagihan");
      return;
    }
    // toas
    const toastId = toast.loading("Sending data...");
    try {
      const params = {
        cart_id: cart_id,
        ttlBayar: ttlBayar,
        valInputBayar: valInputBayar,
        valInputPelanggan: valInputPelanggan,
        kembalian: kembalian,
      };
      // console.log(params);
      const response = await api.post("/store-bayar", params, {
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
          // close modal bayar
          closeModalBayar();
          // delete
          deleteCart();
          toast.update(toastId, {
            render: "Sukses melakukan pembayaran",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }
      // console.log(response.data);
    } catch (error) {
      // const errors = error.response?.data?.errors;
      let errorMessages;
      console.log(error.response);
      // if (errors) {
      //   // Jika errors ada, buat string gabungan dari pesan error
      //   errorMessages = Object.keys(errors)
      //     .map((field) => `${field}: ${errors[field].join(", ")}`)
      //     .join("\n");

      //   console.log(errorMessages);
      // } else {
      //   // Jika errors tidak ada
      //   errorMessages = "No errors found in the response.";
      //   console.log("No errors found in the response.");
      // }
      toast.update(toastId, {
        render: `Error sending data ! \n${errorMessages}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error(`Error sending data ! \n${errorMessages}`);
    }
  };

  // perhitungan

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white w-[90%] md:w-1/2 h-auto p-6 rounded-lg shadow-lg relative z-10">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-black font-poppins">
          Pembayaran
        </h2>
        <div className="h-[2px] w-full bg-colorPrimary mb-4"></div>
        <div className="">
          <div className="w-full">
            <div className="font-poppins text-lg md:text-xl flex justify-between font-semibold my-2">
              <h3 className="text-black">PEMBAYARAN</h3>
              {/* <h3 className="text-black">{formatRupiah(result)}</h3> */}
              <h3 className="text-black">{formatRupiah(valInputBayar)}</h3>
            </div>
            <div className="font-poppins text-lg md:text-xl flex justify-between font-semibold">
              <h3 className="text-black">TAGIHAN</h3>
              <h3 className="text-colorRed">{formatRupiah(tagihan)}</h3>
            </div>
            <div className="h-[2px] w-full bg-colorPrimary my-2"></div>
            <div className="font-poppins text-lg md:text-xl flex justify-between font-semibold">
              <h3 className="text-black">KEMBALIAN</h3>
              <h3
                className={`text-black px-2 ${
                  kembalian >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {formatRupiah(kembalian)}
              </h3>
            </div>
            <div className="text-right">
              <input
                onChange={(event) => handleInputBayar(event)}
                value={valInputBayar}
                placeholder="Bayar"
                autoFocus
                className="w-full mt-5 text-right border border-colorPrimary py-4 px-2 font-poppins font-semibold"
              ></input>
              <small className="text-xs text-red-500">
                *<i>Wajib diisi</i>
              </small>
            </div>
            <div className="mt-2 text-right">
              <input
                onChange={(event) => handleInputPelanggan(event)}
                value={valInputPelanggan}
                placeholder="Nama pelanggan"
                className="w-full mt-1 text-right border border-colorPrimary py-2 px-2 font-poppins font-semibold"
              ></input>
              <small className="text-xs text-colorPrimary ">
                *<i>Boleh dikosongi</i>
              </small>
            </div>
          </div>
          {/* <div className="md:w-1/2">
            <div className="bg-colorGray w-full mt-4 md:mt-0 md:w-3/4 ml-auto">
              <div className="h-20 flex items-center">
                <div className="bg-white mx-4 w-full md:py-5 py-3 md:px-2 px-1 text-right font-poppins font-bold text-black text-md md:text-xl">
                  {formatRupiah(result) || 0}
                </div>
              </div>
              <div className="grid grid-cols-3 font-poppins font-bold text-black text-md md:text-xl">
                <div
                  onClick={() => handleNumber(1)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  1
                </div>
                <div
                  onClick={() => handleNumber(2)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  2
                </div>
                <div
                  onClick={() => handleNumber(3)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  3
                </div>
                <div
                  onClick={() => handleNumber(4)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  4
                </div>
                <div
                  onClick={() => handleNumber(5)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  5
                </div>
                <div
                  onClick={() => handleNumber(6)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  6
                </div>
                <div
                  onClick={() => handleNumber(7)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  7
                </div>
                <div
                  onClick={() => handleNumber(8)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  8
                </div>
                <div
                  onClick={() => handleNumber(9)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  9
                </div>
                <div
                  onClick={() => handleNumber("c")}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  C
                </div>
                <div
                  onClick={() => handleNumber(0)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  0
                </div>
                <div
                  onClick={() => deleteItem()}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white m-1 flex items-center justify-center cursor-pointer mx-auto"
                >
                  X
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* <input type="text" name="customer" className={`border-2 border-colorBlue block mb-4 py-1 w-full px-2`} placeholder="" /> */}
        <div className="flex justify-between mt-5">
          <button
            className="px-2 md:px-4 py-1 md:py-2 bg-colorGray border-2 border-colorBlue font-poppins text-black rounded hover:bg-slate-200"
            onClick={onClose}
          >
            Close
          </button>
          <button
            onClick={() => handleStoreBayar()}
            type="submit"
            className="px-2 md:px-4 py-1 md:py-2 bg-colorPrimary font-poppins text-colorGray rounded hover:bg-blue-900"
          >
            Bayar & Cetak
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPembayaran;
