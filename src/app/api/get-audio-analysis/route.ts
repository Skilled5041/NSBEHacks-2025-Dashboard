import { db } from "@/lib/database";
import { getAudioAnalysis } from "@/lib/sqlc/incidents_sql";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const id = (request.nextUrl.searchParams.get("id") || "");
    const analysis = await getAudioAnalysis(db, {
        incidentId: id
    });

    return Response.json(analysis);
}