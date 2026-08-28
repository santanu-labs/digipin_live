import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN format — no hyphens, 3-4-3 display, official alphabet",
  description:
    "India Post representation rules: continuous 10-character DIGIPIN for APIs, optional 3-4-3 spaces for display, hyphens forbidden.",
  alternates: { canonical: `${SITE.url}/format` },
};

export default function FormatPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "Official format" }]} />
      <p className="kicker">Representation</p>
      <h1>The official DIGIPIN format</h1>
      <p>
        Consumer sites often show <code>ABC-DEF-GHIJ</code>. That is not the current Department
        of Posts rule. For storage, APIs, and QR payloads use ten characters and nothing else.
      </p>
      <table>
        <thead>
          <tr>
            <th>Form</th>
            <th>Example</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wire / API / database</td>
            <td>
              <code>C4P8K63M4M</code>
            </td>
            <td>Required</td>
          </tr>
          <tr>
            <td>Display (3-4-3 spaces)</td>
            <td>
              <code>C4P 8K63 M4M</code>
            </td>
            <td>Acceptable</td>
          </tr>
          <tr>
            <td>Hyphenated</td>
            <td>
              <code>C4P-8K63-M4M</code>
            </td>
            <td>Not permitted</td>
          </tr>
        </tbody>
      </table>
      <p>
        This site’s converter will still decode a hyphenated paste and show the official form,
        with a warning. The API rejects hyphens so integrations stay interoperable.
      </p>
    </main>
  );
}
