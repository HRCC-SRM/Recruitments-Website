import nodemailer from "nodemailer";

export async function sendEmail({ toEmail, toName, subject, html, text, fromName, fromEmail }) {
  // Check which email service to use
  const useMailtrap = process.env.USE_MAILTRAP === "true";
  const useGmail = process.env.USE_GMAIL === "true";
  
  let transporter;
  
  if (useMailtrap) {
    // Mailtrap SMTP configuration
    const mailtrapUser = process.env.MAILTRAP_USER || "smtp@mailtrap.io";
    const mailtrapPass = process.env.MAILTRAP_PASS;
    
    if (!mailtrapPass) {
      throw new Error("Mailtrap credentials not configured. Set MAILTRAP_PASS (your API token)");
    }
    
    transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailtrapUser,
        pass: mailtrapPass
      }
    });
  } else if (useGmail) {
    // Gmail SMTP configuration
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    
    if (!gmailUser || !gmailPass) {
      throw new Error("Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD");
    }
    
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
  } else {
    // Brevo SMTP configuration (default)
    const smtpKey = process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY;
    if (!smtpKey) {
      throw new Error("Missing BREVO_SMTP_KEY or BREVO_API_KEY in environment");
    }

    transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpKey, // This should be in format: username@smtp-brevo.com
        pass: process.env.BREVO_SMTP_PASSWORD || smtpKey  // Use separate password if available
      }
    });
  }

  const resolvedFromEmail = fromEmail || process.env.BREVO_FROM_EMAIL || "no-reply@yourdomain.com";
  const resolvedFromName = fromName || process.env.BREVO_FROM_NAME || "HRCC Recruitments";

  const mailOptions = {
    from: `"${resolvedFromName}" <${resolvedFromEmail}>`,
    to: `"${toName}" <${toEmail}>`,
    subject: subject,
    text: text,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("SMTP Error:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export default { sendEmail };
