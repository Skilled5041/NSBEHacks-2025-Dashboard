import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/database";
import { addIncidentAudio } from "@/lib/sqlc/incidents_sql";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const incidentId = formData.get("incidentId") as string;

    if (!audioFile || !incidentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = audioFile.name.split(".").pop();
    const fileName = `${createId()}.${fileExtension}`;
    const filePath = `incident-audio/${fileName}`;

    // Upload to Supabase Storage using REST API
    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/public/incidents/${filePath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": audioFile.type,
        },
        body: await audioFile.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: "Failed to upload audio file" },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/incidents/${filePath}`;

    // Save to database using sqlc
    const audio = await addIncidentAudio(db, {
      incidentId,
      audioUrl: publicUrl,
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
