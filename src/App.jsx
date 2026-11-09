import React, { useState, useMemo } from "react";
import {
  Activity,
  Radio,
  ShieldAlert,
  HeartPulse,
  Thermometer,
  Moon,
  Brain,
  Zap,
  Sliders,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MISSION_PRESETS, evaluateCrewTriage } from "./data/telemetryData";
import AstronautBodyMap from "./components/AstronautBodyMap";

export default function App() {
  const [presetKey, setPresetKey] = useState("nominal");
  const [vitals, setVitals] = useState(MISSION_PRESETS.nominal.vitals);
  const [commDelay, setCommDelay] = useState(MISSION_PRESETS.nominal.commDelayMinutes);
  const [selectedZone, setSelectedZone] = useState("neuro");
  const [completedChecks, setCompletedChecks] = useState({});

  const currentPreset = MISSION_PRESETS[presetKey];

  const handlePresetChange = (key) => {
    setPresetKey(key);
    setVitals(MISSION_PRESETS[key].vitals);
    setCommDelay(MISSION_PRESETS[key].commDelayMinutes);
  };

  const updateVital = (field, value) => {
    setVitals((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const toggleSelfExamCheck = (key, forceValue) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [key]: forceValue !== undefined ? forceValue : !prev[key],
    }));
  };

  const triage = useMemo(
    () => evaluateCrewTriage(vitals, commDelay),
    [vitals, commDelay]
  );

  const exportTelemetryPacket = () => {
    const packet = {
      system: "AstraTriage Autonomous Biomedical Telemetry",
      timestampUTC: new Date().toISOString(),
      missionScenario: currentPreset.label,
      oneWayCommDelayMinutes: commDelay,
      roundTripLatencyMinutes: commDelay * 2,
      triageAssessment: triage,
      biometricReadings: vitals,
      completedSelfExamProtocols: Object.keys(completedChecks).filter((k) => completedChecks[k]),
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AstraTriage_Packet_Day${currentPreset.missionDay}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const bannerStyles = {
    CRITICAL: "bg-red-950/80 border-red-500/60 text-red-100",
    ADVISORY: "bg-amber-950/80 border-amber-500/60 text-amber-100",
    NOMINAL: "bg-emerald-950/60 border-emerald-500/40 text-emerald-100",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Top Mission Control Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <Activity className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AstraTriage</h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  NASA HRP v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Crew Biomedical & Deep-Space Triage Telemetry
              </p>
            </div>
          </div>

          {/* Scenario Presets + Export Packet */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.values(MISSION_PRESETS).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  presetKey === preset.id
                    ? "bg-sky-500 text-slate-950 border-sky-400 font-semibold"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                {preset.label}
              </button>
            ))}

            <button
              onClick={exportTelemetryPacket}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 transition"
              title="Download Flight Surgeon JSON Telemetry Packet"
            >
              <Download className="w-3.5 h-3.5" />
              Export DSN Packet
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Deep-Space Comm Delay & Autonomous Triage Banner */}
        <section className={`rounded-xl border p-4 transition-colors ${bannerStyles[triage.level]}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider opacity-80">
                  Triage Status: {triage.level} • One-Way Light Delay: {commDelay} min
                </div>
                <div className="font-semibold text-sm sm:text-base">
                  {triage.alerts.length > 0
                    ? triage.alerts[0].title
                    : "All Biomedical & Dosimetry Indicators Within NASA HRP Nominal Bounds"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>{triage.earthSyncStatus}</span>
            </div>
          </div>

          {triage.alerts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 grid sm:grid-cols-2 gap-2">
              {triage.alerts.map((alert, i) => (
                <div key={i} className="text-xs bg-black/25 rounded-lg p-2.5 border border-white/10">
                  <span className="font-bold uppercase mr-1.5">[{alert.severity}]</span>
                  <span className="font-medium">{alert.title}:</span>{" "}
                  <span className="opacity-90">{alert.action}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Core Vitals Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <VitalCard
            icon={<HeartPulse className="w-4 h-4 text-rose-400" />}
            label="Heart Rate"
            value={`${vitals.heartRate} bpm`}
            range="60–85 bpm"
            alert={vitals.heartRate > 85}
          />
          <VitalCard
            icon={<Activity className="w-4 h-4 text-sky-400" />}
            label="Blood Pressure"
            value={`${vitals.systolicBP}/${vitals.diastolicBP}`}
            range="110/70–125/80"
            alert={vitals.systolicBP > 125 || vitals.systolicBP < 105}
          />
          <VitalCard
            icon={<Zap className="w-4 h-4 text-amber-400" />}
            label="30d Radiation"
            value={`${vitals.radiationDose} mSv`}
            range="< 50 mSv"
            alert={vitals.radiationDose >= 40}
          />
          <VitalCard
            icon={<Moon className="w-4 h-4 text-indigo-400" />}
            label="Circadian Sleep"
            value={`${vitals.sleepHours} hrs`}
            range="7.0–8.5 hrs"
            alert={vitals.sleepHours < 6.8}
          />
          <VitalCard
            icon={<Thermometer className="w-4 h-4 text-emerald-400" />}
            label="Core Temp"
            value={`${vitals.bodyTemp} °C`}
            range="36.5–37.3 °C"
            alert={vitals.bodyTemp > 37.5}
          />
          <VitalCard
            icon={<Brain className="w-4 h-4 text-purple-400" />}
            label="Behavioral Index"
            value={`${vitals.moodScore}/10`}
            range="8–10 / 10"
            alert={vitals.moodScore < 7}
          />
        </section>

        {/* Interactive Body Map + Live Telemetry Simulator */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AstronautBodyMap
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              alerts={triage.alerts}
              completedChecks={completedChecks}
              onToggleCheck={toggleSelfExamCheck}
            />
          </div>

          {/* Interactive Live Sensor Simulator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Live Bio-Sensor Simulator
              </h2>
            </div>

            <SliderControl
              label="Heart Rate (bpm)"
              min={45}
              max={135}
              step={1}
              value={vitals.heartRate}
              onChange={(v) => updateVital("heartRate", v)}
            />
            <SliderControl
              label="Systolic BP (mmHg)"
              min={85}
              max={160}
              step={1}
              value={vitals.systolicBP}
              onChange={(v) => updateVital("systolicBP", v)}
            />
            <SliderControl
              label="30-Day Radiation (mSv)"
              min={5}
              max={80}
              step={0.5}
              value={vitals.radiationDose}
              onChange={(v) => updateVital("radiationDose", v)}
            />
            <SliderControl
              label="Sleep Duration (hrs)"
              min={3}
              max={9.5}
              step={0.1}
              value={vitals.sleepHours}
              onChange={(v) => updateVital("sleepHours", v)}
            />
            <SliderControl
              label="Mars Comm Delay (min)"
              min={1}
              max={22}
              step={1}
              value={commDelay}
              onChange={(v) => setCommDelay(Number(v))}
            />
          </div>
        </section>

        {/* 7-Day Telemetry Trend Chart */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                7-Day Multi-System Telemetry Trend (Mission Day {currentPreset.missionDay})
              </h2>
              <p className="text-xs text-slate-400">
                Tracks resting heart rate (bpm) and cumulative dosimetry (mSv) prior to current epoch
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentPreset.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hr"
                  name="Heart Rate (bpm)"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="rad"
                  name="Radiation (mSv)"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

function VitalCard({ icon, label, value, range, alert }) {
  return (
    <div
      className={`rounded-xl border p-3.5 transition ${
        alert
          ? "bg-amber-950/30 border-amber-500/50"
          : "bg-slate-900/90 border-slate-800"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[11px] font-mono text-slate-500 mt-1">HRP: {range}</div>
    </div>
  );
}

function SliderControl({ label, min, max, step, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-sky-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-sky-400 cursor-pointer"
      />
    </div>
  );
}