import { encodeDigipin } from "@digipin/engine";

const RAW = [
  { slug: "new-delhi", name: "New Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.209, landmark: "India Gate / Central Secretariat" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", latitude: 19.076, longitude: 72.8777, landmark: "CST / Fort" },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", latitude: 12.9716, longitude: 77.5946, landmark: "Vidhana Soudha" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, landmark: "Marina / Fort St. George" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639, landmark: "Howrah / Esplanade" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", latitude: 17.385, longitude: 78.4867, landmark: "Charminar" },
  { slug: "pune", name: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567, landmark: "Shaniwar Wada" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", latitude: 23.0225, longitude: 72.5714, landmark: "Sabarmati / Old City" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873, landmark: "Hawa Mahal" },
  { slug: "kochi", name: "Kochi", state: "Kerala", latitude: 9.9312, longitude: 76.2673, landmark: "Fort Kochi" },
  { slug: "guwahati", name: "Guwahati", state: "Assam", latitude: 26.1445, longitude: 91.7362, landmark: "Brahmaputra riverfront" },
  { slug: "srinagar", name: "Srinagar", state: "Jammu and Kashmir", latitude: 34.0837, longitude: 74.7973, landmark: "Dal Lake" },
] as const;

export const CITIES = RAW.map((city) => {
  const encoded = encodeDigipin(city.latitude, city.longitude);
  return { ...city, ...encoded };
});

export function cityBySlug(slug: string) {
  return CITIES.find((city) => city.slug === slug);
}
