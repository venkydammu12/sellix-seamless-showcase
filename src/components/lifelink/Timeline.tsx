import { TIMELINE_STEPS } from "@/lib/lifelink-data";
import { useLifeLink } from "@/lib/lifelink-store";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Timeline() {
  const { data, hospitals } = useLifeLink();
  const hospital = hospitals.find((h) => h.id === data.hospitalId);

  return (
    <div className="ll-timeline">
      {data.decision === "accepted" && (
        <div className="ll-ack">
          <strong>Hospital acknowledged.</strong>
          <span>
            {hospital?.name} is preparing for {data.tempId}. Live ETA {fmt(data.etaSec)}
          </span>
        </div>
      )}
      {data.decision === "unable" && (
        <div className="ll-ack ll-ack-warn">
          <strong>{hospital?.name} cannot receive.</strong>
          <span>Choose another participating hospital below.</span>
        </div>
      )}
      <ol className="ll-steps">
        {TIMELINE_STEPS.map((label, i) => {
          const state = data.step > i + 1 ? "done" : data.step === i + 1 ? "active" : "todo";
          return (
            <li key={label} className={`ll-step ll-step-${state}`}>
              <span className="ll-step-dot" aria-hidden="true" />
              <span className="ll-step-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
