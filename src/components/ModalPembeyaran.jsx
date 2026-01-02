import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utilities/axiosInterceptor";
import { QZTrayProvider, useQZTray } from "./QZTrayContext";
import PrintBluethootPos from "../utilities/PrintBluethootPos";

function ModalPembayaran({
  isOpen,
  onClose,
  ttlBayar,
  cart_id,
  deleteCart,
  cart_data,
}) {
  // TOKEN
  const token = localStorage.getItem("token");
  const pusat = localStorage.getItem("toko_pusat");
  const cabang = localStorage.getItem("cabang_nama");
  //
  const [number, setNumber] = useState([]);
  const [tagihan, setTagihan] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [resCartData, setCartData] = useState(cart_data);

  // Update total bayar dari backend
  useEffect(() => {
    getGrandTotalByCartId();
  }, []);
  const getGrandTotalByCartId = async () => {
    //fetching
    const params = { 'cart_id' : cart_id };
    const response = await api.post("/get-cart-subtotal-draft", params, {
      headers: {
        Authorization: `Bearer ${token}`, // Sisipkan token di header
      },
    });
    if (response.status === 200) {
      //get response data
      const draftTagihan = await response.data.grand_total;
      const draftCart = await response.data.rs_draft;
      // console.log(draftTagihan);
      setTagihan(draftTagihan ?? ttlBayar);
      setCartData(draftCart);
    } else {
      console.log(response.status);
    }
  }
  
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
    // const val = event.target.value;
    let input = event.target.value.replace(/\./g, "");
    if (/^\d*$/.test(input)) {
      let res = Number(input);
      setKembalian(res - parseInt(tagihan));
      setValInputBayar(res);
    }
  };

  const formatRupiah_2 = (angka) => {
    if (typeof angka !== "number") {
      angka = parseInt(angka, 10); // Pastikan angka diubah menjadi number
      if (isNaN(angka)) return "Rp0"; // Jika bukan angka, kembalikan default
    }

    // Ubah angka ke string dan tambahkan tanda titik setiap 3 digit
    const rupiah = angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `Rp${rupiah}`;
  };

  const { isConnected, printer, findPrinter } = useQZTray();

  function padCenter(text, width, padChar = " ") {
    let padding = width - text.length;
    let padStart = Math.floor(padding / 2);
    let padEnd = padding - padStart;
    return padChar.repeat(padStart) + text + padChar.repeat(padEnd);
  }
  // print kabel
  const printThermal = async () => {
    try {
      if (!printer) {
        alert("Printer belum dipilih!");
        return;
      }
      // start content
      const printDatas = resCartData;
      // Format tabel dengan padding
      const pusat_nama = pusat;
      const cabang_nama = cabang;
      //
      const now = new Date();
      //
      let content = padCenter(pusat_nama, 30, " ") + "\n";
      content += padCenter(cabang_nama, 30, " ") + "\n";
      content += padCenter(`${now.toLocaleString()}`, 30, " ") + "\n";
      content += "=============================" + "\n";
      content += "| Item     |Qty| Price       |" + "\n";
      content += "=============================" + "\n";

      printDatas.forEach((item) => {
        let nama = item.barang_nama;
        let cart_diskon = item.barang_st_diskon === "yes" ? " (Grosir)" : "";
        let qty = String(item.cart_qty).padStart(1, " ");
        let harga = `${formatRupiah(item.barang_harga_jual)}`.padEnd(8, " ");
        let subTotal = `${formatRupiah(item.cart_subtotal)}`.padStart(11, " ");
        content += `| ${nama}${cart_diskon}\n| ${harga} | ${qty} | ${subTotal} |\n`;
      });

      content += "=============================" + "\n";
      content +=
        "| Total".padEnd(13, " ") +
        `${formatRupiah(tagihan)}`.padStart(15, " ") +
        " |\n";
      content += "-----------------------------" + "\n";
      content +=
        "| Bayar".padEnd(13, " ") +
        `${formatRupiah(valInputBayar)}`.padStart(15, " ") +
        " |\n";
      content +=
        "| Kembalian".padEnd(13, " ") +
        `${formatRupiah(kembalian)}`.padStart(15, " ") +
        " |\n";
      content += "=============================" + "\n";
      content += padCenter("Terimakasih", 30, " ") + "\n\n";
      // end content

      // Data dummy sebagai pengganti respons API Laravel
      const printData = {
        options: {
          printer: "POS-58", // Nama printer
          "font-size": 11, // Ukuran font
        },
        content: content,
      };

      console.log("Print Data (Dummy):", printData);
      const qz = window.qz; // Akses qz dari window
      // Konfigurasi printer
      const config = qz.configs.create(printData.options.printer, {
        fontSize: printData.options["font-size"], // Sesuaikan opsi lainnya
      });

      // Data yang akan dicetak
      const data = [
        {
          type: "raw",
          format: "plain",
          data: printData.content,
        },
      ];

      // Kirim perintah cetak
      await qz.print(config, data);
      console.log("Print job successful");
      alert("Print job sent successfully!");
    } catch (error) {
      console.error("Error during printing:", error);
      alert("Error during printing: " + error.message);
    }
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
        ttlBayar: tagihan ?? ttlBayar,
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
      // const response = { status: 200, data: { success: true } };
      if (response.status === 200) {
        if (response.data.success === false) {
          toast.update(toastId, {
            render: response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 1000,
          });
        } else {
          // status printer
          const stPrinter = localStorage.getItem("printSelected");
          if (stPrinter === "kabel") {
            printThermal();
          } else {
            PrintBluethootPos(
              resCartData,
              pusat,
              cabang,
              tagihan,
              valInputBayar,
              kembalian
            );
          }
          // close modal bayar
          closeModalBayar();
          // delete
          deleteCart();
          toast.update(toastId, {
            render: "Sukses melakukan pembayaran",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        }
      }
      // console.log(response.data);
    } catch (error) {
      // const errors = error.response?.data?.errors;
      let errorMessages;
      console.log(error.response);
      toast.update(toastId, {
        render: `Error sending data ! \n${errorMessages}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error(`Error sending data ! \n${errorMessages}`);
    }
  };
  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
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
        <p>QZ Tray: {isConnected ? "Connected" : "Disconnected"}</p>
        <p>Printer: {printer || "Not Found"}</p>
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
                pattern="\d*"
                inputMode="numeric"
                onChange={(event) => handleInputBayar(event)}
                value={formatNumber(valInputBayar)}
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
