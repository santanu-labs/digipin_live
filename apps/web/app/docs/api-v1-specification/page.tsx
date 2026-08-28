import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "API v1 specification",
  description: "REST contract for the DIGIPIN Live encode, decode, and authentication APIs.",
};

export default function ApiSpecPage() {
  return (
    <main className="section">
      <p className="kicker">Implementation specifications</p>
      <h1>API v1 specification</h1>
      <p className="lede">
        Base URL: <code>{SITE.apiUrl}</code>. Spatial routes require <code>X-API-Key</code>.
        Auth routes are cookie-session and origin-locked.
      </p>

      <div className="card stack">
        <h2>Encode</h2>
        <pre>{`POST /v1/spatial/encode
Content-Type: application/json
X-API-Key: dp_live_…

{
  "latitude": 13.11179621,
  "longitude": 80.20264269
}

200
{
  "digipin": "4T396F42L7",
  "digipinDisplay": "4T3 96F4 2L7"
}`}</pre>

        <h2>Decode</h2>
        <pre>{`POST /v1/spatial/decode
{
  "digipin": "4P3JK852C9"
}

200
{
  "latitude": 12.971601,
  "longitude": 77.594584,
  "bounds": { "minLat": …, "maxLat": …, "minLon": …, "maxLon": … }
}`}</pre>

        <h2>Errors</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Code</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>400</td>
              <td>latitude_out_of_range / longitude_out_of_range</td>
              <td>Outside 2.5–38.5 / 63.5–99.5</td>
            </tr>
            <tr>
              <td>400</td>
              <td>hyphens_not_permitted</td>
              <td>Hyphenated DIGIPIN input</td>
            </tr>
            <tr>
              <td>401</td>
              <td>missing_api_key / invalid_api_key</td>
              <td>No or unknown X-API-Key</td>
            </tr>
            <tr>
              <td>429</td>
              <td>rate_limited</td>
              <td>Free 60/min or commercial 5,000/min</td>
            </tr>
          </tbody>
        </table>
        <p className="note">
          Full operator documentation lives in the repository <code>/doc</code> folder, including
          OpenAPI 3.1.
        </p>
      </div>
    </main>
  );
}
