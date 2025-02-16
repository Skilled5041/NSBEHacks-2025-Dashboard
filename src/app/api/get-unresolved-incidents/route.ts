import { db } from "@/lib/database";
import { getAllUnresolvedIncidents } from "@/lib/sqlc/incidents_sql";

export async function GET() {
    const incidents = await getAllUnresolvedIncidents(db);

    return Response.json(incidents);
}