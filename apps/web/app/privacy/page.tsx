import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main className="section prose">
      <h1>Privacy</h1>
      <p>
        A DIGIPIN is a function of latitude and longitude. The encode/decode engine stores no
        personal data. Accounts created on digipin.live store an email address, hashed magic-link
        tokens, and hashed API keys so you can manage access.
      </p>
      <p>
        Magic-link emails are sent through Resend. Session cookies are httpOnly and used only for
        the dashboard. API request counts are kept in Redis for rate limiting and expire
        automatically.
      </p>
      <h2>Analytics</h2>
      <p>
        When Google Analytics 4 is configured on this site, the browser may load scripts from
        Google to measure page views, approximate geography, device type, and events such as
        encode/decode on the converter. IP addresses are requested with anonymization enabled.
        You can block this with a browser content blocker. The dashboard at{" "}
        <code>/dashboard</code> is excluded from search indexing.
      </p>
      <p>
        Operator contact: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </main>
  );
}
