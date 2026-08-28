import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function TermsPage() {
  return (
    <main className="section prose">
      <h1>Terms</h1>
      <p>
        digipin.live provides a converter and API as-is. A DIGIPIN is not a legal address, title,
        or delivery guarantee. Do not present this site as an official India Post service.
      </p>
    </main>
  );
}
