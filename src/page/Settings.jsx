import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

const Setting = () => {
  //
  const nowPrintSelected = localStorage.getItem("printSelected");
  const [selected, setSelected] = useState(nowPrintSelected);
  const handleSelected = (val) => {
    if (val === "kabel") {
      window.location.reload();
    }
    setSelected(val);
    localStorage.setItem("printSelected", val);
  };
  return (
    <div className="px-5 py-3 h-[86%]">
      <div className="h-full overflow-auto p-3">
        <table className="w-full md:w-1/2 md:mx-auto border-collapse border border-gray-200 shadow-md rounded-lg text-xs md:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold text-center">
              <th className="px-1 py-3 border border-gray-200">No</th>
              <th className="px-1 py-3 border border-gray-200">Nama</th>
              <th className="px-1 py-3 border border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr key="11" className="border border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 border border-gray-200 text-center">
                1
              </td>
              <td className="px-6 py-3 border border-gray-200 text-center">
                Printer
              </td>
              <td className="px-6 py-3 border border-gray-200 text-center">
                <div className="flex gap-2 items-center">
                  <input
                    checked={selected === "bluethoot"}
                    onChange={() => handleSelected("bluethoot")}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Bluetooth
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    checked={selected === "kabel"}
                    onChange={() => handleSelected("kabel")}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Kabel
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Setting;
