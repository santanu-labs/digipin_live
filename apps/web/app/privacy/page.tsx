import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main className="section">
      <h1>Privacy</h1>
      <p>
        A DIGIPIN is a function of latitude and longitude. The encode/decode engine stores no
        personal data. Accounts created on digipin.live store an email address, hashed magic-link
        tokens, and hashed API keys so you can manage access.
      </p>
      <p>
        Magic-link emails are sent through the configured SMTP provider. Session cookies are
        httpOnly and used only for the dashboard. API request counts are kept in Redis for rate
        limiting and expire automatically.
      </p>
    </main>
  );
}
