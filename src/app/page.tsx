"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

const checks = [
  { label: "Permissions", detail: "What access does it need?", icon: "01" },
  { label: "Developer", detail: "Who is behind the app?", icon: "02" },
  { label: "Website", detail: "Does the domain check out?", icon: "03" },
];

export default function Home() {
  const [appUrl, setAppUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(appUrl.trim().length > 0);
  }

  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="AppTrust home">
          <span className="brand-mark">+</span>
          AppTrust
        </Link>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
        <span className="status-pill"><span /> Privacy first</span>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> App intelligence for humans</p>
          <h1 id="hero-title">Know what<br /><em>you&apos;re</em> installing.</h1>
          <p className="hero-intro">
            AppTrust turns confusing permissions and developer details into a clear answer before you tap install.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <label htmlFor="app-url">Start with an app</label>
            <div className="search-row">
              <input
                id="app-url"
                type="url"
                placeholder="Paste a Play Store or App Store link"
                value={appUrl}
                onChange={(event) => {
                  setAppUrl(event.target.value);
                  setSubmitted(false);
                }}
                required
              />
              <button type="submit">Check app <span aria-hidden="true">↗</span></button>
            </div>
            <p className="form-note" aria-live="polite" role="status">
              {submitted ? "We'll have a report ready when the lookup service is connected." : "No account needed · Free to check"}
            </p>
          </form>
        </div>

        <div className="hero-art" aria-label="A sample AppTrust report showing a good trust signal" role="img">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="report-card">
            <div className="report-topline"><span>APP REPORT / 001</span><span>● LIVE CHECK</span></div>
            <div className="app-heading">
              <div className="app-icon">N</div>
              <div><p>Netflix</p><small>Netflix, Inc. · Entertainment</small></div>
            </div>
            <div className="score-row">
              <div className="score-ring"><strong>86</strong><span>/100</span></div>
              <div><p className="score-label">Trust score</p><p className="score-good">Looks good <span>↗</span></p></div>
            </div>
            <div className="report-divider" />
            <div className="report-facts">
              <div><span>Permissions</span><strong>Low concern</strong></div>
              <div><span>Website</span><strong>Verified</strong></div>
              <div><span>Domain age</span><strong>28 years</strong></div>
            </div>
          </div>
          <p className="art-caption">A clearer picture,<br />before the download.</p>
        </div>
      </section>

      <section className="signal-strip" id="how-it-works" aria-label="AppTrust checks">
        <p className="strip-label">Every report looks at</p>
        <div className="check-list">
          {checks.map((check) => (
            <div className="check-item" key={check.label}>
              <span className="check-number">{check.icon}</span>
              <div><strong>{check.label}</strong><span>{check.detail}</span></div>
            </div>
          ))}
        </div>
        <div className="strip-arrow" aria-hidden="true">↓</div>
      </section>

      <section className="footer-note" id="about">
        <span>APPTRUST / 2026</span>
        <p>Less guesswork. Better installs.</p>
        <span>Built for curious people</span>
      </section>
    </main>
  );
}
