import { db } from "@/lib/database";
import { getAllIncidents, getNewIncidents } from "@/lib/sqlc/incidents_sql";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const incidents = await getAllIncidents(db);
    return Response.json(incidents ?? []);
}