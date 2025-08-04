"use client";

import { MedicationInfo } from "@/app/api/pharmacy/route";
import { CalendarDays, Clock, Pill, Repeat2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PharmacyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medications, setMedications] = useState<MedicationInfo[]>([]);

  // const medications = [
  //   {
  //     id: 1,
  //     name: "Paracetamol",
  //     dosage: "500mg",
  //     frequency: "3-4 times daily",
  //     icon: "bi-capsule",
  //   },
  //   {
  //     id: 2,
  //     name: "Amoxicillin",
  //     dosage: "250mg",
  //     frequency: "3 times daily",
  //     icon: "bi-capsule-pill",
  //   },
  //   {
  //     id: 3,
  //     name: "Omeprazole",
  //     dosage: "20mg",
  //     frequency: "Once daily",
  //     icon: "bi-pill",
  //   },
  //   {
  //     id: 4,
  //     name: "Simvastatin",
  //     dosage: "10mg",
  //     frequency: "Once daily at night",
  //     icon: "bi-capsule",
  //   },
  //   {
  //     id: 5,
  //     name: "Aspirin",
  //     dosage: "75mg",
  //     frequency: "Once daily",
  //     icon: "bi-pill-fill",
  //   },
  //   {
  //     id: 6,
  //     name: "Metformin",
  //     dosage: "500mg",
  //     frequency: "Twice daily",
  //     icon: "bi-capsule-pill",
  //   },
  // ];

  useEffect(() => {
    async function fetchMedications() {
      try {
        setLoading(true);
        const response = await fetch("/api/pharmacy");
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        const data = await response.json();
        setMedications(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchMedications();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Pharmacy</h1>
        <p className="text-lg">
          View medication information and dosage instructions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-teal-700">
                {medication.namaObat}
              </h3>
              <p className="text-sm text-gray-500">
                {medication.keteranganPenggunaan}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <Pill className="w-4 h-4 text-teal-600 mt-1" />
                <span>
                  <strong>Dosage:</strong> {medication.dosis}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Repeat2 className="w-4 h-4 text-teal-600 mt-1" />
                <span>
                  <strong>Usage:</strong> {medication.usagePerDay}× per day for{" "}
                  {medication.usageDay} days
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-teal-600 mt-1" />
                <span>
                  <strong>Time:</strong>{" "}
                  {Array.isArray(medication.jamPenggunaan)
                    ? medication.jamPenggunaan.join(", ")
                    : "-"}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays className="w-4 h-4 text-teal-600 mt-1" />
                <span>
                  <strong>Period:</strong>{" "}
                  {new Date(medication.tanggalMulaiObat).toLocaleDateString()} -{" "}
                  {new Date(medication.tanggalSelesaiObat).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
