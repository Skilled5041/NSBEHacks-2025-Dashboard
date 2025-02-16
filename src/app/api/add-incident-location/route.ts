import { db } from "@/lib/database";
import { addIncidentLocation } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await addIncidentLocation(db, {
        incidentId: body.incidentId,
        gpsCoordinates: body.gpsCoordinates,
        locationTime: new Date(body.locationTimestamp)
    });

    return Response.json(incident);
}