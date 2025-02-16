import { db } from "@/lib/database";
import { createAnalysis } from "@/lib/sqlc/incidents_sql";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const analysis = await createAnalysis(db, {
        sentiment: body.sentiment,
        threatLevel: body.threatLevel,
        situationSummary: body.situationSummary,
        actionRecommendation: body.actionRecommendations,
        detectedSounds: body.detectedSounds,
        incidentId: body.incidentId
    });

    return NextResponse.json(analysis);
}