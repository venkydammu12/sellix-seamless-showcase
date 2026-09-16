import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

const NAV_LINKS = ["Products", "Pricing", "Developers", "Resources", "Contact Sales"];

const TITLE = "Sellix — Cross-border finance";
const DESCRIPTION =
  "Sellix moves money across borders for modern businesses: one account, local rails in 40+ markets, and settlement that clears in hours, not days.";

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
    scripts: [
      {
        children:
          "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('anim')}}catch(e){}",
      },
    ],
  }),
  component: Index,
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

function Index() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        void back.play();
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
    void a.play();
    return () => {
      a.removeEventListener("timeupdate", onTime);
      b.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // Entrance sequence: run once fonts are ready, then clean up.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("anim")) return;
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      root.classList.remove("anim", "run");
    };
    const start = () => {
      root.classList.add("run");
      const last = document.querySelector<HTMLElement>(".sx-cta");
      last?.addEventListener("animationend", cleanup, { once: true });
      window.setTimeout(cleanup, 3000);
    };
    if (document.fonts?.ready) {
      void document.fonts.ready.then(start);
    } else {
      start();
    }
    return cleanup;
  }, []);

  return (
    <main className="sellix">
      <div className="sellix-bg">
        <video id="bgVideoA" ref={aRef} src={VIDEO_SRC} poster={POSTER} autoPlay muted loop playsInline />
        <video id="bgVideoB" ref={bRef} src={VIDEO_SRC} poster={POSTER} muted loop playsInline />
      </div>
      <div className="sellix-scrim" />

      <div className="sellix-shell">
        <nav className="sx-nav">
          <span className="sx-logo">Sellix</span>
          <div className="sx-links">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </div>
          <div className="sx-nav-actions">
            <a className="sx-btn sx-btn-ghost" href="#">
              Login
            </a>
            <a className="sx-btn sx-btn-white" href="#">
              Get Started <ArrowIcon />
            </a>
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
          <h1>
            <span className="ln">
              <span className="ln-i">Cross-border</span>
            </span>
            <span className="ln">
              <span className="ln-i">finance</span>
            </span>
          </h1>
          <p className="sx-sub">
            One account for every market you sell into.
            <br />
            Collect, convert and pay out on local rails in 40+ countries.
            <br />
            Settlement in hours — with mid-market rates and no hidden spread.
          </p>
          <div className="sx-cta">
            <a className="sx-btn sx-btn-white" href="#">
              Get Started <ArrowIcon />
            </a>
            <a className="sx-btn sx-btn-ghost" href="#">
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      <div className={`sx-drawer${menuOpen ? " open" : ""}`}>
        <div className="sx-drawer-top">
          <span className="sx-logo">Sellix</span>
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
            <a key={l} href="#" onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
        </div>
        <div className="sx-drawer-actions">
          <a className="sx-btn sx-btn-white" href="#">
            Get Started <ArrowIcon />
          </a>
          <a className="sx-btn sx-btn-ghost" href="#">
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
