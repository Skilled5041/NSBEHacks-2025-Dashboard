import { db } from "@/lib/database";
import { createIncident, createIncidentContact } from "@/lib/sqlc/incidents_sql";

export async function POST(request: Request) {
    const body = await request.json();
    const incident = await createIncident(db, {
        incidentName: body.incidentName,
        victimName: body.victimName,
        incidentTime: body.incidentTime,
        gpsCoordinates: body.gpsCoordinates,
        status: body.status
    });

    for (const contactInfo of body.emergencyContacts) {
        await createIncidentContact(db, {
            contactName: contactInfo.fullName,
            incidentId: body.incidentId,
            contactNumber: contactInfo.phoneNumber,
            contactEmail: contactInfo.email
        });
    }

    return Response.json(incident);
}