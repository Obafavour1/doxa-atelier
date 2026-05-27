// import nodeMailer from "nodemailer";
// import { env } from "../../config/env.config.js";

// export const sendEmail = async ({ email, subject, message }) => {
//   const transporter = nodeMailer.createTransport({
//     host: env.SMTP.HOST,
//     service: env.SMTP.SERVICE,
//     port: env.SMTP.PORT,
//     auth: {
//       user: env.SMTP.MAIL,
//       pass: env.SMTP.PASSWORD,
//     },
//   });

//   const options = {
//     from: env.SMTP.MAIL,
//     to: email,
//     subject,
//     html: message,
//   };

//   await transporter.sendMail(options);
//   console.log(`Email sent successfully to ${email}`);
// };


// import nodeMailer from "nodemailer";
import axios from "axios";
import { env } from "../../config/env.config.js";

export const sendEmail = async ({ email, subject, message }) => {
  if (env.NODE_ENV === "test") {
    return { mocked: true };
  }

  if (!env.SMTP.API_KEY || !env.SMTP.SENDER) {
    console.warn("[Brevo API] Missing SMTP credentials. Skipping email send in non-production.");
    return { skipped: true };
  }

  try {
    console.log(`[Brevo API Debug] Sending email to ${email}...`);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Clarity Store",
          email: env.SMTP.SENDER, // must be verified in Brevo
        },
        to: [
          {
            email: email,
          },
        ],
        subject: subject,
        htmlContent: message,
      },
      {
        headers: {
          "api-key": env.SMTP.API_KEY, // ✅ use API key (xkeysib-)
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      `[Brevo API Success] Email sent successfully! Message ID: ${response.data.messageId}`
    );

    return response.data;
  } catch (error) {
    console.error("[Brevo API Error] Failed to send email.");

    if (error.response) {
      console.error("[Brevo API Error Details]:", error.response.data);
    } else {
      console.error("[Brevo API Error Details]:", error.message);
    }

    throw error;
  }
};
