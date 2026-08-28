import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={item.name}>
          <span aria-hidden> / </span>
          {item.href ? <Link href={item.href}>{item.name}</Link> : <span>{item.name}</span>}
        </span>
      ))}
    </nav>
  );
}
