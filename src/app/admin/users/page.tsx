'use client';

import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { User } from '#/prisma/db';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterProfession]);

  // const professions = [...new Set(users.map(user => user.profession))];

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return Object.values(user).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
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
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center gap-3">
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative w-full max-w-sm">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-gray-500">View:</span>
          <button
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid-3x3-gap-fill"></i>
          </button>
          <button
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list-ul"></i>
          </button>
        </div>
      </div>

      {/* User Cards */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {paginatedUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-800 p-4 text-white relative">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-white" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-300 flex items-center justify-center text-teal-800 text-xl font-bold border-2 border-white">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-teal-100">@{user.username}</p>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="text-white hover:bg-teal-600 hover:bg-opacity-30 rounded-full p-2">
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Student ID</label>
                      <p className="font-medium">{user.studentId}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Major</label>
                      <p className="font-medium">{user.major}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Gender</label>
                      <p className="font-medium">{user.gender}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Birth Place</label>
                      <p className="font-medium">{user.birthPlace}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Birth Date</label>
                      <p className="font-medium">{formatDate(user.birthDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone Number</label>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex justify-center items-center">
                  <div className="text-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col justify-center items-center">
                      <QRCodeCanvas
                        value={`${user.password}`}
                        size={100}
                      />
                      <div className="mt-5 w-[240px] overflow-hidden break-words text-xs">
                        {user.password}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Credentials QR Code</p>
                  </div>
                </div>
              </div>

              {/* <div className="border-t mt-4 pt-4 flex justify-between">
                <button className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
                  <i className="bi bi-pencil-square"></i>
                  <span>Edit</span>
                </button>
                <button className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <i className="bi bi-trash"></i>
                  <span>Delete</span>
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <i className="bi bi-search text-gray-500 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-500 text-sm">
          Showing {(currentPage - 1) * usersPerPage + 1}–{Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-teal-500 text-white' : 'border text-gray-500 hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </main>
  );
}
