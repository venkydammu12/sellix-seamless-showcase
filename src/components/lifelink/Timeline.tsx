import { PHASE_META, TIMELINE_STEPS, UI } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

function fmt(sec: number) {
  const minutes = Math.floor(sec / 60);
  return `${minutes}:${String(sec % 60).padStart(2, "0")}`;
}

export function Timeline() {
  const { data, hospitals, advanceCoordination } = useLifeLink();
  const hospital = hospitals.find((item) => item.id === data.hospitalId);
  const currentStep = PHASE_META[data.phase].step;
  const t = UI[data.language];

  return (
    <div className="ll-timeline" aria-live="polite">
      {data.decision === "pending" && (
        <div className="ll-ack ll-ack-neutral">
          <strong>{t.requestSent}</strong>
          <span>This simulated request is waiting for a hospital-side decision.</span>
        </div>
      )}
      {data.decision === "review" && (
        <div className="ll-ack ll-ack-neutral">
          <strong>{t.reviewState}</strong>
          <span>No acceptance has been recorded.</span>
        </div>
      )}
      {data.decision === "accepted" && (
        <div className="ll-ack">
          <strong>{t.acceptedState}</strong>
          <span>
            {hospital?.name} · {t.estimatedEta} {fmt(data.etaSec)}
          </span>
          {data.phase !== "arrived" && (
            <button type="button" className="ll-text-action" onClick={advanceCoordination}>
              Advance simulated journey
            </button>
          )}
        </div>
      )}
      {data.decision === "unable" && (
        <div className="ll-ack ll-ack-warn">
          <strong>{hospital?.name} cannot receive this case.</strong>
          <span>{t.unableState}</span>
        </div>
      )}
      <ol className="ll-steps">
        {TIMELINE_STEPS.map((label, index) => {
          const number = index + 1;
          const state = currentStep > number ? "done" : currentStep === number ? "active" : "todo";
          return (
            <li key={label} className={`ll-step ll-step-${state}`} aria-current={state === "active" ? "step" : undefined}>
              <span className="ll-step-index" aria-hidden="true">{String(number).padStart(2, "0")}</span>
              <span className="ll-step-label">{label}</span>
              <span className="ll-step-state">{state === "done" ? "Complete" : state === "active" ? "Current" : "Pending"}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
