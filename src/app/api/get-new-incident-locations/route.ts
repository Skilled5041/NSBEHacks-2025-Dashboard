import { db } from "@/lib/database";
import { getNewIncidentLocations } from "@/lib/sqlc/incidents_sql";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const lastPollTime = new Date(request.nextUrl.searchParams.get("lastPollTime") || new Date().toISOString());
    const incidents = await getNewIncidentLocations(db, {
        locationTime: lastPollTime
    });

    return Response.json(incidents);
}