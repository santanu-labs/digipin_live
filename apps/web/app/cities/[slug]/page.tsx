import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Playground } from "@/components/Playground";
import { CITIES, cityBySlug } from "@/lib/cities";
import { breadcrumbLd, SITE } from "@/lib/site";

export function generateStaticParams() {
  return CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = cityBySlug(slug);
  if (!city) return {};
  return {
    title: `${city.name} DIGIPIN — ${city.digipinDisplay}`,
    description: `DIGIPIN for ${city.name}, ${city.state}: ${city.digipin}. Landmark ${city.landmark}. Convert any nearby lat/long with the official India Post grid.`,
    alternates: { canonical: `${SITE.url}/cities/${city.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityBySlug(slug);
  if (!city) notFound();

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbLd([
          { name: "Cities", href: "/#converter" },
          { name: city.name, href: `/cities/${city.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: city.name,
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.latitude,
            longitude: city.longitude,
          },
        }}
      />
      <Breadcrumbs items={[{ name: city.name }]} />
      <p className="kicker">{city.state}</p>
      <h1>{city.name} DIGIPIN</h1>
      <p className="lede">
        A reference cell near {city.landmark}: wire <code>{city.digipin}</code>, display{" "}
        <code>{city.digipinDisplay}</code> at {city.latitude}, {city.longitude}. Move the pin for
        any other point in the official India box.
      </p>
      <Playground
        initialLatitude={String(city.latitude)}
        initialLongitude={String(city.longitude)}
      />
    </main>
  );
}
