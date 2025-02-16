"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GetNewIncidentsRow } from "@/lib/sqlc/incidents_sql";

export default function IncidentsTable() {
    let [incidents, setIncidents] = useState<GetNewIncidentsRow[]>([]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "resolved":
                return "bg-green-500";
            case "ongoing":
                return "bg-yellow-500";
            case "investigating":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    // ISO8601 and time
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0] + " " + date.toISOString().split("T")[1].split(".")[0];
    };

    const [lastPollTime, setLastPollTime] = useState(incidents?.[incidents.length - 1]?.incidentTime ?? new Date());
    useEffect(() => {
        const getIncidents = async () => {
            const response = await fetch("/api/get-new-incidents?lastPollTime=" + new Date(0));
            const newIncidents = await response.json();
            newIncidents.map((incident: GetNewIncidentsRow) => {
                incident.incidentTime = new Date(incident.incidentTime);
            });
            setIncidents(newIncidents);
        };
        getIncidents();

        const intervalId = setInterval(async () => {
            const response = await fetch(`/api/get-new-incidents?lastPollTime=${lastPollTime}`);
            const newIncidents = await response.json();
            if (newIncidents.length > 0) {
                newIncidents.map((incident: GetNewIncidentsRow) => {
                    incident.incidentTime = new Date(incident.incidentTime);
                });
                setIncidents(newIncidents);
            }
            setLastPollTime(newIncidents[newIncidents.length - 1]?.incidentTime ?? lastPollTime);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Incident Name</TableHead>
                    <TableHead>Victim Name</TableHead>
                    <TableHead>GPS Coordinates</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {incidents?.sort((a, b) => b.incidentTime.getTime() - a.incidentTime.getTime()).map((incident) => (
                    <TableRow key={incident.id}>
                        <TableCell>
                            <Link className="text-blue-500" href={"/incident?id=" + incident.id}>{incident.id}</Link>
                        </TableCell>
                        <TableCell>{incident.incidentName}</TableCell>
                        <TableCell>{incident.victimName}</TableCell>
                        <TableCell>{incident.gpsCoordinates}</TableCell>
                        <TableCell>{formatDate(incident.incidentTime)}</TableCell>
                        <TableCell>
                            <Badge className={`${getStatusColor(incident.status)}`}>{incident.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

