import { useEffect, useState } from "react";

export default function Rightbar() {
  const [upcomingAppointment, setUpcomingAppointment] = useState<any[]>([])
  const [lastMessage, setLastMessage] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch("/api/appointments/upcoming");
        const data = await res.json();
        setUpcomingAppointment(data);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLastMessages = async () => {
      try {
        const res = await fetch("/api/message/last");
        const data = await res.json();
        setLastMessage(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
    fetchLastMessages();
  }, []);

  const formatDate = (date: string | Date) => {
    if (date === "") return

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

  return (
    <div>
      <div className="mb-5">
        <h4 className="font-semibold text-lg mb-4">Patient Schedule</h4>
        <div className="flex gap-2">
          <div className="flex-1 bg-teal-500 text-white rounded-lg p-3 text-center">
            <div>2024 December</div>
            <div className="text-2xl font-bold">20</div>
            <div>Surgery</div>
          </div>
          <div className="flex-1 bg-gray-100 text-gray-700 rounded-lg p-3 text-center">
            <div>2024 December</div>
            <div className="text-2xl font-bold">22</div>
            <div>Therapy</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="font-semibold text-lg mb-4">Appointment</h4>
        <div className="space-y-2">
          {upcomingAppointment.map((data: any, index: any) =>
            <div key={index} className="bg-teal-100 text-gray-800 p-3 rounded-lg">
              <strong>{data.purpose}</strong><br />
              {data.doctor.name}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div>
          <h4 className="font-semibold text-lg mb-4">Message</h4>
          <div className="p-3 bg-gradient-to-b from-teal-300 to-teal-700 text-white rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <img src="/assets/dashboard/doctor.svg" alt="Dr. Alfredo Torres" className="w-8 h-8 rounded-full" />
              <div>
                <strong>{lastMessage?.name}</strong><br />
                <small className="text-white text-opacity-80">{formatDate(lastMessage?.lastMessageTime || "")}</small>
              </div>
            </div>
            <p>{lastMessage?.lastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
