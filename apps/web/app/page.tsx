import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Playground } from "@/components/Playground";
import { CITIES } from "@/lib/cities";
import { faqLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Know Your DIGIPIN — Official 10-character India Post Grid Converter",
  alternates: { canonical: SITE.url },
};

export default function HomePage() {
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", ...faqLd() }} />
      <section className="hero">
        <div>
          <p className="kicker">Know your DIGIPIN</p>
          <h1>Every 4-metre cell in India has a 10-character address.</h1>
          <p className="lede">
            Convert GPS coordinates to the India Post DIGIPIN — and back — using the published
            IIT Hyderabad algorithm. Official wire format is a continuous code. Hyphens are not
            standard.
          </p>
          <div className="actions">
            <Link className="btn" href="/know-your-digipin">
              Find my DIGIPIN
            </Link>
            <Link className="btn ghost" href="/how-digipin-works">
              How the grid works
            </Link>
          </div>
          <div className="meta-grid">
            <div className="meta">
              <b>~3.8 m</b>
              <span>Final cell size</span>
            </div>
            <div className="meta">
              <b>10 chars</b>
              <span>No 0, 1, I, O</span>
            </div>
            <div className="meta">
              <b>Offline math</b>
              <span>Not a people database</span>
            </div>
          </div>
        </div>
        <div className="card compare">
          <p className="kicker">Format that indexes</p>
          <h3>Official vs unofficial</h3>
          <p>
            Many converters still print hyphenated codes such as <code>4P3-JK8-52C9</code>. India
            Post forbids hyphens. We emit <code>{CITIES.find((c) => c.slug === "bengaluru")?.digipin}</code>{" "}
            and the 3-4-3 display{" "}
            <code>{CITIES.find((c) => c.slug === "bengaluru")?.digipinDisplay}</code> — the form
            APIs and databases should store.
          </p>
          <p>
            <Link href="/format">Read the representation rules →</Link>
          </p>
        </div>
      </section>

      <section className="section" id="converter">
        <p className="kicker">Live encoder</p>
        <h2>Latitude / longitude to DIGIPIN</h2>
        <p className="note">
          Click the map. Defaults to New Delhi if location is blocked. Covers the official box
          2.5–38.5°N, 63.5–99.5°E.
        </p>
        <Playground />
      </section>

      <section className="section">
        <p className="kicker">City DIGIPINs</p>
        <h2>Jump to a city cell</h2>
        <div className="chips">
          {CITIES.map((city) => (
            <Link key={city.slug} className="chip" href={`/cities/${city.slug}`}>
              {city.name} · {city.digipin}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="kicker">Why teams use this</p>
        <div className="grid-3">
          <Link href="/use-cases/logistics" className="card" style={{ textDecoration: "none" }}>
            <h3>Logistics</h3>
            <p>Doorstep cells where street names fail. Encode stops, decode for the rider map.</p>
          </Link>
          <Link href="/use-cases/emergency" className="card" style={{ textDecoration: "none" }}>
            <h3>Emergency</h3>
            <p>Speak a 10-character code over a bad line. Recipients decode to a cell centre.</p>
          </Link>
          <Link href="/use-cases/rural" className="card" style={{ textDecoration: "none" }}>
            <h3>Rural & unaddressed</h3>
            <p>Forests, farms, and water still sit on the grid. PIN codes do not.</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <p className="kicker">Developers</p>
        <h2>API when you need scale. Engine when you need offline.</h2>
        <div className="grid-2">
          <div className="card">
            <pre>{`POST /v1/spatial/encode
X-API-Key: dp_live_…

{ "latitude": 13.11179621, "longitude": 80.20264269 }

→ { "digipin": "4T396F42L7",
    "digipinDisplay": "4T3 96F4 2L7" }`}</pre>
          </div>
          <div>
            <p>
              Free tier 60 requests/minute. Commercial 5,000. Keys are hashed. Spatial compute
              never touches disk.
            </p>
            <div className="actions">
              <Link className="btn" href="/dashboard">
                Create a key
              </Link>
              <Link className="btn ghost" href="/docs/api-v1-specification">
                API specification
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="kicker">FAQ</p>
        <h2>Questions people actually search</h2>
        <FaqList />
        <p>
          <Link href="/faq">Full FAQ →</Link>
        </p>
      </section>
    </main>
  );
}
