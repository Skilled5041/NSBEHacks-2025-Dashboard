import { db } from "@/lib/database";
import { createIncident, createIncidentContact } from "@/lib/sqlc/incidents_sql";
import { NextResponse } from "next/server";
import { notifyEmergencyContacts } from "@/app/api/create-incident/notifyEmergencyContacts";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await createIncident(db, {
        incidentName: body.incidentName,
        victimName: body.victimName,
        incidentTime: body.incidentTime,
        gpsCoordinates: body.gpsCoordinates,
        status: body.status
    });

    if (incident === null) {
        throw new Error("Failed to create incident");
    }

    for (const contactInfo of body.emergencyContacts ?? []) {
        await createIncidentContact(db, {
            contactName: contactInfo.fullName,
            incidentId: incident?.id!,
            contactNumber: contactInfo.phoneNumber,
            contactEmail: contactInfo.email
        });
    }

    const [lat, lng] = body.gpsCoordinates.split(" ").map(parseFloat);

    await notifyEmergencyContacts(body.emergencyContacts, body.victimName, lat || 43.6594719, lng || -79.3978135);

    return NextResponse.json(incident);
}

