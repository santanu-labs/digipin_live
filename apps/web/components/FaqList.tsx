import { FAQS } from "@/lib/faq";

export function FaqList() {
  return (
    <div className="faq">
      {FAQS.map((item) => (
        <details key={item.q} className="card">
          <summary>
            <h3>{item.q}</h3>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
