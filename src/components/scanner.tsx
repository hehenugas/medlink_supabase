"use client"

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

interface LoginProps {
  onLoginSuccess: (userInfo: string) => void;
}

const QRScanner: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      onLoginSuccess(data); // Passing the data to parent component
    }
  };

  const handleError = (error: any) => {
    setScanError(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-primary-100 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Login via QR Code
      </h2>
      <div className="w-full mb-4">
        <Scanner
          scanDelay={300}
          // classNames={"w-full"}
          // style="w-full"
          onError={handleError}
          onScan={(result) => console.log(result)}
        />
      </div>
      {scanError && (
        <p className="text-red-500 text-sm mt-2">Error: {scanError}</p>
      )}
      {scanResult && (
        <p className="text-green-500 text-sm mt-2">
          QR Code Data: {scanResult}
        </p>
      )}
    </div>
  );
};

export default QRScanner;
