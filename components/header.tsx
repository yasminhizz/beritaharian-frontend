"use client";

import Link from "next/link";
import { useState } from "react";
import "./header.css";

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <header className="site-header">
      <div className="logo-wrap">
        <Link href="/" className="logo">
          BeritaHarian
        </Link>
        <p className="tagline">NEWS, ENTERTAINMENT & LIFESTYLE</p>
      </div>

      <div className="nav-bar">
        <nav className="main-nav">
          <Link href="/category/hiburan">Hiburan</Link>
          <Link href="/category/teknologi">Teknologi</Link>
          <Link href="/category/bisnes">Bisnes</Link>
          <Link href="/category/gayahidup">Gaya Hidup</Link>
        </nav>

        <div className="search-area">
          {openSearch && (
            <form action="/search" className="search-box">
              <input
                type="text"
                name="q"
                placeholder="Search..."
                autoFocus
              />
            </form>
          )}

          <button
            type="button"
            className="search-icon"
            onClick={() => setOpenSearch(!openSearch)}
            aria-label="Open search"
          >
            ⌕
          </button>
        </div>
      </div>
    </header>
  );
}