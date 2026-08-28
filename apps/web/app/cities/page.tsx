import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CITIES } from "@/lib/cities";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN by city — Delhi, Mumbai, Bengaluru, Chennai and more",
  description:
    "Reference DIGIPIN cells for major Indian cities with official 10-character codes and a live map encoder.",
  alternates: { canonical: `${SITE.url}/cities` },
};

export default function CitiesIndexPage() {
  return (
    <main className="section">
      <Breadcrumbs items={[{ name: "Cities" }]} />
      <h1>DIGIPIN by city</h1>
      <p className="lede">
        Each page pins a well-known landmark and shows the official wire code. Move the marker
        for any other point in that city.
      </p>
      <div className="grid-3">
        {CITIES.map((city) => (
          <Link key={city.slug} href={`/cities/${city.slug}`} className="card" style={{ textDecoration: "none" }}>
            <h3>{city.name}</h3>
            <p className="note">{city.state} · {city.landmark}</p>
            <p className="pin">{city.digipinDisplay}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
