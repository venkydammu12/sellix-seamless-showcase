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
  HOSPITALS,
  TRANSCRIPTS,
  makeTempId,
  type Answer,
  type Hospital,
  type LangCode,
  type ReceivingStatus,
} from "./lifelink-data";

export type Decision = "none" | "pending" | "review" | "accepted" | "unable";

export interface Answers {
  conscious?: Answer;
  breathing?: Answer;
  bleeding?: Answer;
  injuries?: Answer;
}

export interface CaseData {
  tempId: string;
  language: LangCode;
  mode: "self" | "bystander";
  category: string | null;
  answers: Answers;
  transcript: string[];
  location: string | null;
  hospitalId: string | null;
  decision: Decision;
  step: number;
  etaSec: number;
}

interface Ctx {
  emergencyOpen: boolean;
  dashboardOpen: boolean;
  hospitals: Hospital[];
  data: CaseData;
  listening: boolean;
  demoRunning: boolean;
  openEmergency: () => void;
  closeEmergency: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  setLanguage: (l: LangCode) => void;
  setMode: (m: "self" | "bystander") => void;
  setCategory: (c: string) => void;
  setAnswer: (k: keyof Answers, v: Answer) => void;
  startListening: () => void;
  detectLocation: () => void;
  selectHospital: (id: string) => void;
  requestReception: () => void;
  decide: (d: Decision) => void;
  setHospitalStatus: (id: string, s: ReceivingStatus) => void;
  runQuickDemo: () => void;
  reset: () => void;
}

const LifeLinkContext = createContext<Ctx | null>(null);

function blankCase(): CaseData {
  return {
    tempId: "LL-000000",
    language: "en",
    mode: "self",
    category: null,
    answers: {},
    transcript: [],
    location: null,
    hospitalId: null,
    decision: "none",
    step: 0,
    etaSec: 0,
  };
}

export function LifeLinkProvider({ children }: { children: ReactNode }) {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(HOSPITALS);
  const [data, setData] = useState<CaseData>(blankCase);
  const [listening, setListening] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
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

  const bump = useCallback((step: number) => {
    setData((d) => (step > d.step ? { ...d, step } : d));
  }, []);

  const openEmergency = useCallback(() => {
    setData((d) => (d.step === 0 ? { ...blankCase(), tempId: makeTempId(), step: 1 } : d));
    setDashboardOpen(false);
    setEmergencyOpen(true);
  }, []);

  const closeEmergency = useCallback(() => setEmergencyOpen(false), []);
  const openDashboard = useCallback(() => {
    setEmergencyOpen(false);
    setDashboardOpen(true);
  }, []);
  const closeDashboard = useCallback(() => setDashboardOpen(false), []);

  const setLanguage = useCallback((language: LangCode) => setData((d) => ({ ...d, language })), []);
  const setMode = useCallback(
    (mode: "self" | "bystander") => setData((d) => ({ ...d, mode })),
    [],
  );
  const setCategory = useCallback((category: string) => {
    setData((d) => ({ ...d, category }));
  }, []);
  const setAnswer = useCallback((k: keyof Answers, v: Answer) => {
    setData((d) => ({ ...d, answers: { ...d.answers, [k]: v } }));
  }, []);

  const startListening = useCallback(() => {
    setListening(true);
    const lines = TRANSCRIPTS[data.language];
    setData((d) => ({ ...d, transcript: [] }));
    lines.forEach((line, i) => {
      later(() => setData((d) => ({ ...d, transcript: [...d.transcript, line] })), 900 * (i + 1));
    });
    later(() => {
      setListening(false);
      setData((d) => ({
        ...d,
        category: d.category ?? "road",
        answers: {
          conscious: d.answers.conscious ?? "no",
          breathing: d.answers.breathing ?? "yes",
          bleeding: d.answers.bleeding ?? "yes",
          injuries: d.answers.injuries ?? "yes",
        },
      }));
      bump(2);
    }, 900 * (lines.length + 1));
  }, [data.language, later, bump]);

  const detectLocation = useCallback(() => {
    setData((d) => ({ ...d, location: "NH-44 Highway Junction, Sector 7 (approx. ±40 m)" }));
  }, []);

  const selectHospital = useCallback((hospitalId: string) => {
    setData((d) => ({ ...d, hospitalId }));
  }, []);

  const requestReception = useCallback(() => {
    setData((d) => ({ ...d, decision: "pending", step: Math.max(d.step, 3) }));
  }, []);

  const decide = useCallback(
    (decision: Decision) => {
      setData((d) => {
        if (decision === "accepted") {
          const h = HOSPITALS.find((x) => x.id === d.hospitalId);
          return { ...d, decision, step: Math.max(d.step, 4), etaSec: (h?.etaMin ?? 8) * 60 };
        }
        return { ...d, decision };
      });
      if (decision === "accepted") {
        later(() => bump(5), 2500);
        later(() => bump(6), 6000);
      }
    },
    [later, bump],
  );

  const setHospitalStatus = useCallback((id: string, status: ReceivingStatus) => {
    setHospitals((hs) => hs.map((h) => (h.id === id ? { ...h, status } : h)));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setListening(false);
    setDemoRunning(false);
    setData(blankCase());
    setHospitals(HOSPITALS);
  }, [clearTimers]);

  // ETA countdown while the hospital is preparing.
  useEffect(() => {
    if (data.decision !== "accepted" || data.etaSec <= 0 || data.step >= 7) return;
    const id = window.setInterval(() => {
      setData((d) => ({ ...d, etaSec: Math.max(0, d.etaSec - 1) }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [data.decision, data.etaSec, data.step]);

  const runQuickDemo = useCallback(() => {
    clearTimers();
    setDemoRunning(true);
    setHospitals(HOSPITALS);
    setData({ ...blankCase(), tempId: makeTempId(), language: "te", mode: "bystander", step: 1 });
    setDashboardOpen(false);
    setEmergencyOpen(true);

    const lines = TRANSCRIPTS.te;
    later(() => setListening(true), 500);
    lines.forEach((line, i) => {
      later(() => setData((d) => ({ ...d, transcript: [...d.transcript, line] })), 900 + 800 * i);
    });
    later(() => {
      setListening(false);
      setData((d) => ({
        ...d,
        category: "road",
        answers: { conscious: "no", breathing: "yes", bleeding: "yes", injuries: "yes" },
        step: 2,
      }));
    }, 900 + 800 * lines.length);
    later(
      () =>
        setData((d) => ({
          ...d,
          location: "NH-44 Highway Junction, Sector 7 (approx. ±40 m)",
        })),
      1700 + 800 * lines.length,
    );
    later(() => setData((d) => ({ ...d, hospitalId: "alpha" })), 2400 + 800 * lines.length);
    later(
      () => setData((d) => ({ ...d, decision: "pending", step: 3 })),
      3100 + 800 * lines.length,
    );
    later(() => setDashboardOpen(true), 3900 + 800 * lines.length);
    later(() => {
      setDashboardOpen(false);
      setData((d) => ({ ...d, decision: "accepted", step: 4, etaSec: 8 * 60 }));
    }, 6200 + 800 * lines.length);
    later(() => setData((d) => ({ ...d, step: 5 })), 8200 + 800 * lines.length);
    later(() => {
      setData((d) => ({ ...d, step: 6 }));
      setDemoRunning(false);
    }, 10500 + 800 * lines.length);
  }, [clearTimers, later]);

  const value = useMemo<Ctx>(
    () => ({
      emergencyOpen,
      dashboardOpen,
      hospitals,
      data,
      listening,
      demoRunning,
      openEmergency,
      closeEmergency,
      openDashboard,
      closeDashboard,
      setLanguage,
      setMode,
      setCategory,
      setAnswer,
      startListening,
      detectLocation,
      selectHospital,
      requestReception,
      decide,
      setHospitalStatus,
      runQuickDemo,
      reset,
    }),
    [
      emergencyOpen,
      dashboardOpen,
      hospitals,
      data,
      listening,
      demoRunning,
      openEmergency,
      closeEmergency,
      openDashboard,
      closeDashboard,
      setLanguage,
      setMode,
      setCategory,
      setAnswer,
      startListening,
      detectLocation,
      selectHospital,
      requestReception,
      decide,
      setHospitalStatus,
      runQuickDemo,
      reset,
    ],
  );

  return <LifeLinkContext.Provider value={value}>{children}</LifeLinkContext.Provider>;
}

export function useLifeLink() {
  const ctx = useContext(LifeLinkContext);
  if (!ctx) throw new Error("useLifeLink must be used inside LifeLinkProvider");
  return ctx;
}
