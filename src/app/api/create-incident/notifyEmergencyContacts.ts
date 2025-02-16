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