"use client"

import { RoomCard } from "@/components/RoomCard"

export default function IPMonitoringPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">IV Monitoring</h1>
            <div className="grid grid-cols-2 gap-6">
                <RoomCard patientName="Akmal i" roomNumber="01" infuse_number={19} />
                <RoomCard patientName="Rivalta" roomNumber="02" infuse_number={49} />
                <RoomCard patientName="Marko" roomNumber="03" infuse_number={100} />
                <RoomCard roomNumber="04" infuse_number={0} />
            </div>
        </div>
    )
}