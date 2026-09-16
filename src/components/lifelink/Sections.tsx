import { LANGUAGES, STATUS_META } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

const STEPS = [
  {
    n: "01",
    icon: "🎙️",
    title: "Speak",
    body: "Anyone at the scene describes what happened, by voice or a few taps, in their own language.",
  },
  {
    n: "02",
    icon: "🧩",
    title: "Structure",
    body: "LIFE-LINK turns that into a clean clinical summary: category, consciousness, breathing, bleeding, injuries.",
  },
  {
    n: "03",
    icon: "🔗",
    title: "Connect",
    body: "Nearby participating hospitals are matched on live receiving status, distance and capability.",
  },
  {
    n: "04",
    icon: "🏥",
    title: "Prepare",
    body: "The hospital accepts, the team is alerted, and the room is ready before the patient arrives.",
  },
];

const PRIVACY = [
  { icon: "🔐", title: "Role-based access", body: "Patients, bystanders and hospital staff each see only what their role needs." },
  { icon: "⏳", title: "Temporary tokens", body: "Cases are addressed by short-lived tokens such as LL-842910, not by identity." },
  { icon: "🧾", title: "Audit logs", body: "Every view, accept and status change is recorded for medico-legal review." },
  { icon: "🚫", title: "No PHI in URLs", body: "Clinical details never travel in links, so nothing leaks through sharing or history." },
];

export function Sections() {
  const ll = useLifeLink();

  return (
    <div className="ll-page">
      {/* 1 — problem */}
      <section className="ll-sec" id="problem">
        <span className="ll-eyebrow">THE PROBLEM</span>
        <h2>In an emergency, information should move faster than traffic.</h2>
        <div className="ll-cols3">
          <div className="ll-panel">
            <strong>Minutes are spent explaining</strong>
            <p>
              At the door, the story is retold from scratch — what happened, when, what the patient
              can still do.
            </p>
          </div>
          <div className="ll-panel">
            <strong>Language becomes a wall</strong>
            <p>
              The person who saw everything often cannot describe it in the language the intake desk
              uses.
            </p>
          </div>
          <div className="ll-panel">
            <strong>Hospitals are surprised</strong>
            <p>
              Teams learn about a critical case when it arrives, not while it is still on the way.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — how it works */}
      <section className="ll-sec" id="how">
        <span className="ll-eyebrow">HOW LIFE-LINK WORKS</span>
        <h2>Speak → Structure → Connect → Prepare</h2>
        <div className="ll-flow">
          {STEPS.map((s) => (
            <div key={s.n} className="ll-panel ll-flow-step">
              <span className="ll-flow-n">{s.n}</span>
              <span className="ll-flow-icon" aria-hidden="true">
                {s.icon}
              </span>
              <strong>{s.title}</strong>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — voice demo */}
      <section className="ll-sec ll-sec-split" id="voice">
        <div>
          <span className="ll-eyebrow">VOICE-FIRST</span>
          <h2>You talk. The form fills itself.</h2>
          <p className="ll-lead">
            No forms to read under stress. LIFE-LINK listens, asks only what is missing, and keeps a
            live case form in sync with every answer — with one-tap YES / NO / DON'T KNOW for the
            questions that decide the room.
          </p>
          <button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>
            🚨 Try the voice flow →
          </button>
        </div>
        <div className="ll-panel ll-demo">
          <div className="ll-demo-mic">
            <span aria-hidden="true">🎙️</span>
            <span className="ll-wave" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />
              ))}
            </span>
          </div>
          <p className="ll-bubble ll-me">బైక్ మీద ఉన్న వ్యక్తి కింద పడ్డాడు, స్పందించడం లేదు.</p>
          <p className="ll-bubble ll-bot">
            Road accident · Conscious: NO · Breathing: YES · Bleeding: YES
          </p>
        </div>
      </section>

      {/* 4 — coordination & routing */}
      <section className="ll-sec" id="hospitals">
        <span className="ll-eyebrow">COORDINATION & SMART ROUTING</span>
        <h2>Routed to a hospital that can actually receive.</h2>
        <div className="ll-cols3">
          {[
            { t: "Live receiving status", b: "Accepting, limited or unable — updated by the hospital itself, visible before you leave." },
            { t: "Capability matching", b: "Trauma, ICU, Neuro, Cardiac and imaging availability weighed against the case." },
            { t: "Distance and ETA", b: "The nearest capable hospital, with an ETA both sides can plan around." },
          ].map((c) => (
            <div key={c.t} className="ll-panel">
              <strong>{c.t}</strong>
              <p>{c.b}</p>
            </div>
          ))}
        </div>
        <div className="ll-statusrow">
          {(["accepting", "limited", "unable"] as const).map((s) => (
            <span key={s} className={`ll-status ll-status-${s}`}>
              {STATUS_META[s].dot} {STATUS_META[s].label}
            </span>
          ))}
        </div>
      </section>

      {/* 5 — multilingual */}
      <section className="ll-sec" id="languages">
        <span className="ll-eyebrow">MULTILINGUAL ACCESS</span>
        <h2>The language they already speak.</h2>
        <div className="ll-langs">
          {LANGUAGES.map((l) => (
            <span key={l.code} className="ll-lang">
              <strong>{l.native}</strong>
              <em>{l.label}</em>
            </span>
          ))}
        </div>
      </section>

      {/* 6 — security */}
      <section className="ll-sec" id="privacy">
        <span className="ll-eyebrow">SECURITY & PRIVACY</span>
        <h2>Built for sensitive moments.</h2>
        <div className="ll-cols4">
          {PRIVACY.map((p) => (
            <div key={p.title} className="ll-panel">
              <span className="ll-flow-icon" aria-hidden="true">
                {p.icon}
              </span>
              <strong>{p.title}</strong>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 — hospital command preview */}
      <section className="ll-sec ll-sec-split" id="for-hospitals">
        <div>
          <span className="ll-eyebrow">HOSPITAL COMMAND</span>
          <h2>One screen for everything inbound.</h2>
          <p className="ll-lead">
            Incoming requests with a structured clinical summary, one-tap ACCEPT / REVIEW / UNABLE,
            department capability toggles and live receiving status — so the floor decides in
            seconds and the reporter sees the answer instantly.
          </p>
          <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>
            Open Hospital Command →
          </button>
        </div>
        <div className="ll-panel ll-cmdpreview">
          <div className="ll-cmd-row">
            <strong>LL-842910</strong>
            <span className="ll-status ll-status-accepting">🟢 NEW REQUEST</span>
          </div>
          <p>Road accident · Unconscious · Breathing · Heavy bleeding · 3.2 km · ETA 8 min</p>
          <div className="ll-decide">
            <span className="sx-btn sx-btn-green">ACCEPT</span>
            <span className="sx-btn sx-btn-ghost">REVIEW</span>
            <span className="sx-btn sx-btn-red">UNABLE</span>
          </div>
        </div>
      </section>

      {/* 8 — final CTA + footer */}
      <section className="ll-sec ll-final" id="about">
        <h2>The hospital should know before you arrive.</h2>
        <p className="ll-lead">
          Try the full round trip: report an emergency, transmit it to a participating hospital, and
          watch the acknowledgement come back live.
        </p>
        <div className="sx-cta">
          <button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>
            🚨 Start Emergency →
          </button>
          <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.runQuickDemo}>
            ⚡ Quick Demo →
          </button>
        </div>
      </section>

      <footer className="ll-footer">
        <div className="ll-footer-cols">
          <div>
            <span className="sx-logo">LIFE-LINK</span>
            <p>You speak. We prepare. The hospital knows before you arrive.</p>
          </div>
          <div>
            <strong>Platform</strong>
            <a href="#how">How It Works</a>
            <a href="#voice">Voice-first</a>
            <a href="#hospitals">Hospitals</a>
          </div>
          <div>
            <strong>For Hospitals</strong>
            <a href="#for-hospitals">Hospital Command</a>
            <a href="#privacy">Security & Privacy</a>
            <a href="#languages">Languages</a>
          </div>
          <div>
            <strong>Contact</strong>
            <a href="#about">About</a>
            <a href="#about">Partner with us</a>
          </div>
        </div>
        <p className="ll-legal">
          Medico-legal disclaimer: LIFE-LINK is an information-coordination tool shown here as a
          demonstration. It does not provide medical advice, triage decisions or treatment, and it
          does not replace emergency medical services or clinical judgement. In an emergency, contact
          local emergency services immediately. Hospital names, receiving statuses and cases shown
          here are fictional demo data.
        </p>
      </footer>
    </div>
  );
}
