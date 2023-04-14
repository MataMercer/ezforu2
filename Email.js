import nodemailer from "nodemailer";
import pug from "pug";
import config from "./config.json" assert { type: "json" };

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

  const { subject, body } = emailContent;
  const emailResponse = await transporter.sendMail({
    from: email,
    to: receiverEmail,
    subject,
    html: body,
  });
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

// console.log(
//   getEmailContentSuccess([
//     {
//       name: "test",
//       image:
//         "https://www.safeway.com/CMS/j4u/offers/images/265c7c70-c04f-4672-b1b6-5300bff91486.gif",
//       description: "description blah blah",
//       offerPrice: "1.00",
//     },
//   ])
// );
