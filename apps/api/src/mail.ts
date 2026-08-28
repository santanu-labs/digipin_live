import { Resend } from "resend";
import { env } from "./env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export async function sendMagicLink(email: string, url: string) {
  const subject = "Your DIGIPIN Live sign-in link";
  const html = `
    <p>Sign in to your DIGIPIN Live dashboard.</p>
    <p><a href="${url}">Open dashboard</a></p>
    <p>This link expires in 15 minutes and can be used once.</p>
    <p>If you did not request this, ignore the email.</p>
  `;

  if (!resend) {
    console.log(`[mail:dev] ${email} → ${url}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: env.mailFrom,
    to: email,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send magic-link email: ${error.message}`);
  }
}
