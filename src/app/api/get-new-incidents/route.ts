import { db } from "@/lib/database";
import { getNewIncidents } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incidents = await getNewIncidents(db, {
        incidentTime: body.lastPollTime
    });

    return {
        status: 200,
        body: {
            incidents
        }
    };
}