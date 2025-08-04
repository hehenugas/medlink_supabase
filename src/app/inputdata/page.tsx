import React from "react";

const InputData = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-700">
      <div className="px-52 py-10">
        <p className="text-white text-2xl font-bold">SOAP & Pemeriksaan Baru</p>
      </div>
      <div className="flex w-full h-fit justify-center items-center">
        <div className="flex flex-col bg-[#1e1e1e] rounded-xl border-2 border-gray-700 px-3 w-4/5 h-[350px]">
          <p className="pt-5 pl-3 text-white text-xl font-bold">Pemeriksaan</p>
          <div className="flex justify-between w-full h-fit px-3">
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Tensi(mmHg)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Suhu Tubuh(C)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Nadi(x/mnt)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Respirasi(x/mnt)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Tinggi(cm)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
          </div>
          <div className="flex justify-between w-full h-fit px-3">
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Berat(kg)</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
          </div>

          <div className="flex justify-between w-full h-fit px-3">
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">PSN</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">SPO2</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">GCS</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Alergi</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
            <div className="flex flex-col w-[250px] h-fit text-gray-400 pt-5">
              <p className="pb-3">Lingkar Perut</p>
              <input className="w-full bg-gray-600 rounded-sm pl-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputData;
