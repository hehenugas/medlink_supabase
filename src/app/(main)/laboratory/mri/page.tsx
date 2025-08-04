export default function MRIPage() {
  const mriScans = [
    {
      id: 1,
      patientId: "PT-1245",
      scanType: "Brain MRI",
      date: "2025-04-15",
      time: "09:30 AM",
      imageUrl: "/mri-brain-1.jpg",
      doctor: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      patientId: "PT-1245",
      scanType: "Lumbar Spine MRI",
      date: "2025-03-22",
      time: "02:15 PM",
      imageUrl: "/mri-spine-1.jpg",
      doctor: "Dr. Michael Chen"
    },
    {
      id: 3,
      patientId: "PT-1245",
      scanType: "Knee MRI",
      date: "2025-02-10",
      time: "11:45 AM",
      imageUrl: "/mri-knee-1.jpg",
      doctor: "Dr. Lisa Wong"
    },
    {
      id: 4,
      patientId: "PT-1245",
      scanType: "Brain MRI",
      date: "2024-12-05",
      time: "10:00 AM",
      imageUrl: "/mri-brain-2.jpg",
      doctor: "Dr. Sarah Johnson"
    },
    {
      id: 5,
      patientId: "PT-1245",
      scanType: "Shoulder MRI",
      date: "2024-11-18",
      time: "01:30 PM",
      imageUrl: "/mri-shoulder-1.jpg",
      doctor: "Dr. James Wilson"
    }
  ];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">MRI Scans</h1>
        <p className="text-lg">View and manage your MRI scan history</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">Scan</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">Doctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mriScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        {/* Placeholder for actual MRI image */}
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <i className="bi bi-file-medical-fill text-2xl"></i>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{scan.scanType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scan.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scan.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scan.doctor}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}