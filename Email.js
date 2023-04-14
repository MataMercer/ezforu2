import NodeMailer from nodemailer;
import config from "./config.json" assert { type: "json" };

async function sendEmail(receiverEmail, emailContent) {
    const {host, port, secure, email, password} = config.emailLoginData;
    const transporter = NodeMailer.createTransport({
        host,
        port,
        secure,
        auth:{
            user: email,
            pass: password
        }
    })

    const {subject, body} = emailContent;
    const emailResponse = await transporter.sendMail({
        from: email,
        to: receiverEmail,
        subject,
        html: body
    });    
}

function getEmailContentSuccess(couponCount){
    const subject = "✅ ezforu2: ForU Vons Coupons Clipped Successfully!";
    const body = `${couponCount} coupons clipped!`;
    return {subject, body};
}
function getEmailContentFailure(couponCount, errorMessage){
    const subject = "❌ ezforu2: ForU Vons Coupons Failed to Clip.";
    const body = `Failed to clip ${couponCount} coupons. Error: ${errorMessage}`;
    return {subject, body};
}