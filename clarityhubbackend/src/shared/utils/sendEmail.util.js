import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../../config/env.config.js";

export const sendEmail = async ({ email, subject, message }) => {
  if (env.NODE_ENV === "test") {
    return { mocked: true };
  }

  const { API_KEY: apiKey, SENDER_EMAIL: senderEmail, SENDER_NAME: senderName } = env.BREVO;

  if (!apiKey || !senderEmail || !senderName) {
    throw new Error(
      "Brevo email is not configured. Set BREVO_API_KEY, BREVO_SENDER_EMAIL, and BREVO_SENDER_NAME."
    );
  }

  const brevo = new BrevoClient({ apiKey });
  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender: { email: senderEmail, name: senderName },
    to: [{ email }],
    subject,
    htmlContent: message,
  });

  console.log(`Email sent successfully to ${email}`);
  return result;
};
