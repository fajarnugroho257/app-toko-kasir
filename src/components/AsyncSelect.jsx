import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const AsyncSelect = ({ sendDataToParent }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [stManual, setStManual] = useState(false);
  const [stBarcode, setStBarcode] = useState(true);

  const aturInput = (pilihan) => {
    if (pilihan === "barcode") {
      setStBarcode(true);
      setStManual(false);
    } else {
      setStBarcode(false);
      setStManual(true);
    }
  };
  // Fungsi untuk menangani pencarian API berdasarkan input
  const handleInputChange = (input) => {
    setInputValue(input);

    // Hanya lakukan pencarian jika panjang input lebih dari 2 karakter
    if (input.length >= 1) {
      setIsLoading(true); // Menampilkan loading

      // Lakukan pencarian ke API
      axios
        .get(`http://127.0.0.1:8000/api/api-data-barang-cabang?query=${input}`) // Gantilah URL dengan API Anda
        .then((response) => {
          const data = response.data.map((item) => ({
            value: item.id, // ID sebagai value
            label: item.name, // Nama sebagai label yang ditampilkan
          }));
          setOptions(data); // Menampilkan opsi jika ada lebih dari satu hasil
          setIsLoading(false); // Sembunyikan loading
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Sembunyikan loading jika error
        });
    }
  };

  // Fungsi untuk menangani perubahan nilai select
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    // console.log("Selected ID:", selectedOption ? selectedOption.value : null);
    sendDataToParent(selectedOption ? selectedOption.value : null);
    setOptions([]);
  };

  //   useEffect(() => {
  //     sendDataToParent(selectedOption ? selectedOption.value : null);
  //     // console.log();
  //   }, [selectedOption]);
  const [valBarcode, serValBarcode] = useState("");
  const handleInputBarcodeChange = async (input) => {
    serValBarcode(input.target.value);
    const characterCount = input.target.value.length;
    if (characterCount >= 13) {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/api-barcode-data-barang-cabang?query=${input.target.value}`
      );

      if (Object.keys(response.data).length !== 0) {
        // console.log(response.data);
        sendDataToParent(response.data.id);
        serValBarcode("");
      }
    }
  };

  return (
    <div>
      <div className="flex gap-5 mb-2">
        <button
          onClick={() => aturInput("barcode")}
          className="cursor-pointer bg-colorPrimary text-white py-1 px-2 hover:"
        >
          Barcode
        </button>
        <button
          onClick={() => aturInput("manual")}
          className="cursor-pointer py-1 px-2 border border-colorPrimary"
        >
          Manual
        </button>
      </div>
      {stManual && (
        <Select
          autoFocus
          options={options} // Menyediakan opsi dari API
          value={selectedOption} // Nilai yang dipilih
          onChange={handleChange} // Fungsi saat pilihan berubah
          onInputChange={handleInputChange} // Fungsi untuk menangani perubahan input
          placeholder="Nama Barang / Barcode..."
          isClearable // Membuat pilihan dapat dihapus
          isLoading={isLoading} // Menampilkan loading jika sedang mengambil data
          inputValue={inputValue} // Mengatur nilai input yang diketik
          cacheOptions // Menyimpan opsi yang sudah dimuat untuk mempercepat pencarian berikutnya
        />
      )}
      {stBarcode && (
        <input
          className="border border-colorPrimary w-full py-2 px-2 rounded-sm "
          autoFocus
          value={valBarcode}
          placeholder="Barcode"
          onChange={handleInputBarcodeChange}
        ></input>
      )}
    </div>
  );
};

export default AsyncSelect;
