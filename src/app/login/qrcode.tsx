'use client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CameraDevice, Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function QRCodeLogin() {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [loading, setLoading] = useState(false);
  const { qrLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (qrCode: string) => {
    try {
      setLoading(true);
      await qrLogin(qrCode);
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
      setScanning(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Select the first camera by default
          setSelectedCameraId(devices[0].id);
        } else {
          toast.error('No camera detected');
        }
      })
      .catch((err) => {
        toast.error('Failed to access camera');
      });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && scanning && selectedCameraId) {
      if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        const beep = new Audio('/sound/beep.mp3');
        beep.play();

        setResult(decodedText);
        setScanning(false);
        handleLogin(decodedText);
      };

      const onScanError = () => {};

      (async () => {
        try {
          await scanner.start(
            selectedCameraId,
            { fps: 10, qrbox: { width: 400, height: 400 } },
            onScanSuccess,
            onScanError
          );
        } catch (e) {
          toast.error("Failed to start scanner");
          scannerRef.current = null;
        }
      })();

      return () => {
        if (scannerRef.current) {
          scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
          scannerRef.current = null;
        }
      };
    }
  }, [scanning, selectedCameraId]);

  const restartScanner = () => {
    setResult('');
    setScanning(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 text-center w-full">
        <p className="text-gray-600 mb-4">Scan QR Code</p>

        {/* Camera select */}
        <select
          value={selectedCameraId}
          onChange={(e) => {
            const selected = cameras.find((c) => c.id === e.target.value);
            if (selected) setSelectedCameraId(selected.id);
          }}
          className="mb-4 p-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:border-teal-500"
        >
          <option value="">Select a camera</option>
          {cameras.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.label}
            </option>
          ))}
        </select>

        <div className="h-64 relative border-teal-500 bg-gray-100 border-2">
          {/* Area Scanner */}
          {!loading && (
            <div
              id="qr-reader"
              className="w-full h-full rounded-lg overflow-hidden relative"
            />
          )}

          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}

          {result && !loading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
              <button
                onClick={restartScanner}
                className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Scan Again
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        #qr-reader video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
}