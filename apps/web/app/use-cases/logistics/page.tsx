import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN for logistics — last-metre delivery cells",
  description:
    "Use DIGIPIN to encode delivery stops where street names fail. API encode on intake, decode on the rider device.",
  alternates: { canonical: `${SITE.url}/use-cases/logistics` },
};

export default function LogisticsPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "Logistics" }]} />
      <h1>DIGIPIN for logistics</h1>
      <p>
        Store a continuous 10-character DIGIPIN on the shipment, not a hyphenated display string.
        Riders open the cell centre on a map. Failed deliveries drop when the pin is a 4-metre
        cell instead of a neighbourhood PIN.
      </p>
      <p>
        <Link href="/docs/api-v1-specification">Integrate the encode API →</Link>
      </p>
    </main>
  );
}
