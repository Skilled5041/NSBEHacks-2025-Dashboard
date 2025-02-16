import { getAllIncidentById, getIncidentLocations } from "@/lib/sqlc/incidents_sql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/database";
import { IncidentMap } from "@/components/incident-map";
import { StatusForm } from "@/components/status-form";

export async function IncidentInfo(props: { incidentId: string }) {
    // ISO8601 and time
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0] + " " + date.toISOString().split("T")[1].split(".")[0];
    };

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

    const incident = await getAllIncidentById(db, {
        id: props.incidentId
    });

    if (!incident) {
        return <div>Incident not found</div>;
    }

    const [lat, lng] = incident.gpsCoordinates.split(" ").map(parseFloat);

    const locations = await getIncidentLocations(db, {
        incidentId: props.incidentId
    });

    return <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>{incident.incidentName}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="font-semibold">Victim Name</dt>
                        <dd>{incident.victimName}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Time</dt>
                        <dd>{formatDate(incident.incidentTime)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">GPS Coordinates</dt>
                        <dd>{incident.gpsCoordinates}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Status</dt>
                        <StatusForm statusColor={getStatusColor(incident.status)} incident={incident}/>
                    </div>
                </dl>
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p>{incident.incidentName}</p>
                </div>
            </CardContent>
        </Card>
        <IncidentMap lat={lat} lng={lng} incident={incident} locations={locations}/>
    </div>;
}