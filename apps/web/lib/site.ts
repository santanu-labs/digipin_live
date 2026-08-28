import { FAQS } from "./faq";

export const SITE = {
  name: "DIGIPIN Live",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digipin.live",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  description:
    "Know your DIGIPIN. Convert latitude and longitude to the official 10-character India Post grid code — no hyphens — with a free map tool and a developer API.",
};

export const NEW_DELHI = { latitude: 28.6139, longitude: 77.209 };

export function organizationLd() {
  return {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/know-your-digipin?digipin={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqLd() {
  return {
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function jsonLdGraph(extra: Record<string, unknown>[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationLd(), websiteLd(), ...extra],
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE.url}${item.href}`,
    })),
  };
}
