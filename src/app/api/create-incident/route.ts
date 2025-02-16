import { db } from "@/lib/database";
import { createIncident, createIncidentContact } from "@/lib/sqlc/incidents_sql";
import { NextResponse } from "next/server";

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

    for (const contactInfo of body.emergencyContacts) {
        await createIncidentContact(db, {
            contactName: contactInfo.fullName,
            incidentId: incident?.id!,
            contactNumber: contactInfo.phoneNumber,
            contactEmail: contactInfo.email
        });
    }

    return NextResponse.json(incident);
}