import { db } from "@/lib/database";
import { updateIncidentStatus } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await updateIncidentStatus(db, {
        id: body.incidentId,
        status: body.status
    });

    return Response.json(incident);
}