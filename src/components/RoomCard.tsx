"use client";

import { FaRegCircleQuestion } from "react-icons/fa6";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    patientName?: string;
    roomNumber: string;
    infuse_number: number;
}

export function RoomCard({ patientName, roomNumber, infuse_number }: Props) {
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const renderInfuseStatus = (status: "critical" | "warning" | "ok") => {
        const statusColor = {
            critical: "text-red-500",
            warning: "text-yellow-500",
            ok: "text-green-500"
        };

        const icon = {
            critical: "bi-x-circle-fill",
            warning: "bi-exclamation-triangle-fill",
            ok: "bi-check-circle-fill"
        };

        const description = {
            critical: "Infuse Info: \ninfuse value about 0% - 30%",
            warning: "Infuse Info: \ninfuse value about 30% - 50%",
            ok: "Infuse Info: \nInfuse value about 50% - 100%"
        };

        return (
            <div className={`relative flex flex-col items-center ${statusColor[status]} select-none`}>
                <FaRegCircleQuestion
                    onClick={() => setIsInfoVisible((prev) => !prev)}
                    size={15}
                    className="absolute top-0 right-2 text-blue-500 cursor-pointer"
                />
                <AnimatePresence>
                    {isInfoVisible && (
                        <motion.div
                            className="bg-teal-400 rounded-md min-w-32 absolute top-6 -right-10  ml-0 p-1"
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="text-white text-xs whitespace-pre-line">{description[status]}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <i className={`bi ${icon[status]} text-[24px]`}></i>
                <span className="font-semibold">
                    {status === "critical"
                        ? "Infuse Critical"
                        : status === "warning"
                        ? "Infuse Warning"
                        : "Infuse OK"}
                </span>
            </div>
        );
    };

    let status: "critical" | "warning" | "ok" = "ok";
    if (infuse_number < 30) status = "critical";
    else if (infuse_number < 50) status = "warning";

    return (
        <div className="flex items-center justify-between p-4 rounded-lg shadow">
            {patientName ? (
                <>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">Room: {roomNumber}</h3>
                        <p className="text-gray-500">Patient Name : {patientName}</p>
                    </div>
                    {renderInfuseStatus(status)}
                </>
            ) : (
                <>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">Room: {roomNumber}</h3>
                        <p className="text-gray-500">Patient Name : -</p>
                        <p className="text-gray-500">Infuse Number: {infuse_number}</p>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <i className="bi bi-dash-circle-fill text-[24px]"></i>
                        <span className="font-semibold">No patient in this room</span>
                    </div>
                </>
            )}
        </div>
    );
}
