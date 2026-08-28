import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <Link className="brand" href="/">
        DIGIPIN Live <small>India grid</small>
      </Link>
      <nav className="nav-links">
        <Link href="/know-your-digipin">Know yours</Link>
        <Link href="/how-digipin-works">How it works</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/docs/api-v1-specification">API</Link>
        <Link className="btn" href="/dashboard">
          Get API key
        </Link>
      </nav>
    </header>
  );
}
