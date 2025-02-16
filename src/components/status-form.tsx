"use client";

import { GetAllIncidentByIdRow } from "@/lib/sqlc/incidents_sql";
import { SetStateAction, useState } from "react";

export function StatusForm(props: { statusColor: string, incident: GetAllIncidentByIdRow }) {
    const statusOptions = [
        { value: "resolved", label: "Resolved" },
        { value: "pending", label: "Pending" },
        { value: "ongoing", label: "Ongoing" }
    ];

    const getBgColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "resolved":
                return "bg-green-500";
            case "ongoing":
                return "bg-yellow-500";
            case "pending":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const [currentStatus, setCurrentStatus] = useState(props.incident.status);

    const handleChange = async (e: { target: { value: SetStateAction<string>; }; }) => {
        setCurrentStatus(e.target.value);
        await fetch("/api/update-incident-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                incidentId: props.incident.id,
                status: e.target.value
            })
        });
    };

    return (
        <form>
            <div>
                <select className={"pl-4 py-2 text-white rounded-full font-medium " + getBgColor(currentStatus)}
                        id="status" name="status"
                        defaultValue={props.incident.status}
                        onChange={handleChange}>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
}