"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { decodeAction, encodeAction } from "@/app/actions";
import { trackEvent } from "@/lib/analytics";
import { NEW_DELHI } from "@/lib/site";
import { MapView } from "./MapView";

type Mode = "encode" | "decode";

type Props = {
  initialMode?: Mode;
  initialLatitude?: string;
  initialLongitude?: string;
  initialDigipin?: string;
  autoRun?: boolean;
};

export function Playground({
  initialMode = "encode",
  initialLatitude,
  initialLongitude,
  initialDigipin = "",
  autoRun = true,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [latitude, setLatitude] = useState(initialLatitude ?? String(NEW_DELHI.latitude));
  const [longitude, setLongitude] = useState(initialLongitude ?? String(NEW_DELHI.longitude));
  const [digipin, setDigipin] = useState(initialDigipin);
  const [display, setDisplay] = useState("");
  const [bounds, setBounds] = useState<string>("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [pending, start] = useTransition();

  const coords = useMemo(
    () => ({
      latitude: Number(latitude) || NEW_DELHI.latitude,
      longitude: Number(longitude) || NEW_DELHI.longitude,
    }),
    [latitude, longitude],
  );

  const runEncode = useCallback((lat: number, lon: number) => {
    setError("");
    setWarning("");
    start(async () => {
      const result = await encodeAction(lat, lon);
      if (!result.ok || result.kind !== "encode") {
        setError(result.ok ? "Unexpected response." : result.error);
        return;
      }
      setDigipin(result.digipin);
      setDisplay(result.digipinDisplay);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("lat", String(lat));
        url.searchParams.set("lon", String(lon));
        url.searchParams.delete("digipin");
        window.history.replaceState(null, "", url);
      }
    });
  }, []);

  const onMove = useCallback((lat: number, lon: number) => {
    setLatitude(lat.toFixed(8));
    setLongitude(lon.toFixed(8));
    setError("");
    if (autoRun) runEncode(lat, lon);
  }, [autoRun, runEncode]);

  useEffect(() => {
    if (!autoRun) return;
    if (initialMode === "decode" && initialDigipin) {
      start(async () => {
        const result = await decodeAction(initialDigipin);
        if (!result.ok || result.kind !== "decode") return;
        setLatitude(String(result.latitude));
        setLongitude(String(result.longitude));
        setBounds(
          `${result.bounds.minLat.toFixed(6)}–${result.bounds.maxLat.toFixed(6)} N, ${result.bounds.minLon.toFixed(6)}–${result.bounds.maxLon.toFixed(6)} E`,
        );
        setWarning(result.warning ?? "");
        setDisplay(`${result.latitude}, ${result.longitude}`);
      });
      return;
    }
    runEncode(coords.latitude, coords.longitude);
    // initial only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation is not available in this browser.");
      return;
    }
    trackEvent("use_geolocation");
    navigator.geolocation.getCurrentPosition(
      (pos) => onMove(pos.coords.latitude, pos.coords.longitude),
      () => setError("Location permission denied. Showing New Delhi."),
    );
  }

  function submit() {
    setError("");
    setWarning("");
    start(async () => {
      if (mode === "encode") {
        trackEvent("encode_digipin", { source: "form" });
        runEncode(Number(latitude), Number(longitude));
      } else {
        const result = await decodeAction(digipin);
        if (!result.ok || result.kind !== "decode") {
          setError(result.ok ? "Unexpected response." : result.error);
          return;
        }
        setLatitude(String(result.latitude));
        setLongitude(String(result.longitude));
        setDisplay(`${result.latitude}, ${result.longitude}`);
        setBounds(
          `${result.bounds.minLat.toFixed(6)}–${result.bounds.maxLat.toFixed(6)} N, ${result.bounds.minLon.toFixed(6)}–${result.bounds.maxLon.toFixed(6)} E`,
        );
        setWarning(result.warning ?? "");
        trackEvent("decode_digipin", { success: true });
      }
    });
  }

  async function copy(text: string, label: string) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }

  const maps = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  const osm = `https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}#map=18/${coords.latitude}/${coords.longitude}`;

  return (
    <div className="grid-2">
      <div className="card stack">
        <div className="tabs">
          <button className={mode === "encode" ? "active" : ""} onClick={() => { setMode("encode"); setError(""); }}>
            Coordinates → DIGIPIN
          </button>
          <button className={mode === "decode" ? "active" : ""} onClick={() => { setMode("decode"); setError(""); }}>
            DIGIPIN → Coordinates
          </button>
        </div>

        {mode === "encode" ? (
          <div className="row">
            <div>
              <label htmlFor="lat">Latitude</label>
              <input id="lat" value={latitude} onChange={(e) => setLatitude(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="lon">Longitude</label>
              <input id="lon" value={longitude} onChange={(e) => setLongitude(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="pin">DIGIPIN</label>
            <input
              id="pin"
              value={digipin}
              onChange={(e) => setDigipin(e.target.value.toUpperCase())}
              placeholder="4T396F42L7 or 4T3 96F4 2L7"
            />
          </div>
        )}

        <div className="actions">
          <button className="btn" onClick={submit} disabled={pending}>
            {pending ? "Computing…" : mode === "encode" ? "Get DIGIPIN" : "Decode"}
          </button>
          <button className="btn ghost" type="button" onClick={locate}>
            Use my location
          </button>
        </div>

        {error ? <p className="err">{error}</p> : null}
        {warning ? <p className="warn">{warning}</p> : null}

        {digipin ? (
          <div className="result">
            <p className="note">Official wire format · 10 characters, no hyphens</p>
            <p className="pin">{digipin}</p>
            <p className="note">Display format · 3-4-3 spaces</p>
            <p className="pin">{display || `${digipin.slice(0, 3)} ${digipin.slice(3, 7)} ${digipin.slice(7)}`}</p>
            {bounds ? <p className="note">Cell bounds · {bounds}</p> : null}
            <div className="actions">
              <button className="btn ghost" type="button" onClick={() => void copy(digipin, "wire")}>
                {copied === "wire" ? "Copied" : "Copy code"}
              </button>
              <button className="btn ghost" type="button" onClick={() => void copy(`${coords.latitude},${coords.longitude}`, "ll")}>
                {copied === "ll" ? "Copied" : "Copy lat/long"}
              </button>
              <a className="btn ghost" href={maps} target="_blank" rel="noreferrer">
                Google Maps
              </a>
              <a className="btn ghost" href={osm} target="_blank" rel="noreferrer">
                OpenStreetMap
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div>
        <MapView latitude={coords.latitude} longitude={coords.longitude} onMove={onMove} />
        <p className="note" style={{ marginTop: 8 }}>
          Click or drag the marker. The code updates to the official India Post cell for that point.
        </p>
      </div>
    </div>
  );
}
