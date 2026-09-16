import { useEffect } from "react";
import { CATEGORIES, LANGUAGES, STATUS_META, type ReceivingStatus } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

const STATUSES: ReceivingStatus[] = ["accepting", "limited", "unable"];

const ACTIVE_CASES = [
  { id: "LL-771204", cat: "Cardiac / Chest Pain", eta: "3 min", state: "Preparing cath lab" },
  { id: "LL-663018", cat: "Fall / Head Injury", eta: "Arrived", state: "In CT" },
];

export function HospitalCommand() {
  const ll = useLifeLink();
  const { data, hospitals } = ll;
  const self = hospitals.find((h) => h.id === (data.hospitalId ?? "alpha")) ?? hospitals[0]!;
  const incoming = data.decision === "pending" || data.decision === "review";

  useEffect(() => {
    if (!ll.dashboardOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ll.closeDashboard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ll]);

  if (!ll.dashboardOpen) return null;

  return (
    <div className="ll-overlay" role="dialog" aria-modal="true" aria-label="Hospital command">
      <div className="ll-sheet">
        <header className="ll-sheet-top">
          <div>
            <span className="ll-badge ll-badge-blue">HOSPITAL COMMAND</span>
            <h2>{self.name}</h2>
          </div>
          <div className="ll-sheet-actions">
            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openEmergency}>
              Patient view
            </button>
            <button
              type="button"
              className="ll-close"
              aria-label="Close hospital command"
              onClick={ll.closeDashboard}
            >
              ×
            </button>
          </div>
        </header>

        <div className="ll-grid">
          <div className="ll-col">
            <section className="ll-card">
              <h3>Incoming case</h3>
              {incoming ? (
                <div className="ll-incoming">
                  <div className="ll-incoming-top">
                    <strong>{data.tempId}</strong>
                    <span className="ll-status ll-status-accepting">🟢 NEW REQUEST</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Category</dt>
                      <dd>{CATEGORIES.find((c) => c.id === data.category)?.label ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>Reported in</dt>
                      <dd>{LANGUAGES.find((l) => l.code === data.language)?.native}</dd>
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
                      <dt>Bleeding</dt>
                      <dd>{data.answers.bleeding ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>Reporter</dt>
                      <dd>{data.mode === "bystander" ? "Bystander" : "Patient / family"}</dd>
                    </div>
                    <div className="ll-wide">
                      <dt>Location</dt>
                      <dd>{data.location ?? "Not shared"}</dd>
                    </div>
                    <div className="ll-wide">
                      <dt>Description</dt>
                      <dd>{data.transcript.join(" ") || "—"}</dd>
                    </div>
                  </dl>
                  <div className="ll-decide">
                    <button
                      type="button"
                      className="sx-btn sx-btn-green"
                      onClick={() => ll.decide("accepted")}
                    >
                      ACCEPT
                    </button>
                    <button
                      type="button"
                      className="sx-btn sx-btn-ghost"
                      onClick={() => ll.decide("review")}
                    >
                      REVIEW
                    </button>
                    <button
                      type="button"
                      className="sx-btn sx-btn-red"
                      onClick={() => ll.decide("unable")}
                    >
                      UNABLE TO RECEIVE
                    </button>
                  </div>
                </div>
              ) : (
                <p className="ll-note">
                  No pending requests. Start an emergency from the patient view or run the Quick
                  Demo to see a live request arrive here.
                </p>
              )}
            </section>

            <section className="ll-card">
              <h3>Active cases</h3>
              <div className="ll-active">
                {data.decision === "accepted" && (
                  <div className="ll-active-row">
                    <strong>{data.tempId}</strong>
                    <span>{CATEGORIES.find((c) => c.id === data.category)?.label}</span>
                    <span>
                      ETA {Math.floor(data.etaSec / 60)}:
                      {String(data.etaSec % 60).padStart(2, "0")}
                    </span>
                    <span>Accepted · team notified</span>
                  </div>
                )}
                {ACTIVE_CASES.map((c) => (
                  <div key={c.id} className="ll-active-row">
                    <strong>{c.id}</strong>
                    <span>{c.cat}</span>
                    <span>ETA {c.eta}</span>
                    <span>{c.state}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="ll-col">
            <section className="ll-card">
              <h3>Receiving status</h3>
              <div className="ll-chips">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`ll-chip${self.status === s ? " on" : ""}`}
                    onClick={() => ll.setHospitalStatus(self.id, s)}
                  >
                    {STATUS_META[s].dot} {STATUS_META[s].label}
                  </button>
                ))}
              </div>
              <p className="ll-note">
                Status is visible instantly to nearby reporters, so no one is routed to a department
                that cannot receive.
              </p>
            </section>

            <section className="ll-card">
              <h3>Department capabilities</h3>
              <div className="ll-caps ll-caps-lg">
                {["Trauma", "ICU", "Neuro", "Cardiac", "CT / Imaging", "Blood Bank"].map((c) => (
                  <em key={c}>{c}</em>
                ))}
              </div>
            </section>

            <section className="ll-card">
              <h3>All participating hospitals</h3>
              <div className="ll-hospitals">
                {hospitals.map((h) => (
                  <div key={h.id} className="ll-hosp">
                    <span className="ll-hosp-top">
                      <strong>{h.name}</strong>
                      <span className={`ll-status ll-status-${h.status}`}>
                        {STATUS_META[h.status].dot} {STATUS_META[h.status].label}
                      </span>
                    </span>
                    <span className="ll-hosp-meta">
                      {h.distanceKm} km · ETA {h.etaMin} min
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <p className="ll-disclaimer">
              Demo environment. Role-based access, audit logging and temporary case tokens are
              simulated for illustration; no real patient data is stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
