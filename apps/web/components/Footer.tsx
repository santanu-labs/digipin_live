import Link from "next/link";
import { CITIES } from "@/lib/cities";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <strong>DIGIPIN Live</strong>
          <p>
            Independent converter and API for the India Post DIGIPIN grid. Not an official
            government service.
          </p>
        </div>
        <div>
          <b>Convert</b>
          <Link href="/know-your-digipin">Know your DIGIPIN</Link>
          <Link href="/tools/lat-long-to-digipin">Lat/long → DIGIPIN</Link>
          <Link href="/tools/digipin-to-lat-long">DIGIPIN → lat/long</Link>
          <Link href="/format">Official format</Link>
          <Link href="/cities">All cities</Link>
        </div>
        <div>
          <b>Learn</b>
          <Link href="/how-digipin-works">How DIGIPIN works</Link>
          <Link href="/digipin-vs-pincode">DIGIPIN vs PIN code</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <b>Cities</b>
          {CITIES.slice(0, 6).map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`}>
              {city.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-bar">
        <span>
          Algorithm: Department of Posts, IIT Hyderabad, NRSC/ISRO · Apache 2.0
        </span>
        <span>
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/terms">Terms</Link>
          {" · "}
          <Link href="/docs/api-v1-specification">API spec</Link>
        </span>
      </div>
    </footer>
  );
}
