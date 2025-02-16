import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { addIncidentAudio } from "@/lib/sqlc/incidents_sql";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { incidentId, audioUrl } = data;
    // Save to database using sqlc
    const audio = await addIncidentAudio(db, {
      incidentId,
      audioUrl,
      audioTimestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      audio,
    });

  } catch (error) {
    console.error("Error uploading audio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
