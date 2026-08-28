import Script from "next/script";
import { GA_MEASUREMENT_ID, isGaId } from "@/lib/analytics";

export function Analytics() {
  const id = GA_MEASUREMENT_ID.trim();
  if (!isGaId(id)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,cookie_flags:'SameSite=None;Secure'});`}
      </Script>
    </>
  );
}
