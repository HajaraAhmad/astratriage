export const MISSION_PRESETS = {
  nominal: {
    id: "nominal",
    label: "Nominal Orbit (Day 45)",
    missionDay: 45,
    commDelayMinutes: 4,
    vitals: {
      heartRate: 68,
      systolicBP: 118,
      diastolicBP: 76,
      bloodGlucose: 92,
      bodyTemp: 36.8,
      sleepHours: 7.4,
      moodScore: 9,
      radiationDose: 18.4,
    },
    history: [
      { day: "D-6", hr: 66, rad: 12.1, sleep: 7.6 },
      { day: "D-5", hr: 69, rad: 13.0, sleep: 7.2 },
      { day: "D-4", hr: 67, rad: 14.2, sleep: 7.5 },
      { day: "D-3", hr: 70, rad: 15.1, sleep: 7.1 },
      { day: "D-2", hr: 68, rad: 16.3, sleep: 7.4 },
      { day: "D-1", hr: 67, rad: 17.2, sleep: 7.5 },
      { day: "Now", hr: 68, rad: 18.4, sleep: 7.4 },
    ],
  },
  solarFlare: {
    id: "solarFlare",
    label: "Solar Particle Alert (Day 82)",
    missionDay: 82,
    commDelayMinutes: 14,
    vitals: {
      heartRate: 98,
      systolicBP: 138,
      diastolicBP: 88,
      bloodGlucose: 122,
      bodyTemp: 37.3,
      sleepHours: 4.6,
      moodScore: 5,
      radiationDose: 64.2,
    },
    history: [
      { day: "D-6", hr: 71, rad: 31.0, sleep: 7.1 },
      { day: "D-5", hr: 73, rad: 32.4, sleep: 6.9 },
      { day: "D-4", hr: 75, rad: 34.1, sleep: 6.8 },
      { day: "D-3", hr: 78, rad: 36.5, sleep: 6.2 },
      { day: "D-2", hr: 84, rad: 42.0, sleep: 5.5 },
      { day: "D-1", hr: 91, rad: 53.8, sleep: 5.0 },
      { day: "Now", hr: 98, rad: 64.2, sleep: 4.6 },
    ],
  },
  deconditioning: {
    id: "deconditioning",
    label: "Mars Transit Fatigue (Day 140)",
    missionDay: 140,
    commDelayMinutes: 19,
    vitals: {
      heartRate: 88,
      systolicBP: 101,
      diastolicBP: 62,
      bloodGlucose: 72,
      bodyTemp: 36.5,
      sleepHours: 5.6,
      moodScore: 5,
      radiationDose: 46.5,
    },
    history: [
      { day: "D-6", hr: 74, rad: 41.2, sleep: 6.7 },
      { day: "D-5", hr: 76, rad: 42.1, sleep: 6.5 },
      { day: "D-4", hr: 79, rad: 43.0, sleep: 6.3 },
      { day: "D-3", hr: 81, rad: 43.9, sleep: 6.0 },
      { day: "D-2", hr: 84, rad: 44.8, sleep: 5.8 },
      { day: "D-1", hr: 86, rad: 45.6, sleep: 5.7 },
      { day: "Now", hr: 88, rad: 46.5, sleep: 5.6 },
    ],
  },
};

export const BODY_ZONES = [
  {
    id: "neuro",
    name: "Neuro-Ocular & SANS",
    cx: 100,
    cy: 34,
    r: 16,
    riskMetric: "Spaceflight Associated Neuro-ocular Syndrome (SANS) & Circadian Shift",
    selfExam: [
      "Complete 60-second Amsler Grid visual distortion check.",
      "Perform ocular ultrasound optic nerve sheath diameter (ONSD) scan.",
      "Enforce 480nm blue-light suppression 90 mins prior to sleep cycle.",
    ],
  },
  {
    id: "cardio",
    name: "Cardiovascular & Fluid Shift",
    cx: 100,
    cy: 86,
    r: 18,
    riskMetric: "Cephalad Fluid Shift & Orthostatic Intolerance",
    selfExam: [
      "Measure resting seated vs. thigh-cuff occluded blood pressure.",
      "Verify 2.5L daily electrolyte fluid-loading target.",
      "Complete 12-lead ECG patch impedance check.",
    ],
  },
  {
    id: "radiation",
    name: "Dosimetry & Immune Shielding",
    cx: 100,
    cy: 126,
    r: 17,
    riskMetric: "Galactic Cosmic Ray (GCR) & Solar Particle Event (SPE) Exposure",
    selfExam: [
      "Sync personal Tissue Equivalent Proportional Counter (TEPC) badge.",
      "Inspect poly-ethylene storm shelter water-wall shielding levels.",
      "Log salivary cortisol & latent viral reactivation swab.",
    ],
  },
  {
    id: "musculo",
    name: "Musculoskeletal & Bone Density",
    cx: 100,
    cy: 186,
    r: 20,
    riskMetric: "Microgravity Trabecular Bone Loss (1–1.5% / month) & Atrophy",
    selfExam: [
      "Verify 2-hour daily ARED resistive squat & deadlift load logs.",
      "Confirm Vitamin D3 (800 IU) & bisphosphonate protocol adherence.",
      "Assess lumbar spine decompression stiffness score.",
    ],
  },
];

// Autonomous Triage Engine based on NASA HRP thresholds
export function evaluateCrewTriage(vitals, commDelayMinutes) {
  const alerts = [];

  if (vitals.radiationDose > 50) {
    alerts.push({
      severity: "red",
      zone: "radiation",
      title: "30-Day Radiation Threshold Exceeded (>50 mSv)",
      action: "Relocate immediately to polyethylene-shielded storm shelter module.",
    });
  } else if (vitals.radiationDose >= 40) {
    alerts.push({
      severity: "yellow",
      zone: "radiation",
      title: "Elevated Cumulative Radiation Exposure (40–50 mSv)",
      action: "Minimize EVA duration and verify storm shelter readiness.",
    });
  }

  if (vitals.heartRate > 100 || vitals.heartRate < 50) {
    alerts.push({
      severity: "red",
      zone: "cardio",
      title: `Critical Resting Heart Rate (${vitals.heartRate} bpm)`,
      action: "Initiate resting 12-lead ECG capture and electrolyte bolus.",
    });
  } else if (vitals.heartRate > 85) {
    alerts.push({
      severity: "yellow",
      zone: "cardio",
      title: `Elevated Resting Heart Rate (${vitals.heartRate} bpm)`,
      action: "Check hydration status and defer high-load ARED session.",
    });
  }

  if (vitals.systolicBP > 140 || vitals.systolicBP < 95) {
    alerts.push({
      severity: "red",
      zone: "cardio",
      title: `Critical Blood Pressure (${vitals.systolicBP}/${vitals.diastolicBP} mmHg)`,
      action: "Administer orthostatic fluid-loading protocol and re-test in 15 mins.",
    });
  } else if (vitals.systolicBP > 125 || vitals.systolicBP < 105) {
    alerts.push({
      severity: "yellow",
      zone: "cardio",
      title: `Borderline Blood Pressure (${vitals.systolicBP}/${vitals.diastolicBP} mmHg)`,
      action: "Monitor cephalad fluid shift symptoms and log intake.",
    });
  }

  if (vitals.sleepHours < 5.5) {
    alerts.push({
      severity: "red",
      zone: "neuro",
      title: `Severe Circadian Sleep Deficit (${vitals.sleepHours} hrs)`,
      action: "Mandatory crew rest cycle + short-acting melatonin protocol.",
    });
  } else if (vitals.sleepHours < 6.8 || vitals.moodScore < 7) {
    alerts.push({
      severity: "yellow",
      zone: "neuro",
      title: "Behavioral / Circadian Fatigue Detected",
      action: "Schedule 20-min cognitive behavioral debrief & blue-light filter.",
    });
  }

  const hasRed = alerts.some((a) => a.severity === "red");
  const hasYellow = alerts.some((a) => a.severity === "yellow");
  const level = hasRed ? "CRITICAL" : hasYellow ? "ADVISORY" : "NOMINAL";

  return {
    level,
    alerts,
    roundTripDelay: commDelayMinutes * 2,
    earthSyncStatus:
      commDelayMinutes > 5
        ? `AUTONOMOUS MODE ACTIVE — Earth Flight Surgeon reply ETA: ${commDelayMinutes * 2} mins round-trip`
        : `DSN LINK NOMINAL — Telemetry synced (${commDelayMinutes * 2} mins round-trip)`,
  };
}