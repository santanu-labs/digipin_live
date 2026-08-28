import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN vs PIN code — neighbourhood vs 4-metre cell",
  description:
    "A 6-digit PIN code covers a delivery area. A 10-character DIGIPIN identifies a ~4 m grid cell. They complement each other; DIGIPIN does not replace PIN.",
  alternates: { canonical: `${SITE.url}/digipin-vs-pincode` },
};

export default function ComparePage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "DIGIPIN vs PIN code" }]} />
      <p className="kicker">Compare</p>
      <h1>DIGIPIN vs PIN code</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>PIN code</th>
            <th>DIGIPIN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Length</td>
            <td>6 digits</td>
            <td>10 alphanumeric</td>
          </tr>
          <tr>
            <td>What it names</td>
            <td>A delivery office / locality</td>
            <td>A ~4 m × 4 m cell</td>
          </tr>
          <tr>
            <td>Changes with streets?</td>
            <td>Yes, operationally</td>
            <td>No — only coordinates</td>
          </tr>
          <tr>
            <td>Works without a house number?</td>
            <td>Poorly</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Stores personal data?</td>
            <td>No</td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <p>
        Use both. PIN for routing a bag of mail. DIGIPIN for the last four metres.{" "}
        <Link href="/know-your-digipin">Generate a DIGIPIN</Link>.
      </p>
    </main>
  );
}
