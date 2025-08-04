'use client';
import { RightbarContext } from '@/context/RightbarContext';
import { useState, useContext } from 'react';

const DUMMY_VACCINATIONS = [
  {
    id: 'vax-001',
    name: 'COVID-19 Vaccine',
    type: 'mRNA',
    manufacturer: 'Moderna',
    doses: [
      { dose: 1, date: '2022-01-15', location: 'Central Hospital' },
      { dose: 2, date: '2022-02-12', location: 'Central Hospital' },
      { dose: 3, date: '2022-09-05', location: 'Community Health Center' }
    ]
  },
  {
    id: 'vax-002',
    name: 'Seasonal Flu Vaccine',
    type: 'Inactivated',
    manufacturer: 'GlaxoSmithKline',
    doses: [
      { dose: 1, date: '2022-11-10', location: 'Pharmacy' }
    ]
  },
  {
    id: 'vax-003',
    name: 'Hepatitis B Vaccine',
    type: 'Recombinant',
    manufacturer: 'Merck',
    doses: [
      { dose: 1, date: '2021-05-20', location: 'City Clinic' },
      { dose: 2, date: '2021-06-18', location: 'City Clinic' },
      { dose: 3, date: '2021-11-22', location: 'City Clinic' }
    ]
  },
  {
    id: 'vax-004',
    name: 'Tetanus, Diphtheria, Pertussis (Tdap)',
    type: 'Toxoid',
    manufacturer: 'Sanofi Pasteur',
    doses: [
      { dose: 1, date: '2016-07-12', location: 'University Health Center' }
    ]
  }
];

export default function VaccinationPage() {
  const { setRightbarOpen } = useContext(RightbarContext);
  const [vaccinations, setVaccinations] = useState(DUMMY_VACCINATIONS);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter vaccinations based on search query
  const filteredVaccinations = vaccinations.filter(vax =>
    vax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vax.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vax.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Detailed view of a selected vaccination
  const renderVaccinationDetails = () => {
    if (!selectedVaccine) return null;

    return (
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{selectedVaccine.name}</h3>
          <button 
            onClick={() => setSelectedVaccine(null)}
            className="text-gray-500 hover:text-teal-600"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Type</p>
            <p className="font-medium">{selectedVaccine.type}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Manufacturer</p>
            <p className="font-medium">{selectedVaccine.manufacturer}</p>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-800 mb-3">Dose History</h4>
        <div className="space-y-3 mb-6">
          {selectedVaccine.doses.map((dose: any, index: number) => (
            <div key={`dose-${index}`} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-600 flex items-center justify-center rounded-full mr-3">
                {dose.dose}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{formatDate(dose.date)}</p>
                <p className="text-sm text-gray-500">{dose.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg hover:opacity-90 transition"
          >
            Print Record
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-full max-w-sm">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Search vaccinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-[50px] h-[50px] rounded-[20%] cursor-pointer hover:bg-gradient-to-b hover:from-teal-400 hover:to-teal-700 hover:text-white transition"
              onClick={() => setRightbarOpen((prev) => !prev)}
            >
              <i className="bi bi-sliders text-xl"></i>
            </div>
            <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[20%] cursor-pointer hover:bg-gradient-to-b hover:from-teal-400 hover:to-teal-700 hover:text-white transition">
              <i className="bi bi-bell-fill text-xl"></i>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/avatar.jpg" alt="User" className="w-10 h-10 rounded-full"/>
            <div>
              <strong>Marko Refianto</strong><br/>
              <small>D200 220 069</small>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-teal-800 text-white p-5 rounded-2xl flex justify-between items-center mb-5">
        <div className="max-w-lg">
          <h2 className="text-lg font-semibold mb-2">Vaccination Records</h2>
          <p className="mb-4">Track your vaccination history and stay up-to-date with recommended immunizations.</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <i className="bi bi-shield-check text-6xl"></i>
          </div>
        </div>
      </div>

      {selectedVaccine && renderVaccinationDetails()}

      <div className="mb-5">
        <div className="flex border-b border-gray-200">
          <div className="py-3 px-5 font-medium text-teal-600 border-b-2 border-teal-500">
            <i className="bi bi-clock-history mr-2"></i>
            Vaccination History
          </div>
        </div>

        <div className="mt-5">
          {filteredVaccinations.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="mb-3 text-gray-400">
                <i className="bi bi-search text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No vaccinations found</h3>
              <p className="text-gray-500">Try adjusting your search or add new vaccination records.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVaccinations.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedVaccine(vaccine)}
                >
                  <div className="mb-3">
                    <h3 className="font-medium">{vaccine.name}</h3>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    <p>Manufacturer: {vaccine.manufacturer}</p>
                    <p>Type: {vaccine.type}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">
                      {vaccine.doses.length} dose{vaccine.doses.length !== 1 ? 's' : ''} completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}