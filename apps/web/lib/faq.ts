export const FAQS = [
  {
    q: "What is DIGIPIN?",
    a: "DIGIPIN (Digital Postal Index Number) is India Post’s open-source national addressing grid, built with IIT Hyderabad and NRSC, ISRO. It encodes a latitude and longitude into a unique 10-character code for an approximately 4 m × 4 m cell. It is math, not a database of people or buildings.",
  },
  {
    q: "How do I find my DIGIPIN?",
    a: "Open Know Your DIGIPIN, allow location, or drop a pin on the map. The encoder runs the official India Post algorithm and returns a continuous 10-character code plus the 3-4-3 display grouping.",
  },
  {
    q: "Are hyphens allowed in a DIGIPIN?",
    a: "No. The Department of Posts forbids hyphens and other punctuation on the wire. The approved digital form is a continuous 10-character string such as C4P8K63M4M. For display, spaces in a 3-4-3 pattern (C4P 8K63 M4M) are acceptable. Sites that print ABC-DEF-GHIJ are using an unofficial format.",
  },
  {
    q: "How is DIGIPIN different from a PIN code?",
    a: "A 6-digit PIN code covers a whole delivery area. A 10-character DIGIPIN identifies one ~4 m cell. DIGIPIN does not replace your postal address; it is an extra geospatial layer.",
  },
  {
    q: "Does DIGIPIN work only in India?",
    a: "The official algorithm is defined on latitude 2.5–38.5 and longitude 63.5–99.5. That box covers India and nearby maritime areas. Coordinates outside it are out of spec. Unofficial “World DIGIPIN” 12-character schemes are not the India Post standard.",
  },
  {
    q: "Does decode return my exact GPS point?",
    a: "No. Decode returns the centre of the final grid cell, plus the cell bounds. Two nearby GPS readings can share one DIGIPIN.",
  },
  {
    q: "Is my personal data stored in a DIGIPIN?",
    a: "No. A DIGIPIN contains only location. Floor, name, phone, and address text are not part of the code. digipin.live stores an email only if you create API keys.",
  },
  {
    q: "Do I need the internet or an account to convert?",
    a: "The website converter runs the algorithm on our server in a few milliseconds and does not require an account. A DIGIPIN can also be computed fully offline using the open-source engine. Map tiles still need a network.",
  },
  {
    q: "Can two flats in one building have different DIGIPINs?",
    a: "Only if they sit in different ~4 m cells. Floor number does not change the code. DIGIPIN is not a resident ID.",
  },
  {
    q: "Is digipin.live the official India Post website?",
    a: "No. We implement the published Apache 2.0 algorithm. The official government pages and GitHub live under India Post. We do not use government logos or government inboxes.",
  },
] as const;

export const PRECISION = [
  { chars: 1, size: "~1,000 km" },
  { chars: 2, size: "~250 km" },
  { chars: 3, size: "~62 km" },
  { chars: 4, size: "~16 km" },
  { chars: 5, size: "~3.9 km" },
  { chars: 6, size: "~1 km" },
  { chars: 7, size: "~240 m" },
  { chars: 8, size: "~60 m" },
  { chars: 9, size: "~15 m" },
  { chars: 10, size: "~3.8 m" },
] as const;
