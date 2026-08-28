"use client";

import { useState } from "react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="nav">
      <Link className="brand" href="/" onClick={close}>
        DIGIPIN Live <small>India grid</small>
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="site-nav" className={`nav-links${open ? " open" : ""}`}>
        <Link href="/know-your-digipin" onClick={close}>
          Know yours
        </Link>
        <Link href="/how-digipin-works" onClick={close}>
          How it works
        </Link>
        <Link href="/faq" onClick={close}>
          FAQ
        </Link>
        <Link href="/docs/api-v1-specification" onClick={close}>
          API
        </Link>
        <Link href="/contact" onClick={close}>
          Contact
        </Link>
        <Link className="btn" href="/dashboard" onClick={close}>
          Get API key
        </Link>
      </nav>
    </header>
  );
}
