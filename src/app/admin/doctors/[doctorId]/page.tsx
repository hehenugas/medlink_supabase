"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

interface PracticeHour {
  id: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  doctorId: number;
}

interface DoctorData {
  id: number;
  name: string;
  specialist: string;
  education: string;
  experience: string;
  location: string;
  about: string;
  practiceHours: PracticeHour[];
}

const doctorDefault: DoctorData = {
  id: 0,
  name: "",
  specialist: "",
  education: "",
  experience: "",
  location: "",
  about: "",
  practiceHours: [],
};

const allDaysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const EditDoctorPage: React.FC = () => {
  const params = useParams();
  const doctorId = params?.doctorId as string | undefined;

  const [doctorData, setDoctorData] = useState<DoctorData>(doctorDefault);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPracticeHour, setNewPracticeHour] = useState({
    dayOfWeek: "",
    startTime: "09:00",
    endTime: "17:00",
  });

  const getAvailableDays = () => {
    const usedDays = new Set(doctorData.practiceHours.map(ph => ph.dayOfWeek));
    return allDaysOfWeek.filter(day => !usedDays.has(day));
  };

  const availableDays = getAvailableDays();

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await response.json();
        setDoctorData(data);

        const usedDays = new Set(data.practiceHours.map((ph: PracticeHour) => ph.dayOfWeek));
        const firstAvailableDay = allDaysOfWeek.find(day => !usedDays.has(day)) || "";
        setNewPracticeHour(prev => ({
          ...prev,
          dayOfWeek: firstAvailableDay
        }));
      } catch (err: any) {
        setError("Failed to load doctor data");
      } finally {
        setLoading(false);
      }
    }

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewPracticeHourChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPracticeHour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: doctorData.name,
          specialist: doctorData.specialist,
          education: doctorData.education,
          experience: doctorData.experience,
          location: doctorData.location,
          about: doctorData.about,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePracticeHour = async (practiceHourId: number) => {
    if (!confirm("Are you sure you want to delete this practice hour?")) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}/practice-hours/${practiceHourId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete practice hour");
      }
      setDoctorData((prev) => ({
        ...prev,
        practiceHours: prev.practiceHours.filter((ph) => ph.id !== practiceHourId),
      }));
    } catch (err) {
      toast.error("Failed to delete practice hour");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPracticeHour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}/practice-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayOfWeek: newPracticeHour.dayOfWeek,
          startTime: newPracticeHour.startTime,
          endTime: newPracticeHour.endTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add practice hour");
      }

      const newHour = await response.json();

      setDoctorData((prev) => ({
        ...prev,
        practiceHours: [...prev.practiceHours, newHour],
      }));

      setShowModal(false);
      setNewPracticeHour({
        dayOfWeek: "Monday",
        startTime: "09:00",
        endTime: "17:00",
      });
    } catch (err) {
      toast.error("Failed to add practice hour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Doctor Profile</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <i className="bi bi-exclamation-triangle text-3xl mb-2"></i>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
            >
              <i className="bi bi-pencil-fill"></i>
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="border border-teal-500 text-teal-500 px-4 py-2 rounded-lg hover:bg-teal-50 transition flex items-center gap-2"
            >
              <i className="bi bi-x-lg"></i>
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-5 flex justify-between items-center">
          <span>Doctor profile updated successfully!</span>
          <button onClick={() => setSaveSuccess(false)} className="text-green-700">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-800 p-4 text-white">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-teal-300 flex items-center justify-center text-teal-800 text-xl font-bold border-2 border-white">
                {doctorData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{doctorData.name}</h3>
                <p className="text-teal-100">{doctorData.specialist}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={doctorData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${
                    isEditing
                      ? "border-teal-300 focus:outline-none focus:border-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Specialist</label>
                <input
                  type="text"
                  name="specialist"
                  value={doctorData.specialist}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${
                    isEditing
                      ? "border-teal-300 focus:outline-none focus:border-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={doctorData.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${
                    isEditing
                      ? "border-teal-300 focus:outline-none focus:border-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={doctorData.experience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${
                    isEditing
                      ? "border-teal-300 focus:outline-none focus:border-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={doctorData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${
                    isEditing
                      ? "border-teal-300 focus:outline-none focus:border-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs text-gray-500 mb-1">About</label>
              <textarea
                name="about"
                value={doctorData.about}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-2 border-2 rounded-lg ${
                  isEditing
                    ? "border-teal-300 focus:outline-none focus:border-teal-500"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end mb-5">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {/* Practice Hours Section */}
          <div className="border-t pt-5 mt-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Practice Hours</h4>
              <button
                onClick={() => setShowModal(true)}
                className={`bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2 ${getAvailableDays().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={getAvailableDays().length === 0}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Practice Hours</span>
              </button>
            </div>

            {doctorData.practiceHours.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <i className="bi bi-calendar-x text-gray-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No practice hours available</h3>
                <p className="text-gray-500">Add practice hours to let patients know when this doctor is available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctorData.practiceHours.map((ph) => (
                  <div
                    key={ph.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <i className="bi bi-calendar2-week text-teal-500 mr-2"></i>
                          <h5 className="text-md font-medium text-gray-900">{ph.dayOfWeek}</h5>
                        </div>
                        <div className="flex items-center">
                          <i className="bi bi-clock text-teal-500 mr-2"></i>
                          <p className="text-gray-600">
                            {ph.startTime} - {ph.endTime}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePracticeHour(ph.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding practice hours */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add Practice Hours</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddPracticeHour}>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Day of Week</label>
                {availableDays.length > 0 ? (
                  <select
                    name="dayOfWeek"
                    value={newPracticeHour.dayOfWeek}
                    onChange={handleNewPracticeHourChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    {availableDays.length > 0 && newPracticeHour.dayOfWeek === "" && (
                      <option value="" disabled>Select a day</option>
                    )}
                    {availableDays.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    All days have been scheduled
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={newPracticeHour.startTime}
                  onChange={handleNewPracticeHourChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={newPracticeHour.endTime}
                  onChange={handleNewPracticeHourChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  disabled={availableDays.length === 0 || newPracticeHour.dayOfWeek === ""}
                >
                  Add Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditDoctorPage;