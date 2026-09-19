import { LANGUAGES, STATUS_META } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

const STEPS = [
  { n: "01", label: "SPEAK", body: "Tell LIFE-LINK what happened naturally, by voice or typed text, in a supported language." },
  { n: "02", label: "UNDERSTAND", body: "The statement becomes structured emergency information. Unclear facts remain unknown." },
  { n: "03", label: "CONNECT", body: "Review participating hospitals using reported receiving status, capability, distance and estimated time." },
  { n: "04", label: "PREPARE", body: "The selected hospital reviews the same case and sends a confirmed operational response." },
];

const PRIVACY = [
  { n: "01", label: "PRIVATE BY DESIGN", body: "Collect only the emergency details needed for pre-arrival coordination." },
  { n: "02", label: "MINIMUM DATA", body: "Unknown patients can proceed with a temporary case identifier and no unnecessary identity fields." },
  { n: "03", label: "CONTROLLED ACCESS", body: "Hospital access should be authenticated and authorized on the server before sensitive data is shown." },
  { n: "04", label: "AUDITABLE", body: "Production deployments should record case access and decisions without putting sensitive data in public URLs." },
];

export function Sections() {
  const ll = useLifeLink();

  return (
    <div className="ll-page">
      <section className="ll-sec ll-problem" id="problem">
        <span className="ll-eyebrow">THE INFORMATION GAP</span>
        <h2>Emergency care begins with what the hospital knows.</h2>
        <div className="ll-statement-grid">
          <div><span>AT THE SCENE</span><strong>A witness knows what happened.</strong><p>Critical detail exists, but it is often fragmented, stressful to explain, or trapped behind language.</p></div>
          <div><span>IN TRANSIT</span><strong>Time passes without context.</strong><p>The route begins while the receiving team may still know nothing about the patient coming in.</p></div>
          <div><span>AT ARRIVAL</span><strong>The story starts again.</strong><p>Intake teams reconstruct information when attention should be focused on preparation.</p></div>
        </div>
      </section>

      <section className="ll-sec" id="how">
        <span className="ll-eyebrow">HOW LIFE-LINK WORKS</span>
        <h2>One continuous path from statement to preparation.</h2>
        <div className="ll-flow">
          {STEPS.map((step) => (
            <div key={step.n} className="ll-flow-step">
              <span className="ll-flow-n">{step.n}</span>
              <strong>{step.label}</strong>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ll-sec ll-sec-split" id="voice">
        <div>
          <span className="ll-eyebrow">VOICE-FIRST EXPERIENCE</span>
          <h2>Natural speech becomes information people can act on.</h2>
          <p className="ll-lead">LIFE-LINK listens or accepts typed text, extracts only stated facts, keeps uncertainty visible, and asks for the details still missing. The form always remains editable.</p>
          <button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>Try the emergency flow</button>
        </div>
        <div className="ll-evidence">
          <div className="ll-evidence-source"><span>USER STATEMENT · TELUGU</span><p>“నా అన్నను కారు ఢీకొట్టింది. అతను స్పందించడం లేదు, తల నుంచి రక్తం కారుతోంది.”</p></div>
          <div className="ll-evidence-rule" />
          <dl>
            <div><dt>INCIDENT</dt><dd>Road traffic incident</dd></div>
            <div><dt>RESPONSIVE</dt><dd>No</dd></div>
            <div><dt>BLEEDING</dt><dd>Yes · head</dd></div>
            <div><dt>BREATHING</dt><dd>Unknown · confirm</dd></div>
          </dl>
          <p className="ll-evidence-note">Extracted information is never treated as final until the user confirms it.</p>
        </div>
      </section>

      <section className="ll-sec" id="hospitals">
        <span className="ll-eyebrow">HOSPITAL COORDINATION</span>
        <h2>Show facts. Let the hospital control availability.</h2>
        <div className="ll-coordination-table">
          <div className="ll-coordination-head"><span>RECEIVING STATE</span><span>WHAT IT MEANS</span><span>SOURCE</span></div>
          {(["accepting", "limited", "unable"] as const).map((status) => (
            <div key={status}>
              <span className={`ll-status ll-status-${status}`}><span className="ll-status-dot" aria-hidden="true" />{STATUS_META[status].label}</span>
              <p>{status === "accepting" ? "Hospital reports that emergency receiving is open." : status === "limited" ? "Hospital reports constraints; review capability details." : "Hospital reports that it cannot receive this request."}</p>
              <strong>Hospital-reported</strong>
            </div>
          ))}
        </div>
        <p className="ll-caption">Distances and travel times in this demo are simulated estimates. They are not live navigation or ambulance tracking.</p>
      </section>

      <section className="ll-sec" id="languages">
        <span className="ll-eyebrow">MULTILINGUAL BY STRUCTURE</span>
        <h2>The language changes. The emergency record does not.</h2>
        <p className="ll-lead">Questions, labels and actions can change language while one structured case keeps the same fields for the receiving team.</p>
        <div className="ll-langs">
          {LANGUAGES.map((language, index) => <span key={language.code} className="ll-lang"><small>{String(index + 1).padStart(2, "0")}</small><strong>{language.native}</strong><em>{language.label}</em></span>)}
        </div>
      </section>

      <section className="ll-sec" id="privacy">
        <span className="ll-eyebrow">SECURITY & PRIVACY</span>
        <h2>Built for sensitive moments, without inflated claims.</h2>
        <div className="ll-privacy-grid">
          {PRIVACY.map((principle) => <div key={principle.n}><span>{principle.n}</span><strong>{principle.label}</strong><p>{principle.body}</p></div>)}
        </div>
        <p className="ll-caption">The hackathon demo uses fictional cases and simulated hospitals. Production controls require verified deployment, policy, operational, and legal review.</p>
      </section>

      <section className="ll-sec ll-sec-split" id="for-hospitals">
        <div>
          <span className="ll-eyebrow">FOR HOSPITALS</span>
          <h2>An inbound queue built for rapid operational decisions.</h2>
          <p className="ll-lead">Case ID, time received, incident type, patient state, location permission, estimated arrival, relevant capability and request status are visible in one scanning order.</p>
          <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>Open Hospital Command</button>
        </div>
        <div className="ll-command-preview">
          <div className="ll-command-preview-head"><span>INCOMING · 01</span><span>SIMULATED</span></div>
          <div className="ll-command-preview-case"><strong>LL-7F4A2</strong><span className="ll-status ll-status-limited"><span className="ll-status-dot" aria-hidden="true" />NEW REQUEST</span></div>
          <dl><div><dt>INCIDENT</dt><dd>Road traffic incident</dd></div><div><dt>RESPONSIVE</dt><dd>No</dd></div><div><dt>BREATHING</dt><dd>Yes</dd></div><div><dt>ESTIMATED ETA</dt><dd>8 min</dd></div></dl>
          <div className="ll-decision-copy"><span>ACCEPT</span><span>REVIEW</span><span>UNABLE TO RECEIVE</span></div>
        </div>
      </section>

      <section className="ll-sec ll-final" id="about">
        <span className="ll-eyebrow">JUDGE DEMO · UNDER TWO MINUTES</span>
        <h2>A person speaks. The hospital prepares.</h2>
        <p className="ll-lead">Run the connected Telugu road-incident scenario, review the structured summary, send it to a simulated hospital, and make the hospital-side decision yourself.</p>
        <div className="sx-cta"><button type="button" className="sx-btn sx-btn-red" onClick={ll.openEmergency}>Start Emergency</button><button type="button" className="sx-btn sx-btn-ghost" onClick={ll.runQuickDemo}>Run Judge Demo</button></div>
      </section>

      <footer className="ll-footer">
        <div className="ll-footer-cols">
          <div><span className="sx-logo">LIFE-LINK</span><p>You speak. We prepare. The hospital knows before you arrive.</p></div>
          <div><strong>PRODUCT</strong><a href="#how">How it works</a><a href="#voice">Voice first</a><a href="#hospitals">Hospital coordination</a></div>
          <div><strong>TRUST</strong><a href="#privacy">Security and privacy</a><a href="#languages">Languages</a><a href="#for-hospitals">For hospitals</a></div>
          <div><strong>DEMO</strong><button type="button" onClick={ll.openEmergency}>Start emergency</button><button type="button" onClick={ll.runQuickDemo}>Run judge demo</button></div>
        </div>
        <p className="ll-legal">LIFE-LINK is an information-coordination prototype. It does not diagnose, provide treatment, replace emergency medical services, confirm real hospital availability, or contact an emergency service. In immediate danger, contact local emergency services. All hospitals, statuses, locations, cases, team information and acknowledgements shown in this demonstration are fictional or simulated.</p>
      </footer>
    </div>
  );
}
