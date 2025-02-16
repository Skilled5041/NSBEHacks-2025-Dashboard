import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllIncidents } from "@/lib/sqlc/incidents_sql";
import { db } from "@/lib/database";
import Link from "next/link";

export default async function IncidentsTable() {
    const incidents = await getAllIncidents(db);

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
                {incidents.sort((a, b) => b.incidentTime.getTime() - a.incidentTime.getTime()).map((incident) => (
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

