"use client"

import { useAuth, UserData } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UserProfilePage: React.FC = () => {
  const { user } = useAuth()

  const userDefault = {
    id: 0,
    username: "",
    email: "",
    name: "",
    gender: "",
    major: "",
    studentId: "",
    birthPlace: "",
    birthDate: "",
    phoneNumber: "",
    avatar: ""
  }

  const [userData, setUserData] = useState<UserData>(user || userDefault);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch('/api/user/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData.id.toString()
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      setUserData(data.user);
      toast.success("Data updated successfully")
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setUserData(user || userDefault)
  }, [user])

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-5 text-red-500">
      <i className="bi bi-exclamation-triangle text-3xl mb-2"></i>
      <p>{error}</p>
    </div>
  );

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <i className="bi bi-pencil-fill"></i>
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 border border-teal-500 text-teal-500 px-4 py-2 rounded-lg hover:bg-teal-50 transition"
          >
            <i className="bi bi-x-lg"></i>
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
              <i className="bi bi-person-fill text-teal-500 text-4xl"></i>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium">{userData.name}</h3>
            <p className="text-gray-600">{userData.major}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="username"
              name="username"
              value={userData.username}
              disabled
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
            <input
              type="text"
              name="major"
              value={userData.major}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={userData.studentId}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
            <input
              type="text"
              name="birthPlace"
              value={userData.birthPlace}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formatDate(userData.birthDate)}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border-2 rounded-lg text-sm ${isEditing
                ? 'border-teal-300 focus:outline-none focus:border-teal-500'
                : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </main>
  );
};

export default UserProfilePage;