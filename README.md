# 🌙 Sleepmaxxing — Biohacking Sleep OS

A minimalist, high-performance sleep optimization application built with **React Native (Expo)**, **TypeScript**, and **JetBrains Mono** for **iPhone** and the web.

---

## ⚡ Key Features

1. **Monolithic Sleep Score & Statuses:**
   * `Sleep God 👑` (92–100 pts)
   * `Bio-Optimized ⚡` (82–91 pts)
   * `Functional Rest 🔋` (70–81 pts)
   * `Sleep Deprived ⚠️` (55–69 pts)
   * `Walking Zombie 💀` (<55 pts)

2. **Sleep Matrix (GitHub-Style Contribution Heatmap):**
   * 70 compact day tiles (`14×14 px`) representing 10 weeks of sleep history.
   * Color-coded from Deep Crisis Crimson (`<60`) to Peak Emerald (`92+ Sleep God`).
   * Interactive Day Inspector displaying exact score, duration, Deep %, REM %, and HRV.

3. **Apple Watch Hypnogram (SVG):**
   * Timeline stages: **Awake**, **REM** (cognition & memory), **Core** (restorative rest), **Deep** (growth hormone & recovery).

4. **Biomarker Grid:**
   * **HRV (SDNN)** in milliseconds (autonomic nervous system tone).
   * **Resting Heart Rate (RHR)** in BPM (cardiovascular recovery).
   * **Sleep Debt** (accumulated balance vs 8h ideal).
   * **Wrist Temperature Deviation** in °C (core body temperature drop).

5. **Circadian Windows & Biohack Checklist:**
   * Morning sunlight anchor, caffeine cut-off deadline, last meal deadline, digital sunset, and melatonin onset.
   * Interactive evening protocol checklist (Magnesium L-Threonate, L-Theanine, 18°C Cold Room, 100% Blackout, Mouth Tape, Blue-blockers).

---

## 🚀 How to Run on Windows

### Option 1. One-Click Launcher:
Run [`start.bat`](file:///C:/Users/florzyk/sleepmaxxing-app/start.bat) in the project folder:
* Press `1` — to run on your physical iPhone via **Expo Go** (QR code).
* Press `2` — to preview instantly in your browser (`localhost:8081`).

### Option 2. Terminal (PowerShell):

**For iPhone (Expo Go):**
```powershell
$env:Path = "C:\Users\florzyk\AppData\Local\Programs\nodejs;" + $env:Path
cd C:\Users\florzyk\sleepmaxxing-app
npx expo start --tunnel
```

**For Browser:**
```powershell
$env:Path = "C:\Users\florzyk\AppData\Local\Programs\nodejs;" + $env:Path
cd C:\Users\florzyk\sleepmaxxing-app
npx expo start --web
```
