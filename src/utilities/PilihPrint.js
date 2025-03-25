import PrintBluethoot from "./PrintBluethoot";
import PrintKabel from "./PrintKabel";

const PilihPrint = (datas, ttlPembelian, cash, kembalian) => {
  const pusat = localStorage.getItem("toko_pusat");
  const cabang = localStorage.getItem("cabang_nama");
  //
  const stPrinter = localStorage.getItem("printSelected");
  if (stPrinter === "bluethoot") {
    return PrintBluethoot(datas, pusat, cabang, ttlPembelian, cash, kembalian);
  } else {
    return PrintKabel(datas, pusat, cabang, ttlPembelian, cash, kembalian);
  }
};

export default PilihPrint;
