import { useEffect } from "react";
import {
  CATEGORIES,
  LANGUAGES,
  STATUS_META,
  UI,
  type Answer,
  type LangCode,
} from "@/lib/lifelink-data";
import { useLifeLink, type Answers } from "@/lib/lifelink-store";
import { Timeline } from "./Timeline";

const QUESTIONS: { key: keyof Answers; field: keyof typeof UI.en }[] = [
  { key: "conscious", field: "conscious" },
  { key: "breathing", field: "breathing" },
  { key: "bleeding", field: "bleeding" },
  { key: "injuries", field: "injuries" },
];

const ANSWER_KEYS: Answer[] = ["yes", "no", "unknown"];

export function EmergencyMode() {
  const ll = useLifeLink();
  const { data, hospitals, listening } = ll;
  const t = UI[data.language];

  useEffect(() => {
    if (!ll.emergencyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ll.closeEmergency();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ll]);

  if (!ll.emergencyOpen) return null;

  const selected = hospitals.find((h) => h.id === data.hospitalId);

  return (
    <div className="ll-overlay" role="dialog" aria-modal="true" aria-label="Emergency mode">
      <div className="ll-sheet">
        <header className="ll-sheet-top">
          <div>
            <span className="ll-badge">EMERGENCY MODE</span>
            <h2>
              {data.mode === "bystander" ? "Bystander report" : "Your emergency"} · {data.tempId}
            </h2>
          </div>
          <div className="ll-sheet-actions">
            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>
              Hospital Command
            </button>
            <button
              type="button"
              className="ll-close"
              aria-label="Close emergency mode"
              onClick={ll.closeEmergency}
            >
              ×
            </button>
          </div>
        </header>

        <div className="ll-grid">
          {/* ---------- Conversation column ---------- */}
          <div className="ll-col">
            <section className="ll-card">
              <h3>Language</h3>
              <div className="ll-chips">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`ll-chip${data.language === l.code ? " on" : ""}`}
                    onClick={() => ll.setLanguage(l.code as LangCode)}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </section>

            <section className="ll-card">
              <h3>Who is reporting?</h3>
              <div className="ll-chips">
                <button
                  type="button"
                  className={`ll-chip${data.mode === "self" ? " on" : ""}`}
                  onClick={() => ll.setMode("self")}
                >
                  Patient / family
                </button>
                <button
                  type="button"
                  className={`ll-chip${data.mode === "bystander" ? " on" : ""}`}
                  onClick={() => ll.setMode("bystander")}
                >
                  Bystander · unknown patient
                </button>
              </div>
              {data.mode === "bystander" && (
                <p className="ll-note">
                  Temporary case ID <strong>{data.tempId}</strong> created. No personal identity
                  needed — the hospital tracks the case by this token.
                </p>
              )}
            </section>

            <section className="ll-card">
              <h3>Voice first</h3>
              <button
                type="button"
                className={`ll-mic${listening ? " on" : ""}`}
                onClick={ll.startListening}
              >
                <span className="ll-mic-icon" aria-hidden="true">
                  🎙️
                </span>
                <span>{listening ? t.listening : t.talk}</span>
                <span className="ll-wave" aria-hidden="true">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />
                  ))}
                </span>
              </button>
              <div className="ll-chat">
                <p className="ll-bubble ll-bot">
                  Tell me what happened. You can speak in your language.
                </p>
                {data.transcript.map((line, i) => (
                  <p key={i} className="ll-bubble ll-me">
                    {line}
                  </p>
                ))}
                {data.transcript.length > 0 && !listening && (
                  <p className="ll-bubble ll-bot">
                    Understood. I filled the case form on the right — please confirm the quick
                    questions below.
                  </p>
                )}
              </div>
            </section>

            <section className="ll-card">
              <h3>Quick answers</h3>
              {QUESTIONS.map((q) => (
                <div key={q.key} className="ll-q">
                  <p>{t[q.field]}</p>
                  <div className="ll-q-btns">
                    {ANSWER_KEYS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={`ll-ans${data.answers[q.key] === a ? " on" : ""}`}
                        onClick={() => ll.setAnswer(q.key, a)}
                      >
                        {a === "yes" ? t.yes : a === "no" ? t.no : t.unknown}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="ll-card">
              <h3>{t.category}</h3>
              <div className="ll-cats">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`ll-cat${data.category === c.id ? " on" : ""}`}
                    onClick={() => ll.setCategory(c.id)}
                  >
                    <span aria-hidden="true">{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* ---------- Live form + hospitals column ---------- */}
          <div className="ll-col">
            <section className="ll-card ll-form">
              <h3>Live case form</h3>
              <dl>
                <div>
                  <dt>Case ID</dt>
                  <dd>{data.tempId}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{LANGUAGES.find((l) => l.code === data.language)?.native}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{CATEGORIES.find((c) => c.id === data.category)?.label ?? "—"}</dd>
                </div>
                <div>
                  <dt>Conscious</dt>
                  <dd>{data.answers.conscious ?? "—"}</dd>
                </div>
                <div>
                  <dt>Breathing</dt>
                  <dd>{data.answers.breathing ?? "—"}</dd>
                </div>
                <div>
                  <dt>Heavy bleeding</dt>
                  <dd>{data.answers.bleeding ?? "—"}</dd>
                </div>
                <div>
                  <dt>Visible injuries</dt>
                  <dd>{data.answers.injuries ?? "—"}</dd>
                </div>
                <div className="ll-wide">
                  <dt>Description</dt>
                  <dd>{data.transcript.join(" ") || "—"}</dd>
                </div>
                <div className="ll-wide">
                  <dt>Location</dt>
                  <dd>{data.location ?? "Not shared yet"}</dd>
                </div>
              </dl>
              <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.detectLocation}>
                📍 Detect my location
              </button>
              <p className="ll-note">
                Location is used only to find nearby participating hospitals and is shared with the
                hospital you request. Nothing is posted publicly.
              </p>
            </section>

            <section className="ll-card">
              <h3>{t.hospitals}</h3>
              <div className="ll-hospitals">
                {hospitals.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`ll-hosp${data.hospitalId === h.id ? " on" : ""}`}
                    onClick={() => ll.selectHospital(h.id)}
                    disabled={h.status === "unable"}
                  >
                    <span className="ll-hosp-top">
                      <strong>{h.name}</strong>
                      <span className={`ll-status ll-status-${h.status}`}>
                        {STATUS_META[h.status].dot} {STATUS_META[h.status].label}
                      </span>
                    </span>
                    <span className="ll-hosp-meta">
                      {h.distanceKm} km · ETA {h.etaMin} min
                    </span>
                    <span className="ll-caps">
                      {h.capabilities.map((c) => (
                        <em key={c}>{c}</em>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="sx-btn sx-btn-red"
                disabled={!selected || data.decision === "pending"}
                onClick={ll.requestReception}
              >
                {data.decision === "pending" ? "Waiting for hospital…" : `${t.request} →`}
              </button>
            </section>

            <section className="ll-card">
              <h3>Live coordination</h3>
              <Timeline />
            </section>

            <p className="ll-disclaimer">
              If someone is in immediate danger, contact local emergency services and seek emergency
              medical care immediately. LIFE-LINK helps coordinate information and does not replace
              emergency medical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
