import React, { useState } from "react";
import { BODY_ZONES } from "../data/telemetryData";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  CheckSquare,
  Square,
  Eye,
  X,
} from "lucide-react";

export default function AstronautBodyMap({
  selectedZone,
  onSelectZone,
  alerts,
  completedChecks,
  onToggleCheck,
}) {
  const [showAmslerModal, setShowAmslerModal] = useState(false);
  const [amslerResult, setAmslerResult] = useState(null);

  const activeZone = BODY_ZONES.find((z) => z.id === selectedZone) || BODY_ZONES[0];

  const getZoneSeverity = (zoneId) => {
    const zoneAlerts = alerts.filter((a) => a.zone === zoneId);
    if (zoneAlerts.some((a) => a.severity === "red")) return "red";
    if (zoneAlerts.some((a) => a.severity === "yellow")) return "yellow";
    return "green";
  };

  const severityColors = {
    red: { fill: "#ef4444", stroke: "#fca5a5", badge: "bg-red-500/20 text-red-300 border-red-500/40" },
    yellow: { fill: "#f59e0b", stroke: "#fcd34d", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
    green: { fill: "#10b981", stroke: "#6ee7b7", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  };

  const activeSeverity = getZoneSeverity(activeZone.id);
  const zoneCompletedCount = activeZone.selfExam.filter(
    (_, idx) => completedChecks[`${activeZone.id}-${idx}`]
  ).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row gap-6 items-center relative">
      {/* Interactive SVG Silhouette */}
      <div className="relative flex flex-col items-center shrink-0">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
          Click Anatomical Hotspot
        </span>
        <svg viewBox="0 0 200 260" className="w-48 h-60 drop-shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <line x1="100" y1="5" x2="100" y2="255" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="86" x2="180" y2="86" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="186" x2="180" y2="186" stroke="#1e293b" strokeDasharray="3 3" />

          {/* Astronaut Silhouette */}
          <circle cx="100" cy="34" r="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="72" y="60" width="56" height="82" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="46" y="64" width="20" height="72" rx="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="134" y="64" width="20" height="72" rx="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="74" y="148" width="22" height="94" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="104" y="148" width="22" height="94" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

          {BODY_ZONES.map((zone) => {
            const sev = getZoneSeverity(zone.id);
            const isSelected = zone.id === activeZone.id;
            return (
              <g
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
              >
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={isSelected ? zone.r + 4 : zone.r}
                  fill={severityColors[sev].fill}
                  fillOpacity={isSelected ? "0.45" : "0.25"}
                  stroke={severityColors[sev].stroke}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                />
                <circle cx={zone.cx} cy={zone.cy} r="4" fill="#ffffff" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Zero-G Self-Exam Protocol Panel */}
      <div className="flex-1 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">{activeZone.name}</h3>
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${severityColors[activeSeverity].badge}`}
          >
            {activeSeverity === "red" && <ShieldAlert className="w-3.5 h-3.5" />}
            {activeSeverity === "yellow" && <AlertTriangle className="w-3.5 h-3.5" />}
            {activeSeverity === "green" && <CheckCircle2 className="w-3.5 h-3.5" />}
            {activeSeverity === "red"
              ? "ACTION REQUIRED"
              : activeSeverity === "yellow"
              ? "MONITOR CLOSELY"
              : "HRP NOMINAL"}
          </span>
        </div>

        <p className="text-xs font-mono text-sky-400 mb-3">
          HRP Focus: {activeZone.riskMetric}
        </p>

        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Autonomous Zero-G Self-Exam Log ({zoneCompletedCount}/{activeZone.selfExam.length})
            </span>

            {activeZone.id === "neuro" && (
              <button
                onClick={() => setShowAmslerModal(true)}
                className="text-xs font-mono px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                {amslerResult ? `SANS Grid: ${amslerResult}` : "Launch Amsler Grid Test"}
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {activeZone.selfExam.map((step, idx) => {
              const checkKey = `${activeZone.id}-${idx}`;
              const isChecked = !!completedChecks[checkKey];
              return (
                <li
                  key={idx}
                  onClick={() => onToggleCheck(checkKey)}
                  className={`text-sm flex items-start gap-2.5 p-2 rounded-md cursor-pointer transition select-none ${
                    isChecked
                      ? "bg-emerald-950/30 text-slate-400 line-through"
                      : "hover:bg-slate-900 text-slate-200"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  )}
                  <span>{step}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* SANS Amsler Grid Modal */}
      {showAmslerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">NASA SANS Amsler Grid Self-Check</h4>
              <button
                onClick={() => setShowAmslerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Cover one eye at a time and focus on the central white dot at 30 cm distance. Report whether all grid lines appear straight and perpendicular.
            </p>
            <div className="flex justify-center bg-slate-950 p-4 rounded-lg border border-slate-800">
              <svg viewBox="0 0 200 200" className="w-48 h-48 border border-sky-400/60">
                {Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1" />
                    <line x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1" />
                  </React.Fragment>
                ))}
                <circle cx="100" cy="100" r="4" fill="#ffffff" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setAmslerResult("NOMINAL");
                  onToggleCheck("neuro-0", true);
                  setShowAmslerModal(false);
                }}
                className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Lines Straight (Nominal)
              </button>
              <button
                onClick={() => {
                  setAmslerResult("DISTORTION FLAGGED");
                  onToggleCheck("neuro-0", true);
                  setShowAmslerModal(false);
                }}
                className="py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Wavy / Blurred (Flag SANS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}