import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_STATEMENTS,
  HOSPITALS,
  TRANSCRIPTS,
  makeTempId,
  type Answer,
  type CasePhase,
  type CategoryId,
  type Hospital,
  type LangCode,
  type ReceivingStatus,
} from "./lifelink-data";
import type { MissingField, SafeExtraction } from "./lifelink-extraction";

export type Decision = "none" | "pending" | "review" | "accepted" | "unable";
export type ProcessingState = "idle" | "listening" | "understanding" | "checking";
export type LocationState = "idle" | "requesting" | "shared" | "denied" | "manual";

export interface Answers {
  patientKnown?: Answer;
  conscious?: Answer;
  breathing?: Answer;
  bleeding?: Answer;
  injuries?: Answer;
}

export interface CaseData {
  tempId: string;
  language: LangCode;
  mode: "self" | "bystander";
  category: CategoryId | null;
  answers: Answers;
  narrative: string;
  transcript: string[];
  bleedingLocation: string;
  patientRelationship: string;
  summary: string;
  extractionSource: "none" | "lovable-ai" | "local-rules" | "manual";
  extractionConfidence: Record<string, number | null>;
  missing: MissingField[];
  location: string | null;
  locationState: LocationState;
  hospitalId: string | null;
  decision: Decision;
  phase: CasePhase;
  etaSec: number;
  createdAt: string;
  sentAt: string | null;
}

interface Ctx {
  emergencyOpen: boolean;
  dashboardOpen: boolean;
  hospitals: Hospital[];
  data: CaseData;
  processing: ProcessingState;
  demoRunning: boolean;
  questionIndex: number;
  notice: string | null;
  error: string | null;
  openEmergency: () => void;
  closeEmergency: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  setLanguage: (l: LangCode) => void;
  setMode: (m: "self" | "bystander") => void;
  setCategory: (c: CategoryId) => void;
  setAnswer: (k: keyof Answers, v: Answer) => void;
  setNarrative: (value: string) => void;
  setQuestionIndex: (value: number) => void;
  setProcessing: (value: ProcessingState) => void;
  setNotice: (value: string | null) => void;
  setError: (value: string | null) => void;
  appendTranscript: (line: string) => void;
  clearTranscript: () => void;
  applyExtraction: (result: SafeExtraction, source: CaseData["extractionSource"]) => void;
  loadDemoStatement: () => void;
  startListeningSimulation: () => void;
  requestLocation: () => void;
  setManualLocation: (value: string) => void;
  selectHospital: (id: string) => void;
  requestReception: () => boolean;
  decide: (d: Decision) => void;
  advanceCoordination: () => void;
  setHospitalStatus: (id: string, s: ReceivingStatus) => void;
  runQuickDemo: () => void;
  reset: () => void;
}

const LifeLinkContext = createContext<Ctx | null>(null);

function blankCase(): CaseData {
  return {
    tempId: makeTempId(),
    language: "en",
    mode: "self",
    category: null,
    answers: {},
    narrative: "",
    transcript: [],
    bleedingLocation: "",
    patientRelationship: "",
    summary: "",
    extractionSource: "none",
    extractionConfidence: {},
    missing: ["incident_type", "responsive", "breathing", "visible_bleeding", "patient_relationship", "location"],
    location: null,
    locationState: "idle",
    hospitalId: null,
    decision: "none",
    phase: "created",
    etaSec: 0,
    createdAt: new Date().toISOString(),
    sentAt: null,
  };
}

function createSummary(data: CaseData) {
  const category = data.category?.replace(/_/g, " ") ?? "incident type not provided";
  const location = data.location ?? "location not shared";
  const relation = data.patientRelationship || (data.mode === "bystander" ? "bystander" : "not provided");
  return `Incident: ${category}. Responsive: ${data.answers.conscious ?? "unknown"}. Breathing: ${data.answers.breathing ?? "unknown"}. Bleeding: ${data.answers.bleeding ?? "unknown"}${data.bleedingLocation ? `, ${data.bleedingLocation}` : ""}. Reporter relation: ${relation}. Location: ${location}.`;
}

function deriveMissing(data: CaseData): MissingField[] {
  const missing: MissingField[] = [];
  if (!data.category) missing.push("incident_type");
  if (!data.answers.conscious || data.answers.conscious === "unknown") missing.push("responsive");
  if (!data.answers.breathing || data.answers.breathing === "unknown") missing.push("breathing");
  if (!data.answers.bleeding || data.answers.bleeding === "unknown") missing.push("visible_bleeding");
  if (data.answers.bleeding === "yes" && !data.bleedingLocation) missing.push("bleeding_location");
  if (!data.patientRelationship && data.mode !== "bystander") missing.push("patient_relationship");
  if (!data.location) missing.push("location");
  return missing;
}

export function LifeLinkProvider({ children }: { children: ReactNode }) {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(HOSPITALS);
  const [data, setData] = useState<CaseData>(blankCase);
  const [processing, setProcessing] = useState<ProcessingState>("idle");
  const [demoRunning, setDemoRunning] = useState(false);
  const [questionIndex, setQuestionIndexState] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const updateCase = useCallback((updater: (current: CaseData) => CaseData) => {
    setData((current) => {
      const next = updater(current);
      const enriched = { ...next, missing: deriveMissing(next) };
      return { ...enriched, summary: createSummary(enriched) };
    });
  }, []);

  const openEmergency = useCallback(() => {
    setDashboardOpen(false);
    setEmergencyOpen(true);
  }, []);
  const closeEmergency = useCallback(() => setEmergencyOpen(false), []);
  const openDashboard = useCallback(() => {
    setEmergencyOpen(false);
    setDashboardOpen(true);
  }, []);
  const closeDashboard = useCallback(() => setDashboardOpen(false), []);

  const setLanguage = useCallback((language: LangCode) => updateCase((d) => ({ ...d, language })), [updateCase]);
  const setMode = useCallback(
    (mode: "self" | "bystander") =>
      updateCase((d) => ({
        ...d,
        mode,
        answers:
          mode === "bystander"
            ? { ...d.answers, patientKnown: "no" }
            : Object.fromEntries(Object.entries(d.answers).filter(([key]) => key !== "patientKnown")) as Answers,
        patientRelationship: mode === "bystander" ? "bystander" : d.patientRelationship,
      })),
    [updateCase],
  );
  const setCategory = useCallback((category: CategoryId) => updateCase((d) => ({ ...d, category, phase: "information_collecting", extractionSource: d.extractionSource === "none" ? "manual" : d.extractionSource })), [updateCase]);
  const setAnswer = useCallback(
    (key: keyof Answers, value: Answer) =>
      updateCase((d) => ({
        ...d,
        answers: { ...d.answers, [key]: value },
        phase: "information_collecting",
        extractionSource: d.extractionSource === "none" ? "manual" : d.extractionSource,
        bleedingLocation: key === "bleeding" && value === "no" ? "" : d.bleedingLocation,
      })),
    [updateCase],
  );
  const setNarrative = useCallback((narrative: string) => updateCase((d) => ({ ...d, narrative: narrative.slice(0, 2000) })), [updateCase]);
  const setQuestionIndex = useCallback((value: number) => setQuestionIndexState(Math.max(0, value)), []);
  const appendTranscript = useCallback((line: string) => updateCase((d) => ({ ...d, transcript: [...d.transcript, line], narrative: [d.narrative, line].filter(Boolean).join(" ").slice(0, 2000) })), [updateCase]);
  const clearTranscript = useCallback(() => updateCase((d) => ({ ...d, transcript: [] })), [updateCase]);

  const applyExtraction = useCallback(
    (result: SafeExtraction, source: CaseData["extractionSource"]) => {
      updateCase((d) => {
        const next = {
          ...d,
          category: result.category ?? d.category,
          answers: { ...d.answers, ...result.answers },
          bleedingLocation: result.bleedingLocation || d.bleedingLocation,
          patientRelationship: result.patientRelationship || d.patientRelationship,
          summary: result.summary,
          extractionSource: source,
          extractionConfidence: result.confidence,
          missing: result.missing,
          phase: "information_collecting" as const,
        };
        const remaining = deriveMissing(next).filter((field) => field !== "location");
        return { ...next, phase: remaining.length === 0 ? "ready" : "information_collecting" };
      });
      setQuestionIndexState(0);
    },
    [updateCase],
  );

  const loadDemoStatement = useCallback(() => {
    updateCase((d) => ({ ...d, narrative: DEMO_STATEMENTS[d.language], transcript: [] }));
    setNotice("Demo statement loaded. Review it, then choose Understand statement.");
    setError(null);
  }, [updateCase]);

  const startListeningSimulation = useCallback(() => {
    clearTimers();
    setProcessing("listening");
    setError(null);
    updateCase((d) => ({ ...d, transcript: [], narrative: "", phase: "information_collecting" }));
    const lines = TRANSCRIPTS[data.language];
    lines.forEach((line, index) => {
      later(() => appendTranscript(line), 550 * (index + 1));
    });
    later(() => {
      setProcessing("idle");
      setNotice("Demo voice captured. Choose Understand statement to structure it.");
    }, 550 * (lines.length + 1));
  }, [appendTranscript, clearTimers, data.language, later, updateCase]);

  const requestLocation = useCallback(() => {
    setError(null);
    updateCase((d) => ({ ...d, locationState: "requesting" }));
    if (!("geolocation" in navigator)) {
      updateCase((d) => ({ ...d, locationState: "denied" }));
      setError("Location is not available on this device. Enter an approximate location manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(3);
        const lng = position.coords.longitude.toFixed(3);
        updateCase((d) => ({ ...d, location: `Approximate coordinates ${lat}, ${lng}`, locationState: "shared" }));
        setNotice("Approximate location shared for this case.");
      },
      () => {
        updateCase((d) => ({ ...d, locationState: "denied" }));
        setError("Location was not shared. Enter a nearby landmark or area instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, [updateCase]);

  const setManualLocation = useCallback(
    (value: string) => updateCase((d) => ({ ...d, location: value.trim().slice(0, 180) || null, locationState: value.trim() ? "manual" : "idle" })),
    [updateCase],
  );
  const selectHospital = useCallback((hospitalId: string) => updateCase((d) => ({ ...d, hospitalId })), [updateCase]);

  const requestReception = useCallback(() => {
    let sent = false;
    updateCase((d) => {
      const selected = hospitals.find((hospital) => hospital.id === d.hospitalId);
      const requiredMissing = deriveMissing(d).filter((field) => field !== "location" && field !== "patient_relationship");
      if (!selected || selected.status === "unable" || requiredMissing.length > 0) return d;
      sent = true;
      return { ...d, decision: "pending", phase: "request_sent", sentAt: new Date().toISOString() };
    });
    if (sent) {
      setNotice("Request sent to the selected simulated hospital. Open Hospital Command to review it.");
      setError(null);
    } else {
      setError("Confirm the core emergency details and select a hospital that can receive before sending.");
    }
    return sent;
  }, [hospitals, updateCase]);

  const decide = useCallback(
    (decision: Decision) => {
      updateCase((d) => {
        if (d.decision === "none") return d;
        if (decision === "accepted") {
          const hospital = hospitals.find((item) => item.id === d.hospitalId);
          return { ...d, decision, phase: "hospital_accepted", etaSec: (hospital?.etaMin ?? 8) * 60 };
        }
        if (decision === "review") return { ...d, decision, phase: "hospital_reviewing" };
        if (decision === "unable") return { ...d, decision, phase: "hospital_unable" };
        return { ...d, decision };
      });
    },
    [hospitals, updateCase],
  );

  const advanceCoordination = useCallback(() => {
    updateCase((d) => {
      if (d.phase === "hospital_accepted") return { ...d, phase: "travelling" };
      if (d.phase === "travelling") return { ...d, phase: "preparing" };
      if (d.phase === "preparing") return { ...d, phase: "arrived", etaSec: 0 };
      return d;
    });
  }, [updateCase]);

  const setHospitalStatus = useCallback((id: string, status: ReceivingStatus) => {
    setHospitals((items) => items.map((hospital) => (hospital.id === id ? { ...hospital, status, lastUpdated: "just now" } : hospital)));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setProcessing("idle");
    setDemoRunning(false);
    setQuestionIndexState(0);
    setNotice(null);
    setError(null);
    setData(blankCase());
    setHospitals(HOSPITALS);
  }, [clearTimers]);

  useEffect(() => {
    if (!(["hospital_accepted", "travelling", "preparing"] as CasePhase[]).includes(data.phase) || data.etaSec <= 0) return;
    const id = window.setInterval(() => {
      setData((current) => ({ ...current, etaSec: Math.max(0, current.etaSec - 1) }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [data.phase, data.etaSec]);

  const runQuickDemo = useCallback(() => {
    clearTimers();
    setDemoRunning(true);
    setProcessing("understanding");
    setNotice("Judge demo in progress: a simulated Telugu statement is being structured.");
    setError(null);
    setHospitals(HOSPITALS);
    setData({ ...blankCase(), language: "te", mode: "bystander", phase: "information_collecting", narrative: DEMO_STATEMENTS.te });
    setDashboardOpen(false);
    setEmergencyOpen(true);

    const lines = TRANSCRIPTS.te;
    lines.forEach((line, index) => {
      later(() => setData((current) => ({ ...current, transcript: [...current.transcript, line] })), 450 + 450 * index);
    });
    later(() => {
      setData((current) => {
        const next: CaseData = {
          ...current,
          category: "road",
          answers: { patientKnown: "yes", conscious: "no", breathing: "yes", bleeding: "yes", injuries: "unknown" },
          bleedingLocation: "head",
          patientRelationship: "brother",
          extractionSource: "lovable-ai",
          extractionConfidence: { incident_type: 0.98, responsive: 0.99, breathing_normally: 0.92, visible_bleeding: 0.98 },
          phase: "ready",
        };
        return { ...next, missing: deriveMissing(next), summary: createSummary(next) };
      });
      setProcessing("idle");
      setNotice("Emergency summary ready. Location and hospital selection remain under your control.");
    }, 450 + 450 * lines.length);
    later(() => setData((current) => ({ ...current, location: "NH-44 Highway Junction, Sector 7 (demo location)", locationState: "manual" })), 2300);
    later(() => setData((current) => ({ ...current, hospitalId: "alpha" })), 2800);
    later(() => {
      setData((current) => ({ ...current, decision: "pending", phase: "request_sent", sentAt: new Date().toISOString() }));
      setNotice("Simulated request delivered to Demo Hospital Alpha. Open Hospital Command and choose an action.");
      setDemoRunning(false);
    }, 3400);
  }, [clearTimers, later]);

  const value = useMemo<Ctx>(
    () => ({
      emergencyOpen,
      dashboardOpen,
      hospitals,
      data,
      processing,
      demoRunning,
      questionIndex,
      notice,
      error,
      openEmergency,
      closeEmergency,
      openDashboard,
      closeDashboard,
      setLanguage,
      setMode,
      setCategory,
      setAnswer,
      setNarrative,
      setQuestionIndex,
      setProcessing,
      setNotice,
      setError,
      appendTranscript,
      clearTranscript,
      applyExtraction,
      loadDemoStatement,
      startListeningSimulation,
      requestLocation,
      setManualLocation,
      selectHospital,
      requestReception,
      decide,
      advanceCoordination,
      setHospitalStatus,
      runQuickDemo,
      reset,
    }),
    [
      emergencyOpen,
      dashboardOpen,
      hospitals,
      data,
      processing,
      demoRunning,
      questionIndex,
      notice,
      error,
      openEmergency,
      closeEmergency,
      openDashboard,
      closeDashboard,
      setLanguage,
      setMode,
      setCategory,
      setAnswer,
      setNarrative,
      setQuestionIndex,
      appendTranscript,
      clearTranscript,
      applyExtraction,
      loadDemoStatement,
      startListeningSimulation,
      requestLocation,
      setManualLocation,
      selectHospital,
      requestReception,
      decide,
      advanceCoordination,
      setHospitalStatus,
      runQuickDemo,
      reset,
    ],
  );

  return <LifeLinkContext.Provider value={value}>{children}</LifeLinkContext.Provider>;
}

export function useLifeLink() {
  const context = useContext(LifeLinkContext);
  if (!context) throw new Error("useLifeLink must be used inside LifeLinkProvider");
  return context;
}
