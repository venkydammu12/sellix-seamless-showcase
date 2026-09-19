import { useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, LANGUAGES, STATUS_META, getCategoryLabel, type ReceivingStatus } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

const STATUSES: ReceivingStatus[] = ["accepting", "limited", "unable"];
const ACTIVE_CASES = [
  { id: "LL-X7M2Q", category: "Cardiac or Chest Pain", eta: "3 min", state: "Cardiac team notified" },
  { id: "LL-K4P9T", category: "Fall or Head Injury", eta: "Arrived", state: "Imaging assessment" },
];

export function HospitalCommand() {
  const ll = useLifeLink();
  const { data, hospitals } = ll;
  const self = hospitals.find((hospital) => hospital.id === (data.hospitalId ?? "alpha")) ?? hospitals[0];
  const incoming = data.decision === "pending" || data.decision === "review";

  useEffect(() => {
    if (!ll.dashboardOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") ll.closeDashboard();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [ll.dashboardOpen, ll.closeDashboard]);

  if (!ll.dashboardOpen || !self) return null;

  const received = data.sentAt ? new Date(data.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not received";

  return (
    <div className="ll-overlay" role="dialog" aria-modal="true" aria-labelledby="command-title">
      <div className="ll-sheet ll-command-sheet">
        <header className="ll-sheet-top">
          <div>
            <span className="ll-badge ll-badge-blue">SIMULATED HOSPITAL · DEMO MODE</span>
            <h2 id="command-title">Hospital Command</h2>
            <p className="ll-command-sub">{self.name} · Hospital-controlled receiving state</p>
          </div>
          <div className="ll-sheet-actions">
            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openEmergency}>Patient view</button>
            <button type="button" className="ll-close" aria-label="Close Hospital Command" onClick={ll.closeDashboard}><X aria-hidden="true" /></button>
          </div>
        </header>

        <div className="ll-command-strip">
          <span><b>{incoming ? "01" : "00"}</b> incoming</span>
          <span><b>{ACTIVE_CASES.length + (data.decision === "accepted" ? 1 : 0)}</b> active</span>
          <span className={`ll-status ll-status-${self.status}`}><span className="ll-status-dot" aria-hidden="true" />{STATUS_META[self.status].label}</span>
          <span>Updated {self.lastUpdated}</span>
        </div>

        <div className="ll-grid">
          <div className="ll-col">
            <section className="ll-card">
              <span className="ll-section-index">INCOMING QUEUE</span>
              <h3>Case requiring decision</h3>
              {incoming ? (
                <div className="ll-incoming">
                  <div className="ll-incoming-top">
                    <div><strong>{data.tempId}</strong><span>Received {received}</span></div>
                    <span className="ll-status ll-status-limited"><span className="ll-status-dot" aria-hidden="true" />{data.decision === "review" ? "REVIEWING" : "NEW REQUEST"}</span>
                  </div>
                  <dl>
                    <div><dt>Incident</dt><dd>{getCategoryLabel(data.category)}</dd></div>
                    <div><dt>Language</dt><dd>{LANGUAGES.find((language) => language.code === data.language)?.native ?? "Not provided"}</dd></div>
                    <div><dt>Responsive</dt><dd>{data.answers.conscious ?? "unknown"}</dd></div>
                    <div><dt>Breathing</dt><dd>{data.answers.breathing ?? "unknown"}</dd></div>
                    <div><dt>Visible bleeding</dt><dd>{data.answers.bleeding ?? "unknown"}{data.bleedingLocation ? ` · ${data.bleedingLocation}` : ""}</dd></div>
                    <div><dt>Reporter</dt><dd>{data.patientRelationship || (data.mode === "bystander" ? "bystander" : "not provided")}</dd></div>
                    <div className="ll-wide"><dt>Location / ETA</dt><dd>{data.location ? `${data.location} · Estimated ${self.etaMin} min` : "Location not shared"}</dd></div>
                    <div className="ll-wide"><dt>Pre-arrival summary</dt><dd>{data.summary || "Summary not ready"}</dd></div>
                  </dl>
                  <div className="ll-capability-match">
                    <span>RELEVANT CAPABILITY</span>
                    <strong>{data.category === "cardiac" ? "Cardiac Emergency" : data.category === "stroke" || data.category === "fall" ? "Neurosurgery" : "Emergency Department · Trauma"}</strong>
                  </div>
                  <div className="ll-decide">
                    <button type="button" className="sx-btn sx-btn-green" onClick={() => ll.decide("accepted")}>Accept</button>
                    <button type="button" className="sx-btn sx-btn-ghost" onClick={() => ll.decide("review")}>Review</button>
                    <button type="button" className="sx-btn sx-btn-red" onClick={() => ll.decide("unable")}>Unable to receive</button>
                  </div>
                  <p className="ll-note">Each action updates this shared demo case immediately. No real hospital communication occurs.</p>
                </div>
              ) : (
                <div className="ll-empty-state">
                  <span>QUEUE CLEAR</span>
                  <p>No request is waiting. Start an emergency or run the judge demo from the patient view.</p>
                </div>
              )}
            </section>

            <section className="ll-card">
              <span className="ll-section-index">ACTIVE CASES</span>
              <h3>Current inbound work</h3>
              <div className="ll-active">
                {data.decision === "accepted" && (
                  <div className="ll-active-row"><strong>{data.tempId}</strong><span>{getCategoryLabel(data.category)}</span><span>ETA {Math.floor(data.etaSec / 60)}:{String(data.etaSec % 60).padStart(2, "0")}</span><span>Accepted · team notified</span></div>
                )}
                {ACTIVE_CASES.map((current) => (
                  <div key={current.id} className="ll-active-row"><strong>{current.id}</strong><span>{current.category}</span><span>{current.eta}</span><span>{current.state}</span></div>
                ))}
              </div>
            </section>
          </div>

          <div className="ll-col">
            <section className="ll-card">
              <span className="ll-section-index">RECEIVING CONTROL</span>
              <h3>Emergency receiving status</h3>
              <div className="ll-chips" role="group" aria-label="Receiving status">
                {STATUSES.map((status) => (
                  <button key={status} type="button" className={`ll-chip ll-status-choice ll-status-${status}${self.status === status ? " on" : ""}`} aria-pressed={self.status === status} onClick={() => ll.setHospitalStatus(self.id, status)}>
                    <span className="ll-status-dot" aria-hidden="true" />{STATUS_META[status].label}
                  </button>
                ))}
              </div>
              <p className="ll-note">This simulated status is controlled here on the hospital side and shown exactly as reported to the patient view.</p>
            </section>

            <section className="ll-card">
              <span className="ll-section-index">CAPABILITY PROFILE</span>
              <h3>Configured services</h3>
              <div className="ll-command-list">
                {self.capabilities.map((capability, index) => <div key={capability}><span>{String(index + 1).padStart(2, "0")}</span><strong>{capability}</strong></div>)}
              </div>
              <h3 className="ll-subhead">Team-level information</h3>
              <div className="ll-command-list ll-command-list-muted">
                {self.teamStatus.map((team, index) => <div key={team}><span>{String(index + 1).padStart(2, "0")}</span><strong>{team}</strong></div>)}
              </div>
            </section>

            <section className="ll-card">
              <span className="ll-section-index">NETWORK</span>
              <h3>Participating demo hospitals</h3>
              <div className="ll-hospitals">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="ll-hosp ll-hosp-static">
                    <span className="ll-hosp-top"><strong>{hospital.name}</strong><span className={`ll-status ll-status-${hospital.status}`}><span className="ll-status-dot" aria-hidden="true" />{STATUS_META[hospital.status].label}</span></span>
                    <span className="ll-hosp-meta">{hospital.distanceKm} km · Estimated {hospital.etaMin} min · Updated {hospital.lastUpdated}</span>
                  </div>
                ))}
              </div>
            </section>

            <p className="ll-disclaimer">SIMULATED ENVIRONMENT. Role-based access, audit events and expiring case access are product architecture goals; this hackathon demo does not claim certification or real clinical deployment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
