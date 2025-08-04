import Link from "next/link";

export default function HealthcarePage() {
  const services = [
    { link: "/healthcare/medical-checkup", name: "Medical Checkup", icon: "bi-heart-pulse" },
    { link: "/healthcare/vaccination", name: "Vaccination", icon: "bi-shield-plus" },
    { link: "/message", name: "Emergency Care", icon: "bi-hospital" },
  ];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Healthcare Services</h1>
        <p className="text-lg">Your complete health solution partner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Link
            key={index}
            href={`${service.link}`}
            className="service-card"
          >
            <div className="flex flex-col items-center p-6">
              <i className={`bi ${service.icon} text-4xl text-teal-600 mb-4`}></i>
              <h3 className="text-xl font-semibold">{service.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}