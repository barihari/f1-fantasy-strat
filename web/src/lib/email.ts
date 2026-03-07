import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendSMS(message: string): Promise<void> {
  const phoneNumber = process.env.PHONE_NUMBER;
  const gateway = process.env.CARRIER_GATEWAY || "vtext.com";
  const to = `${phoneNumber}@${gateway}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.GMAIL_ADDRESS,
    to,
    subject: "",
    text: message,
  });
}
