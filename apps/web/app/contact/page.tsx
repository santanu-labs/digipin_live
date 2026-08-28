import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact DIGIPIN Live",
  description:
    "Contact the DIGIPIN Live project for API access, commercial rate limits, press, and corrections.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function ContactPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "Contact" }]} />
      <p className="kicker">Contact</p>
      <h1>Talk to the project</h1>
      <p>
        DIGIPIN Live is an independent service. For API questions, commercial limits,
        partnerships, or a correction on this site, use the project inbox.
      </p>
      <div className="card stack">
        <div>
          <label>Email</label>
          <p>
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
        </div>
        <div>
          <label>API</label>
          <p>
            Live base <code>{SITE.apiUrl}</code>. Keys are issued from the{" "}
            <a href="/dashboard">dashboard</a>.
          </p>
        </div>
      </div>
      <p className="note">
        This is not an India Post helpdesk. Official DIGIPIN materials:
        {" "}
        <a href="https://indiapost.gov.in/digipin">indiapost.gov.in/digipin</a>.
      </p>
    </main>
  );
}
