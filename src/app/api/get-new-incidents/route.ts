import { db } from "@/lib/database";
import { getNewIncidents } from "@/lib/sqlc/incidents_sql";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const lastPollTime = new Date(request.nextUrl.searchParams.get("lastPollTime") || new Date().toISOString());
    const incidents = await getNewIncidents(db, {
        incidentTime: lastPollTime
    });

    return Response.json(incidents);
}