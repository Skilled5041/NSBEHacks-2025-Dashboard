import { db } from "@/lib/database";
import { resolveIncident } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await resolveIncident(db, {
        id: body.id,
        incidentEndTime: body.incidentEndTime,
    });

    return Response.json(incident);
}