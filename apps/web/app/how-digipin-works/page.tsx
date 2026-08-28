import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PRECISION } from "@/lib/faq";
import { breadcrumbLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How DIGIPIN works — 4×4 grid, 10 levels, India bounding box",
  description:
    "The India Post DIGIPIN algorithm: 16-symbol alphabet, hierarchical 4×4 splits, official bounds, and why decode returns a cell centre.",
  alternates: { canonical: `${SITE.url}/how-digipin-works` },
};

export default function HowPage() {
  return (
    <main className="section prose">
      <JsonLd data={breadcrumbLd([{ name: "How DIGIPIN works", href: "/how-digipin-works" }])} />
      <Breadcrumbs items={[{ name: "How DIGIPIN works" }]} />
      <p className="kicker">Algorithm</p>
      <h1>How DIGIPIN labelling works</h1>
      <p>
        DIGIPIN is a function of latitude and longitude. Start with a 36° × 36° box over India
        (2.5–38.5°N, 63.5–99.5°E). Split that box into a 4×4. Pick the cell that contains the
        point. Append one symbol. Repeat ten times. The tenth symbol isolates a cell about 3.8 m
        on a side.
      </p>
      <h2>The symbol grid (north at the top)</h2>
      <pre>{`F C 9 8
J 3 2 7
K 4 5 6
L M P T`}</pre>
      <p>
        Look-alikes 0, 1, I, and O are omitted so a code can be read over a phone. The alphabet
        is 2 3 4 5 6 7 8 9 C J K L M P F T.
      </p>
      <h2>Precision by prefix</h2>
      <table>
        <thead>
          <tr>
            <th>Characters</th>
            <th>Approx. cell</th>
          </tr>
        </thead>
        <tbody>
          {PRECISION.map((row) => (
            <tr key={row.chars}>
              <td>{row.chars}</td>
              <td>{row.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>What decode actually returns</h2>
      <p>
        After ten symbols you have a small box. The API and this site return the{" "}
        <strong>centre</strong> of that box, plus the bounds. That is why a GPS reading and its
        DIGIPIN do not round-trip to the identical decimals.
      </p>
      <h2>Worked example</h2>
      <p>
        Official fixture: 13.11179621, 80.20264269 (Chennai) encodes to{" "}
        <code>4T396F42L7</code>. Display: <code>4T3 96F4 2L7</code>.{" "}
        <code>4P3JK852C9</code> decodes to 12.971601, 77.594584.
      </p>
    </main>
  );
}
