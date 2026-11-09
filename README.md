# AstraTriage 🚀
**Autonomous Crew Biomedical & Deep-Space Triage Telemetry**  
*Built for the 2026 NASA Space Apps Challenge (Colombo Local Event)*

## 🌌 Overview
As crewed missions push deeper into deep space (Mars Transit & Lunar Outposts), Earth-to-space communication latency increases from minutes to over 22 minutes one-way. Mission controllers on Earth cannot provide instantaneous medical oversight during acute health events. 

**AstraTriage** is a NASA-aligned autonomous medical triage and telemetry dashboard designed to empower astronauts to monitor physiological health, execute zero-G self-exam protocols, manage Spaceflight Associated Neuro-ocular Syndrome (SANS) risks, and make life-saving triage decisions independently during deep-space communication blackouts.

---

## 🛠️ Technology Stack
* **Frontend:** React, Vite, Tailwind CSS v4
* **Telemetry & Analytics:** Recharts (Multi-system telemetry trends)
* **Icons:** Lucide React
* **Hosting & CI/CD:** Vercel

---

## 🔬 Core Features
1. **Autonomous Triage Engine:** Evaluates real-time astronaut vitals against NASA Human Research Program (HRP) thresholds and dynamically calculates Mars-Earth light delay round-trip communication lag.
2. **Interactive Anatomical Body Map:** Clickable SVG silhouette targeting critical microgravity risks (Neuro-ocular/SANS, Cardiovascular fluid shift, Radiation dosimetry, and Musculoskeletal bone density).
3. **Built-in SANS Amsler Grid Test:** Interactive ophthalmic self-check tool allowing astronauts to test visual distortion caused by fluid shifts in microgravity.
4. **Live Bio-Sensor Simulator:** Interactive sliders allowing judges and flight surgeons to simulate solar flare radiation spikes, tachycardia, or severe sleep deficits in real-time.
5. **DSN JSON Telemetry Packet Export:** Instantaneous export of flight-surgeon diagnostic data packages for autonomous logging.

---

## 🚀 Running Locally
```bash
git clone [https://github.com/HajaraAhmad/astratriage.git](https://github.com/HajaraAhmad/astratriage.git)
cd astratriage
npm install
npm run dev