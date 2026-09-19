import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MapPin, Mic, X } from "lucide-react";
import {
  CATEGORIES,
  LANGUAGES,
  STATUS_META,
  UI,
  getCategoryLabel,
  type Answer,
  type LangCode,
} from "@/lib/lifelink-data";
import { extractEmergencyWithAi } from "@/lib/lifelink-ai.functions";
import { extractEmergencyInfoLocal } from "@/lib/lifelink-extraction";
import { useLifeLink, type Answers } from "@/lib/lifelink-store";
import { Timeline } from "./Timeline";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type Question = { key: keyof Answers; label: string };
const ANSWERS: Answer[] = ["yes", "no", "unknown"];

function statusLabel(state: string) {
  return state.replace(/-/g, " ");
}

export function EmergencyMode() {
  const ll = useLifeLink();
  const { data, hospitals, processing } = ll;
  const t = UI[data.language];
  const extractWithAi = useServerFn(extractEmergencyWithAi);
  const [typingOpen, setTypingOpen] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const questions = useMemo<Question[]>(() => {
    const next: Question[] = [
      { key: "patientKnown", label: t.patientKnown },
      { key: "conscious", label: t.conscious },
      { key: "breathing", label: t.breathing },
      { key: "bleeding", label: t.bleeding },
    ];
    if (data.answers.bleeding !== "no") next.push({ key: "injuries", label: t.injuries });
    return next;
  }, [data.answers.bleeding, t]);
  const activeQuestion = questions[Math.min(ll.questionIndex, questions.length - 1)];
  const selected = hospitals.find((hospital) => hospital.id === data.hospitalId);
  const requiredMissing = data.missing.filter((field) => field !== "location" && field !== "patient_relationship");

  useEffect(() => {
    if (!ll.emergencyOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") ll.closeEmergency();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      recognitionRef.current?.stop();
    };
  }, [ll.emergencyOpen, ll.closeEmergency]);

  if (!ll.emergencyOpen) return null;

  const analyzeStatement = async () => {
    const statement = data.narrative.trim();
    if (!statement) {
      ll.setError("Tell us what happened first. Voice and typed input are both supported.");
      return;
    }
    ll.setError(null);
    ll.setNotice(t.checking);
    ll.setProcessing("understanding");
    try {
      const response = await extractWithAi({ data: { text: statement, language: data.language } });
      ll.applyExtraction(response.result, response.source);
      ll.setNotice(response.message);
    } catch {
      ll.applyExtraction(extractEmergencyInfoLocal(statement), "local-rules");
      ll.setNotice("The online extraction service was unavailable. Local extraction was used; please confirm each detail.");
    } finally {
      ll.setProcessing("idle");
    }
  };

  const startVoice = () => {
    ll.setError(null);
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      ll.setError(t.voiceUnavailable);
      setTypingOpen(true);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      const locale = LANGUAGES.find((language) => language.code === data.language)?.speechLocale ?? "en-IN";
      recognition.lang = locale;
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onresult = (event) => {
        const lines = Array.from(event.results)
          .filter((result) => result.isFinal)
          .map((result) => result[0]?.transcript ?? "")
          .filter(Boolean);
        const next = lines.join(" ");
        if (next) {
          ll.setNarrative([data.narrative, next].filter(Boolean).join(" "));
          ll.appendTranscript(next);
          ll.setNotice("Speech converted to text. Review it, then choose Understand statement.");
        }
      };
      recognition.onerror = () => {
        ll.setProcessing("idle");
        ll.setError("Microphone access failed or was denied. You can type the same information instead.");
        setTypingOpen(true);
      };
      recognition.onend = () => ll.setProcessing("idle");
      recognitionRef.current = recognition;
      ll.setProcessing("listening");
      recognition.start();
    } catch {
      ll.setProcessing("idle");
      ll.setError(t.voiceUnavailable);
      setTypingOpen(true);
    }
  };

  return (
    <div className="ll-overlay" role="dialog" aria-modal="true" aria-labelledby="emergency-title">
      <div className="ll-sheet ll-product-sheet">
        <header className="ll-sheet-top">
          <div>
            <span className="ll-badge">{t.simulatedEnvironment}</span>
            <h2 id="emergency-title">{data.mode === "bystander" ? "Bystander report" : "Emergency case"} · {data.tempId}</h2>
            <p className="ll-case-state">{data.phase.replace(/_/g, " ")}</p>
          </div>
          <div className="ll-sheet-actions">
            <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>Hospital Command</button>
            <button type="button" className="ll-close" aria-label="Close emergency mode" onClick={ll.closeEmergency}>
              <X aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="ll-safety-banner" role="note">{t.safety}</div>
        {ll.error && <div className="ll-feedback ll-feedback-error" role="alert">{ll.error}</div>}
        {ll.notice && <div className="ll-feedback" aria-live="polite">{ll.notice}</div>}

        <div className="ll-grid">
          <div className="ll-col">
            <section className="ll-card">
              <span className="ll-section-index">01 · SETUP</span>
              <h3>{t.language}</h3>
              <div className="ll-chips" role="group" aria-label={t.language}>
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    className={`ll-chip${data.language === language.code ? " on" : ""}`}
                    aria-pressed={data.language === language.code}
                    onClick={() => ll.setLanguage(language.code as LangCode)}
                  >
                    <span>{language.native}</span><small>{language.label}</small>
                  </button>
                ))}
              </div>
              <h3 className="ll-subhead">{t.reporting}</h3>
              <div className="ll-chips" role="group" aria-label={t.reporting}>
                <button type="button" className={`ll-chip${data.mode === "self" ? " on" : ""}`} aria-pressed={data.mode === "self"} onClick={() => ll.setMode("self")}>{t.selfMode}</button>
                <button type="button" className={`ll-chip${data.mode === "bystander" ? " on" : ""}`} aria-pressed={data.mode === "bystander"} onClick={() => ll.setMode("bystander")}>{t.bystanderMode}</button>
              </div>
              {data.mode === "bystander" && <p className="ll-note">{t.temporaryIdNote} <strong>{data.tempId}</strong></p>}
            </section>

            <section className="ll-card">
              <span className="ll-section-index">02 · DESCRIBE</span>
              <h3>{t.voiceFirst}</h3>
              <p className="ll-instruction">{t.tellWhatHappened}</p>
              <div className="ll-voice-actions">
                <button type="button" className={`ll-mic${processing === "listening" ? " on" : ""}`} onClick={startVoice} disabled={processing !== "idle"}>
                  <Mic aria-hidden="true" />
                  <span>{processing === "listening" ? t.listening : t.talk}</span>
                  {processing === "listening" && <span className="ll-wave" aria-hidden="true">{Array.from({ length: 7 }).map((_, index) => <i key={index} style={{ animationDelay: `${index * 0.09}s` }} />)}</span>}
                </button>
                <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.startListeningSimulation} disabled={processing !== "idle"}>Run voice demo</button>
              </div>
              <button type="button" className="ll-text-action" onClick={() => setTypingOpen((current) => !current)}>{t.typeInstead}</button>
              {typingOpen && (
                <div className="ll-text-input">
                  <label htmlFor="emergency-narrative">{t.narrativeLabel}</label>
                  <textarea id="emergency-narrative" value={data.narrative} maxLength={2000} placeholder={t.narrativePlaceholder} onChange={(event) => ll.setNarrative(event.target.value)} />
                  <span>{data.narrative.length}/2000</span>
                </div>
              )}
              <div className="ll-inline-actions">
                <button type="button" className="sx-btn sx-btn-red" onClick={analyzeStatement} disabled={!data.narrative.trim() || processing !== "idle"}>{processing === "understanding" ? t.understanding : t.analyze}</button>
                <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.loadDemoStatement}>{t.useDemoStatement}</button>
              </div>
              {data.transcript.length > 0 && (
                <div className="ll-transcript" aria-label="Speech transcript">
                  <span>TRANSCRIPT</span>
                  <p>{data.transcript.join(" ")}</p>
                </div>
              )}
            </section>

            <section className="ll-card ll-question-card">
              <span className="ll-section-index">03 · CONFIRM</span>
              <h3>{activeQuestion ? `Question ${Math.min(ll.questionIndex + 1, questions.length)} of ${questions.length}` : t.coreDetailsReady}</h3>
              {activeQuestion && (
                <>
                  <p className="ll-question">{activeQuestion.label}</p>
                  <div className="ll-q-btns" role="group" aria-label={activeQuestion.label}>
                    {ANSWERS.map((answer) => (
                      <button key={answer} type="button" className={`ll-ans${data.answers[activeQuestion.key] === answer ? " on" : ""}`} aria-pressed={data.answers[activeQuestion.key] === answer} onClick={() => ll.setAnswer(activeQuestion.key, answer)}>
                        {answer === "yes" ? t.yes : answer === "no" ? t.no : t.unknown}
                      </button>
                    ))}
                  </div>
                  <div className="ll-question-nav">
                    <button type="button" className="ll-text-action" disabled={ll.questionIndex === 0} onClick={() => ll.setQuestionIndex(ll.questionIndex - 1)}>{t.previous}</button>
                    <button type="button" className="ll-text-action" disabled={ll.questionIndex >= questions.length - 1} onClick={() => ll.setQuestionIndex(ll.questionIndex + 1)}>{t.next}</button>
                  </div>
                </>
              )}
              <p className="ll-note">{requiredMissing.length > 0 ? `${t.oneDetailMissing} ${requiredMissing.map(statusLabel).join(", ")}.` : t.coreDetailsReady}</p>
              <h3 className="ll-subhead">{t.category}</h3>
              <div className="ll-cats">
                {CATEGORIES.map((category) => (
                  <button key={category.id} type="button" className={`ll-cat${data.category === category.id ? " on" : ""}`} aria-pressed={data.category === category.id} onClick={() => ll.setCategory(category.id)}>
                    <span className="ll-cat-code" aria-hidden="true">{category.code}</span>{category.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="ll-col">
            <section className="ll-card ll-form">
              <span className="ll-section-index">04 · REVIEW</span>
              <h3>{t.caseForm}</h3>
              <dl>
                <div><dt>{t.caseId}</dt><dd>{data.tempId}</dd></div>
                <div><dt>{t.languageField}</dt><dd>{LANGUAGES.find((language) => language.code === data.language)?.native}</dd></div>
                <div><dt>{t.incidentType}</dt><dd>{getCategoryLabel(data.category, data.language)}</dd></div>
                <div><dt>{t.patientRelationship}</dt><dd>{data.patientRelationship || t.notProvided}</dd></div>
                <div><dt>Responsive</dt><dd>{data.answers.conscious ?? "unknown"}</dd></div>
                <div><dt>Breathing</dt><dd>{data.answers.breathing ?? "unknown"}</dd></div>
                <div><dt>Visible bleeding</dt><dd>{data.answers.bleeding ?? "unknown"}</dd></div>
                {data.answers.bleeding === "yes" && <div><dt>{t.bleedingLocation}</dt><dd>{data.bleedingLocation || t.notProvided}</dd></div>}
                <div className="ll-wide"><dt>{t.description}</dt><dd>{data.narrative || t.notProvided}</dd></div>
                <div className="ll-wide"><dt>{t.source}</dt><dd>{data.extractionSource === "lovable-ai" ? "AI-extracted · confirmation required" : data.extractionSource === "local-rules" ? "Locally extracted · confirmation required" : data.extractionSource === "manual" ? "User-provided" : t.notProvided}</dd></div>
              </dl>
              <div className="ll-summary">
                <span>{t.emergencySummary}</span>
                <p>{data.summary || t.notProvided}</p>
              </div>
            </section>

            <section className="ll-card">
              <span className="ll-section-index">05 · LOCATION</span>
              <h3>{t.locationTitle}</h3>
              <p className="ll-instruction">{t.locationWhy}</p>
              <div className="ll-inline-actions">
                <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.requestLocation} disabled={data.locationState === "requesting"}>
                  <MapPin aria-hidden="true" />{data.locationState === "requesting" ? "Requesting permission" : t.shareLocation}
                </button>
              </div>
              <label className="ll-manual-location" htmlFor="manual-location">
                <span>{t.manualLocation}</span>
                <input id="manual-location" value={data.locationState === "manual" ? data.location ?? "" : ""} placeholder={t.manualLocationPlaceholder} onChange={(event) => ll.setManualLocation(event.target.value)} />
              </label>
              <p className="ll-note">Current: {data.location ?? t.notProvided}</p>
            </section>

            <section className="ll-card">
              <span className="ll-section-index">06 · COORDINATE</span>
              <h3>{t.hospitals}</h3>
              <div className="ll-demo-label">{t.demoData} · Fictional hospital information</div>
              <div className="ll-hospitals">
                {hospitals.map((hospital) => (
                  <button key={hospital.id} type="button" className={`ll-hosp${data.hospitalId === hospital.id ? " on" : ""}`} aria-pressed={data.hospitalId === hospital.id} onClick={() => ll.selectHospital(hospital.id)} disabled={hospital.status === "unable"}>
                    <span className="ll-hosp-top">
                      <strong>{hospital.name}</strong>
                      <span className={`ll-status ll-status-${hospital.status}`}><span className="ll-status-dot" aria-hidden="true" />{STATUS_META[hospital.status].label}</span>
                    </span>
                    <span className="ll-hosp-meta">{hospital.distanceKm} km · {t.estimatedEta} {hospital.etaMin} min · Updated {hospital.lastUpdated}</span>
                    <span className="ll-caps">{hospital.capabilities.map((capability) => <em key={capability}>{capability}</em>)}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="sx-btn sx-btn-red" disabled={!selected || data.decision === "pending" || requiredMissing.length > 0} onClick={ll.requestReception}>
                {data.decision === "pending" ? t.waiting : t.request}
              </button>
              {data.decision === "pending" && <button type="button" className="sx-btn sx-btn-ghost" onClick={ll.openDashboard}>Review in Hospital Command</button>}
            </section>

            <section className="ll-card">
              <span className="ll-section-index">07 · STATUS</span>
              <h3>Coordination timeline</h3>
              <Timeline />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
