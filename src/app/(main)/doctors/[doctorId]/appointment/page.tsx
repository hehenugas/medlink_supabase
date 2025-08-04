"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { DoctorDetailsResponse, DoctorPracticeHours } from "@/app/api/doctors/[doctorId]/route";

const doctorImage = "/assets/dashboard/doctor.svg";

export default function DoctorAppointmentPage() {
  const router = useRouter();

  const params = useParams();
  const doctorId = params?.doctorId as string | undefined;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<DoctorDetailsResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>("");
  const [information, setInformation] = useState<string>("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const doctorData: DoctorDetailsResponse = await response.json();
        setDoctor(doctorData);
      } catch (err) {
        setError("Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose(e.target.value);
  };

  const handleInformationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInformation(e.target.value);
  };

  const handleBookAppointment = async () => {
    if (!doctor) {
      alert("Doctor information not available");
      return;
    }

    if (!purpose.trim()) {
      alert("Please specify the purpose of your appointment");
      return;
    }

    try {
      setBookingInProgress(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const practiceHour = getPracticeHourForDate();
      if (!practiceHour) {
        return;
      }

      const res = await fetch(`/api/appointments/${doctor.id}`, {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          purpose: purpose,
          information: information || "No additional information provided",
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to create appointment");
      }

      toast("Appointment booked successfully!")

      router.push("/appointment");
    } catch (err: any) {
      alert("Failed to book appointment. Please try again.\n" + err.message);
    } finally {
      setBookingInProgress(false);
    }
  };


  // Helper functions
  const formatDate = (date: Date): string => date.toISOString().split("T")[0];

  const formatDisplayDate = (date: Date): string =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getPracticeHourForDate = (): DoctorPracticeHours | null => {
    if (!doctor) return null;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = dayNames[selectedDate.getDay()];
    return (
      doctor.practiceHours.find((ph) => ph.dayOfWeek === currentDayName) || null
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading doctor's schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md mx-auto max-w-4xl mt-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!doctor) return null;

  const practiceHour = getPracticeHourForDate();

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      {/* Navigation breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm">
        <Link href="/dashboard" className="text-gray-500 hover:text-teal-500">Dashboard</Link>
        <i className="bi bi-chevron-right text-gray-500"></i>
        <Link href="/doctors" className="text-gray-500 hover:text-teal-500">Doctors</Link>
        <i className="bi bi-chevron-right text-gray-500"></i>
        <Link href={`/doctors/${doctorId}`} className="text-gray-500 hover:text-teal-500">{doctor.name}</Link>
        <i className="bi bi-chevron-right text-gray-500"></i>
        <span className="text-teal-600 font-medium">Book Appointment</span>
      </div>

      {/* Doctor Profile Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-5">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-800 text-white p-5">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-full">
              <img src={doctorImage} alt="Doctor" className="w-24 h-24" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold">{doctor.name}</h2>
              <p className="text-teal-100">{doctor.specialist}</p>
            </div>
          </div>
        </div>

        {/* Practice Hours Display */}
        <div className="p-5 bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Practice Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {doctor.practiceHours.map((hour) => (
              <div key={hour.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <span className="font-medium text-teal-700">{hour.dayOfWeek}</span>
                <p className="mt-1 text-gray-600">{hour.startTime} - {hour.endTime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Booking Section */}
        <div className="p-5">
          <h3 className="text-xl font-medium mb-4">Book an Appointment</h3>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Select Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min={formatDate(new Date())}
              value={formatDate(selectedDate)}
              onChange={handleDateChange}
            />
            <p className="text-sm text-gray-500 mt-2">Showing availability for {formatDisplayDate(selectedDate)}</p>
          </div>

          {/* If no doctor schedule */}
          {!practiceHour && (
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500">No appointments available on this day</p>
          </div>
            </div>
          )}

          {/* Purpose and Additional Information */}
          {practiceHour && (
            <>
              {/* Purpose Field */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular check-up, Consultation, Follow-up"
                  value={purpose}
                  onChange={handlePurposeChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Additional Information Field */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Additional Information
                </label>
                <textarea
                  placeholder="Any specific concerns or information the doctor should know about"
                  value={information}
                  onChange={handleInformationChange}
                  className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Booking Button */}
          <button
            onClick={handleBookAppointment}
            disabled={!practiceHour || bookingInProgress || (practiceHour && !purpose.trim())}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              practiceHour && !bookingInProgress && purpose.trim()
                ? 'bg-teal-500 hover:bg-teal-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {bookingInProgress ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Booking...
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}