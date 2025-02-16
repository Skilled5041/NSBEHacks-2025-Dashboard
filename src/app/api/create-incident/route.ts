import { db } from "@/lib/database";
import { createIncident, createIncidentContact } from "@/lib/sqlc/incidents_sql";
import { NextResponse } from "next/server";
import NodeMailer from "nodemailer";

const transporter = NodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

const sendEmergencyEmail = async (
    contactEmails: string[],
    victimName: string,
    location: string,
    incidentTime: string
) => {
    const emailHTML = `
    <h2>⚠ Emergency Alert from Guardian AIngel</h2>
    <p>Hello,</p>
    <p>This is an automated emergency alert. ${victimName} has reported an incident and needs assistance.</p>
    <h3>Incident Details:</h3>
    <ul>
      <li>Time: ${incidentTime}</li>
      <li>Location: ${location}</li>
    </ul>
    <p>Emergency services have been notified. Please attempt to contact ${victimName} immediately.</p>
    <p>This is an automated message. Please do not reply.</p>
  `;

    const mailOptions = {
        from: "\"Guardian AIngel\" <alerts@eurekahacks.ca>",
        to: contactEmails.join(", "),
        subject: `🚨 Emergency Alert: ${victimName} Needs Assistance`,
        html: emailHTML,
    };

    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
        console.log(`Emergency email sent`);
    } catch (error) {
        console.error(`Failed to send emergency email`, error);
        throw error;
    }
};

export const notifyEmergencyContacts = async (
    contacts: Array<{ fullName: string; email: string | null }>,
    victimName: string,
    latitude: number,
    longitude: number
) => {
    const location = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const incidentTime = new Date().toLocaleString();

    const emailPromises = contacts
        .filter(contact => contact.email) // Only send to contacts with emails
        .map(contact =>
            sendEmergencyEmail(
                contacts.map(c => c.email ?? ""),
                victimName,
                location,
                incidentTime
            )
        );

    try {
        await Promise.all(emailPromises);
        console.log("All emergency contacts notified");
    } catch (error) {
        console.error("Error notifying some emergency contacts:", error);
        // Continue execution even if some emails fail
    }
};

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

    await notifyEmergencyContacts(body.emergencyContacts, body.victimName, body.latitude, body.longitude);

    return NextResponse.json(incident);
}

