import { db } from "@/lib/database";
import { createIncident } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await createIncident(db, {
        incidentName: body.incidentName,
        victimName: body.victimName,
        incidentTime: body.incidentTime,
        gpsCoordinates: body.gpsCoordinates,
        status: body.status
    });

    return Response.json(incident);
}