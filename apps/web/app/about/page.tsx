import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About DIGIPIN Live — independent India Post grid converter and API",
  description:
    "digipin.live is an independent Address-as-a-Service platform implementing the open-source DIGIPIN algorithm. Not affiliated with India Post.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "About" }]} />
      <p className="kicker">About</p>
      <h1>An independent DIGIPIN engine, not a government portal</h1>
      <p>
        We host a converter, city explainers, and a rate-limited API for the Digital Postal Index
        Number. The math is the Apache 2.0 algorithm published by the Department of Posts with
        IIT Hyderabad and NRSC, ISRO.
      </p>
      <div className="card compare">
        <strong>Not affiliated.</strong> We do not use India Post logos, and we do not ask you
        to email government inboxes. Official materials live on{" "}
        <a href="https://indiapost.gov.in/digipin">indiapost.gov.in/digipin</a> and{" "}
        <a href="https://github.com/INDIAPOST-gov/digipin">github.com/INDIAPOST-gov/digipin</a>.
      </div>
      <h2>What we add</h2>
      <ul>
        <li>Official wire format (no hyphens) and 3-4-3 display.</li>
        <li>Cell bounds, map share links, and city landing pages.</li>
        <li>A documented API with hashed keys and published rate limits.</li>
        <li>Operator documentation in the repository <code>/doc</code> folder.</li>
      </ul>
      <p>
        <Link href="/know-your-digipin">Know your DIGIPIN →</Link>
      </p>
    </main>
  );
}
