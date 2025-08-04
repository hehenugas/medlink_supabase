import Link from "next/link";

export default function LaboratoryPage() {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
          <h1 className="text-2xl font-bold mb-2">Laboratory Services</h1>
          <p className="text-lg">Accurate and fast test results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="lab-service-card">
            <h3 className="text-xl font-semibold">Blood Test</h3>
            <p className="text-gray-600">Complete blood count analysis</p>
          </div>
          <div className="lab-service-card">
            <h3 className="text-xl font-semibold">Urine Test</h3>
            <p className="text-gray-600">Comprehensive urine analysis</p>
          </div>
          <Link href="/laboratory/mri">
            <div className="lab-service-card">
              <h3 className="text-xl font-semibold">MRI Test</h3>
              <p className="text-gray-600">Comprehensive MRI analysis</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }