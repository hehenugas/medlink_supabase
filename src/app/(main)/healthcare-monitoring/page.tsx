"use client";

import { useAuth } from "@/context/AuthContext";
import { HistoricalData } from "#/prisma/db";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import MedicalCheckupChart from "@/components/MedicalCheckUpChart";

export default function HealthcareMonitoringPage() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingSend, setLoadingSend] = useState(false);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [sensorData, setSensorData] = useState([
    { name: "Temperature", value: "", unit: "°C" },
    { name: "Blood Pressure", value: "", unit: "mmHg" },
    { name: "Heart Rate", value: "", unit: "BPM" },
    { name: "SPO2", value: "", unit: "%" },
  ]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<() => void>(() => {});

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch("/api/medical-checkup");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setHistoricalData(data);
      } catch (error) {
        console.error("Gagal mengambil data medical checkup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [loading]);

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let reconnectInterval: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      setWsStatus("connecting");

      const isSecure = window.location.protocol === "https:";
      const wsProtocol = isSecure ? "wss" : "ws";
      const wsUrl = `${wsProtocol}://${window.location.host}/api/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        setWsStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "sensor_data" && Array.isArray(msg.data?.sensors)) {
            const sensors = msg.data.sensors;

            const getSensorValue = (name: string) => {
              const sensor = sensors.find((s: any) => s.name === name);
              return sensor ? { value: sensor.value, unit: sensor.unit } : { value: "", unit: "" };
            };

            const newSigns = [
              { name: "Temperature", ...getSensorValue("Temperature") },
              { name: "Blood Pressure", ...getSensorValue("Blood Pressure") },
              { name: "Heart Rate", ...getSensorValue("Heart Rate") },
              { name: "SPO2", ...getSensorValue("SPO2") },
            ];

            setSensorData(newSigns);
          }
        } catch {}
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        clearTimeout(timeout);
        setWsStatus("disconnected");

        reconnectInterval = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    };

    reconnectRef.current = connectWebSocket;
    connectWebSocket();

    return () => {
      clearTimeout(timeout);
      if (reconnectInterval) clearTimeout(reconnectInterval);
      wsRef.current?.close();
    };
  }, []);


  const handleSend = async () => {
    const hasEmptyValue = sensorData.some((sign) => sign.value.trim() === "");
    if (hasEmptyValue) {
      toast.error("Sensor Data is not complete");
      return;
    }

    try {
      setLoadingSend(true);
      const payload = sensorData.map((sign) => ({
        parameter: sign.name,
        value: sign.value,
        unit: sign.unit,
        information: "Normal",
        date: new Date().toISOString(),
      }));

      const response = await fetch("/api/medical-checkup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      toast.success("Vital signs submitted successfully!");
    } catch (error) {
      toast.error("Error sending data");
    } finally {
      setLoading(true);
      setLoadingSend(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Healthcare Services</h1>
        <p className="text-lg">Your complete health solution partner</p>
      </div>

      {/* Diagnoses Section */}
      <div className="mb-6">
        <div className="flex flex-col gap-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Patient Information */}
            <div className="flex flex-col w-full border rounded-xl shadow-sm">
              <div className="h-[50px] flex items-center bg-teal-50 rounded-t-xl">
                <p className="pl-5 text-xl font-semibold text-teal-800">
                  Patient Information
                </p>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <p>
                  <span className="font-medium">Name:</span> {user?.name}
                </p>
                <p>
                  <span className="font-medium">Student ID:</span> {user?.studentId}
                </p>
                <p>
                  <span className="font-medium">Major:</span> {user?.major}
                </p>
                <p>
                  <span className="font-medium">Gender:</span> {user?.gender}
                </p>
                <p>
                  <span className="font-medium">Birth Place:</span> {user?.birthPlace}
                </p>
                <p>
                  <span className="font-medium">Birth Date:</span>{" "}
                  {user?.birthDate ? formatDate(user.birthDate) : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone Number:</span> {user?.phoneNumber}
                </p>
              </div>
            </div>

            {/* Current Vital Signs */}
            <div className="flex flex-col w-full border rounded-xl shadow-sm">
              <div className="h-[50px] w-full flex items-center bg-teal-50 rounded-t-xl">
                <div className="px-5 flex w-full items-center justify-between text-xl font-semibold text-teal-800">
                  <span>Sensor Data</span>
                  <div>
                    {wsStatus === "connecting" && (
                      <span className="text-sm text-gray-500">connecting...</span>
                    )}
                    {wsStatus === "connected" && (
                      <span className="text-sm text-gray-500">connected</span>
                    )}
                    {wsStatus === "disconnected" && (
                      <button
                        onClick={() => reconnectRef.current?.()}
                        className="text-sm text-red-500 underline"
                      >
                        Reconnect
                      </button>
                    )}
                  </div>
                </div>

              </div>
              <div className="flex flex-wrap w-full p-5">
                {sensorData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-center gap-2 py-6 min-w-[150px]"
                  >
                    <p className="text-lg font-medium text-teal-800">
                      {data.name}
                    </p>
                    <p className="text-4xl font-bold text-teal-800">
                      {data.value === "" ? "--" : data.value}
                    </p>
                    <p className="text-sm">{data.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSend}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              {loadingSend ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Sending...
                </>
              ) : (
                <>Send</>
              )}
            </button>
          </div>

          {/* Historical Data */}
          <div className="flex flex-col w-full border rounded-xl shadow-sm">
            <div className="h-[50px] flex items-center bg-teal-50 rounded-t-xl">
              <p className="pl-5 text-xl font-semibold text-teal-800">
                Historical Data
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-50">
                    <th className="text-left p-4 border-b">Measurement</th>
                    <th className="text-left p-4 border-b">Value</th>
                    <th className="text-left p-4 border-b">Status</th>
                    <th className="text-left p-4 border-b">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData?.map((data: HistoricalData, index: any) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{data.parameter}</td>
                      <td className="p-4 border-b">
                        {data.value} {data.unit}
                      </td>
                      <td className="p-4 border-b">{data.information}</td>
                      <td className="p-4 border-b">{formatDate(data.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          {historicalData.length > 0 && (
            <MedicalCheckupChart data={historicalData as any} />
          )}
        </div>
      </div>
    </div>
  );
}