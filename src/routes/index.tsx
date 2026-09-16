import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EmergencyMode } from "@/components/lifelink/EmergencyMode";
import { HospitalCommand } from "@/components/lifelink/HospitalCommand";
import { Sections } from "@/components/lifelink/Sections";
import { LifeLinkProvider, useLifeLink } from "@/lib/lifelink-store";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Emergency", href: "#voice" },
  { label: "How It Works", href: "#how" },
  { label: "Hospitals", href: "#hospitals" },
  { label: "For Hospitals", href: "#for-hospitals" },
  { label: "About", href: "#about" },
];

const TITLE = "LIFE-LINK — The hospital knows before you arrive";
const DESCRIPTION =
  "LIFE-LINK helps patients, families, bystanders and emergency teams share critical information with participating hospitals before arrival — using voice, simple questions and their own language.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: POSTER },
      { name: "twitter:image", content: POSTER },
    ],
  }),
  component: IndexPage,
});

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8h9M8.5 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PulseMark = () => (
  <span className="ll-mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12h4l2-5 3 10 3-7 2 2h6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

function IndexPage() {
  return (
    <LifeLinkProvider>
      <Index />
    </LifeLinkProvider>
  );
}

function Index() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animClass, setAnimClass] = useState("anim");
  const ll = useLifeLink();

  // Seamless loop: cross-fade between the two stacked videos at the loop point.
  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      a.removeAttribute("loop");
      a.pause();
      a.currentTime = 0;
      return;
    }

    const FADE = 0.9;
    let front = a;
    let back = b;
    let swapping = false;

    const onTime = () => {
      const d = front.duration;
      if (!Number.isFinite(d)) return;
      if (!swapping && d - front.currentTime <= FADE) {
        swapping = true;
        back.currentTime = 0;
        void back.play().catch(() => {});
        back.style.opacity = "1";
        front.style.opacity = "0";
        window.setTimeout(() => {
          front.pause();
          const prev = front;
          front = back;
          back = prev;
          swapping = false;
        }, FADE * 1000);
      }
    };

    a.addEventListener("timeupdate", onTime);
    b.addEventListener("timeupdate", onTime);
    void a.play().catch(() => {});
    return () => {
      a.removeEventListener("timeupdate", onTime);
      b.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // Entrance sequence: run once fonts are ready, then clean up.
  useEffect(() => {
    let done = false;
    let timer = 0;
    const cleanup = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      setAnimClass("");
    };
    const start = () => {
      if (done) return;
      setAnimClass("anim run");
      const last = document.querySelector<HTMLElement>(".sx-cta");
      last?.addEventListener("animationend", cleanup, { once: true });
      timer = window.setTimeout(cleanup, 3000);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanup();
    } else if (document.fonts?.ready) {
      void document.fonts.ready.then(start);
    } else {
      start();
    }
    return cleanup;
  }, []);

  return (
    <main className={`sellix ${animClass}`.trim()}>
      <div className="sellix-bg">
        <video id="bgVideoA" ref={aRef} src={VIDEO_SRC} poster={POSTER} autoPlay muted loop playsInline />
        <video id="bgVideoB" ref={bRef} src={VIDEO_SRC} poster={POSTER} muted loop playsInline />
      </div>
      <div className="sellix-scrim" />

      <div className="sellix-shell">
        <nav className="sx-nav">
          <span className="sx-logo">
            <PulseMark />
            LIFE-LINK
          </span>
          <div className="sx-links">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="sx-nav-actions">
            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>
              Hospital Login
            </button>
            <button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>
              🚨 Start Emergency <ArrowIcon />
            </button>
          </div>
          <button
            className="sx-burger"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </nav>

        <div className="sx-hero">
          <span className="ll-eyebrow">EMERGENCY RESPONSE, REIMAGINED</span>
          <h1>
            <span className="ln">
              <span className="ln-i">The hospital</span>
            </span>
            <span className="ln">
              <span className="ln-i">knows before you arrive.</span>
            </span>
          </h1>
          <p className="sx-sub">
            LIFE-LINK helps patients, families, bystanders and emergency teams share critical
            information with participating hospitals before arrival — using voice, simple questions
            and the language they understand.
          </p>
          <div className="sx-cta">
            <button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>
              🚨 Start Emergency <ArrowIcon />
            </button>
            <a className="sx-btn sx-btn-ghost" href="#how">
              See How It Works <ArrowIcon />
            </a>

            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.runQuickDemo}>
              ⚡ Quick Demo
            </button>
          </div>
          <p className="ll-safety">
            If someone is in immediate danger, contact local emergency services and seek emergency
            medical care immediately. LIFE-LINK helps coordinate information and does not replace
            emergency medical care.
          </p>
        </div>
      </div>

      <Sections />

      <div className={`sx-drawer${menuOpen ? " open" : ""}`}>
        <div className="sx-drawer-top">
          <span className="sx-logo">
            <PulseMark />
            LIFE-LINK
          </span>
          <button
            className="sx-drawer-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="sx-drawer-links">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="sx-drawer-actions">
          <button
            type="button"
            className="sx-btn sx-btn-red"
            onClick={() => {
              setMenuOpen(false);
              ll.openEmergency();
            }}
          >
            🚨 Start Emergency <ArrowIcon />
          </button>
          <button
            type="button"
            className="sx-btn sx-btn-ghost"
            onClick={() => {
              setMenuOpen(false);
              ll.openDashboard();
            }}
          >
            Hospital Login
          </button>
        </div>
      </div>

      <EmergencyMode />
      <HospitalCommand />
    </main>
  );
}
