import nodemailer from "nodemailer";
import pug from "pug";
import config from "./Config.js";
import log from "./Logger.js";

export async function sendEmail(receiverEmail, emailContent) {
  const { host, port, secure, email, password } = config.emailLoginData;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: email,
      pass: password,
    },
  });
  log.info("Initializing email transporter...")

  const { subject, body } = emailContent;
  const emailResponse = await transporter.sendMail({
    from: email,
    to: receiverEmail,
    subject,
    html: body,
  });
  log.info("Email sent.")
}

export function getEmailContentSuccess(formattedCoupons) {
  const subject = `✅ ezforu2: ${formattedCoupons.length} VONS For U Coupons Clipped Successfully!`;
  const htmlBody = pug.renderFile("./EmailTemplate.pug", {
    coupons: formattedCoupons,
  });

  return { subject, body: htmlBody };
}
export function getEmailContentFailure(errorMessage) {
  const subject = "❌ ezforu2: VONS For U Coupons Failed to Clip.";
  const body = `Failed to clip coupons. Error: ${errorMessage}`;
  return { subject, body };
}
