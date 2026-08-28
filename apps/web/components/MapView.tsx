"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number;
  longitude: number;
  onMove?: (latitude: number, longitude: number) => void;
};

export function MapView({ latitude, longitude, onMove }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      const L = await import("leaflet");
      if (!el.current || cancelled) return;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) {
        const map = L.map(el.current, { zoomControl: true }).setView([latitude, longitude], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onMove?.(pos.lat, pos.lng);
        });
        map.on("click", (event) => {
          marker.setLatLng(event.latlng);
          onMove?.(event.latlng.lat, event.latlng.lng);
        });
        mapRef.current = map;
        markerRef.current = marker;
      } else {
        mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
        markerRef.current?.setLatLng([latitude, longitude]);
      }
    }

    void mount();
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, onMove]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={el} className="map" />;
}
