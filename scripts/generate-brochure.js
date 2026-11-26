const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read logo
const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
const logoBase64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : '';
const logoDataUri = logoBase64 ? `data:image/png;base64,${logoBase64}` : '';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hack On-Line 2027 // Official Sponsorship Prospectus</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #050508;
      color: #f1f5f9;
      line-height: 1.45;
      font-size: 9pt;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: #050508;
      padding: 14mm 16mm 13mm 16mm;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
    }

    @media print {
      body {
        background: #050508;
      }
      .page {
        border-bottom: none;
      }
    }

    /* Ambient Glows */
    .glow-cyan {
      position: absolute;
      width: 140mm;
      height: 140mm;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
      pointer-events-none;
      z-index: 1;
    }

    .glow-violet {
      position: absolute;
      width: 140mm;
      height: 140mm;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
      pointer-events-none;
      z-index: 1;
    }

    /* Laser Grid Overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 16mm 16mm;
      pointer-events-none;
      z-index: 1;
    }

    .content-layer {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Running Header */
    .hud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2.5mm;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .hud-header .telemetry-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #38bdf8;
      font-weight: 700;
    }

    .hud-header .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    /* Running Footer */
    .hud-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2.5mm;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      color: #64748b;
      letter-spacing: 0.08em;
    }

    .hud-footer .page-indicator {
      font-weight: 800;
      color: #38bdf8;
    }

    /* Typography */
    h1, h2, h3, h4 {
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      color: #ffffff;
      letter-spacing: -0.025em;
    }

    .eyebrow-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #38bdf8;
      margin-bottom: 1.5mm;
    }

    .main-section-title {
      font-size: 20pt;
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 2mm;
    }

    .main-section-lead {
      font-size: 8.5pt;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 4mm;
      max-width: 95%;
    }

    /* Cyber Card Panels */
    .cyber-card {
      background: rgba(15, 17, 26, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 3.5mm 4mm;
      position: relative;
      overflow: hidden;
    }

    .cyber-card-highlight {
      background: linear-gradient(135deg, rgba(20, 24, 38, 0.95) 0%, rgba(12, 14, 22, 0.95) 100%);
      border: 1px solid rgba(6, 182, 212, 0.35);
      border-radius: 8px;
      padding: 3.5mm 4mm;
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.08);
      position: relative;
    }

    /* Badges */
    .cyber-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: inline-block;
    }

    .badge-cyan {
      background: rgba(6, 182, 212, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(6, 182, 212, 0.4);
    }

    .badge-emerald {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .badge-violet {
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.4);
    }

    .badge-amber {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }

    .badge-pink {
      background: rgba(236, 72, 153, 0.15);
      color: #f472b6;
      border: 1px solid rgba(236, 72, 153, 0.4);
    }

    /* ========================================================
       PAGE 1: MONOLITHIC CYBER COVER
       ======================================================== */
    .cover-masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 4mm;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.15);
    }

    .cover-brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cover-logo-graphic {
      width: 40px;
      height: 40px;
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.5));
    }

    .cover-brand-title {
      font-family: 'Syne', sans-serif;
      font-size: 17pt;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .cover-top-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.35);
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.08em;
    }

    .cover-hero-box {
      margin-top: 10mm;
      margin-bottom: 6mm;
    }

    .cover-monolithic-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40pt;
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 3.5mm;
      text-transform: uppercase;
    }

    .cover-monolithic-title span {
      background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-deck-line {
      font-family: 'Inter', sans-serif;
      font-size: 11.5pt;
      font-weight: 400;
      color: #cbd5e1;
      line-height: 1.5;
      max-width: 92%;
      margin-bottom: 8mm;
    }

    .cover-stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
      margin-bottom: 7mm;
    }

    .cover-stat-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 4mm 3mm;
      position: relative;
      overflow: hidden;
    }

    .cover-stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
    }

    .cover-stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 19pt;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
      margin-bottom: 1.5mm;
    }

    .cover-stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .cover-stat-sub {
      font-size: 6.8pt;
      color: #34d399;
      font-weight: 600;
      margin-top: 1mm;
    }

    .cover-pillars-wrapper {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 5mm;
    }

    .cover-pillars-headline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      font-weight: 800;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 3.5mm;
    }

    .cover-pillars-flex {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4.5mm;
    }

    .cover-pillar-card h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1mm;
    }

    .cover-pillar-card p {
      font-size: 7.8pt;
      color: #94a3b8;
      line-height: 1.4;
    }

    .cover-bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 4mm;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 7.2pt;
      color: #94a3b8;
    }

    .cover-bottom-bar strong {
      color: #ffffff;
      font-size: 8.5pt;
      display: block;
      margin-bottom: 0.5mm;
    }

    /* ========================================================
       PAGE 2: THE 5 BATTLEGROUND TRACKS & GROUND RULES
       ======================================================== */
    .doctrine-strip-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3mm;
      margin-bottom: 5mm;
    }

    .doctrine-hud-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 2.5px solid #38bdf8;
      border-radius: 6px;
      padding: 3mm 3.5mm;
    }

    .doctrine-hud-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11pt;
      font-weight: 900;
      color: #38bdf8;
      line-height: 1;
      margin-bottom: 1mm;
    }

    .doctrine-hud-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1mm;
    }

    .doctrine-hud-desc {
      font-size: 7.2pt;
      color: #94a3b8;
      line-height: 1.4;
    }

    .arenas-vertical-stack {
      display: flex;
      flex-direction: column;
      gap: 2.8mm;
    }

    .arena-tech-row {
      background: rgba(15, 17, 26, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-left: 3.5px solid #38bdf8;
      border-radius: 6px;
      padding: 2.8mm 3.5mm;
      display: grid;
      grid-template-columns: 55mm 1fr;
      gap: 4mm;
      align-items: center;
    }

    .arena-left-meta {
      font-family: 'JetBrains Mono', monospace;
    }

    .arena-track-id {
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .arena-main-heading {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin-top: 0.5mm;
    }

    .arena-right-details p {
      font-size: 7.5pt;
      color: #cbd5e1;
      line-height: 1.35;
      margin-bottom: 1.5mm;
    }

    .arena-tag-cluster {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .arena-tech-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.2pt;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1px 5px;
      border-radius: 3px;
      color: #94a3b8;
    }

    /* ========================================================
       PAGE 3: AUDIENCE & SPONSOR VALUE
       ======================================================== */
    .demographics-dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5mm;
      margin-bottom: 4.5mm;
    }

    .dash-box {
      background: rgba(15, 17, 26, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 3.5mm 4mm;
    }

    .dash-box-header {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9pt;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 2.5mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 1.5mm;
    }

    .meter-row {
      margin-bottom: 2mm;
    }

    .meter-labels {
      display: flex;
      justify-content: space-between;
      font-size: 7.2pt;
      color: #cbd5e1;
      margin-bottom: 0.8mm;
    }

    .meter-rail {
      height: 5px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      overflow: hidden;
    }

    .meter-fill {
      height: 100%;
      border-radius: 3px;
    }

    .roi-four-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm;
    }

    .roi-panel {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 3mm 3.5mm;
      border-top: 2.5px solid #38bdf8;
    }

    .roi-panel h4 {
      font-size: 8.8pt;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1mm;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .roi-panel p {
      font-size: 7.5pt;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* ========================================================
       PAGE 4: THE CREW
       ======================================================== */
    .crew-cyber-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3mm;
    }

    .crew-cyber-card {
      background: rgba(15, 17, 26, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 3mm;
      display: flex;
      gap: 3mm;
      align-items: flex-start;
    }

    .crew-avatar-orb {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #090a10;
      border: 1.5px solid #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11pt;
      font-weight: 900;
      color: #ffffff;
      flex-shrink: 0;
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.25);
    }

    .crew-meta-box h4 {
      font-size: 9pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }

    .crew-meta-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      margin: 0.5mm 0 1mm 0;
    }

    .crew-meta-desc {
      font-size: 7.2pt;
      color: #94a3b8;
      line-height: 1.35;
    }

    /* ========================================================
       PAGE 5: SPONSORSHIP TIERS MATRIX
       ======================================================== */
    .tier-cards-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.8mm;
      margin-bottom: 3.5mm;
    }

    .tier-box {
      background: rgba(15, 17, 26, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 3mm 2.5mm;
      text-align: center;
    }

    .tier-box.vip {
      border: 1.5px solid #38bdf8;
      background: linear-gradient(180deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 17, 26, 0.85) 100%);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
    }

    .tier-box-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 10pt;
      font-weight: 800;
      color: #ffffff;
    }

    .tier-box-price {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11pt;
      font-weight: 900;
      color: #38bdf8;
      margin-top: 1mm;
    }

    .tier-box-slots {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.2pt;
      color: #34d399;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 0.5mm;
    }

    .matrix-cyber-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
    }

    .matrix-cyber-table th {
      background: #090a10;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 7.5pt;
      font-weight: 800;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 2mm 2.5mm;
      text-align: center;
    }

    .matrix-cyber-table th:first-child {
      text-align: left;
      width: 40%;
      background: #111422;
    }

    .matrix-cyber-table td {
      padding: 2mm 2.5mm;
      border: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
      color: #cbd5e1;
    }

    .matrix-cyber-table td:first-child {
      text-align: left;
      font-weight: 600;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.02);
    }

    .matrix-cyber-table tr:nth-child(even) td {
      background: rgba(255, 255, 255, 0.015);
    }

    .matrix-cyber-table .yes {
      color: #34d399;
      font-weight: 900;
      font-size: 8pt;
    }

    .matrix-cyber-table .no {
      color: #475569;
      font-size: 8pt;
    }

    /* ========================================================
       PAGE 6: ENGAGEMENT PROTOCOL & DIRECT LINES
       ======================================================== */
    .timeline-four-cols {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
      margin-bottom: 5mm;
    }

    .step-hud-card {
      background: rgba(15, 17, 26, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 3mm;
      position: relative;
    }

    .step-hud-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #38bdf8;
    }

    .step-num-big {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15pt;
      font-weight: 900;
      color: #38bdf8;
      line-height: 1;
      margin-bottom: 1mm;
    }

    .step-card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8.5pt;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1mm;
    }

    .step-card-body {
      font-size: 7.2pt;
      color: #94a3b8;
      line-height: 1.35;
    }

    .executive-contact-banner {
      background: linear-gradient(135deg, rgba(20, 24, 38, 0.95) 0%, rgba(10, 12, 18, 0.95) 100%);
      border: 1.5px solid rgba(6, 182, 212, 0.4);
      border-radius: 8px;
      padding: 5mm 6mm;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      margin-bottom: 4mm;
    }

    .contact-banner-header {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13pt;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.5mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contact-banner-sub {
      font-size: 8pt;
      color: #94a3b8;
      line-height: 1.45;
      margin-bottom: 4mm;
    }

    .contact-direct-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 3.5mm 4mm;
    }

    .direct-officer-item {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
    }

    .direct-officer-item .post {
      color: #64748b;
      font-size: 6.5pt;
      text-transform: uppercase;
    }

    .direct-officer-item .name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9.5pt;
      font-weight: 800;
      color: #ffffff;
      margin: 0.5mm 0;
    }

    .direct-officer-item .email {
      color: #38bdf8;
      font-weight: 700;
    }

    .terminal-closing-quote {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 3px solid #10b981;
      padding: 2.5mm 3.5mm;
      color: #94a3b8;
      line-height: 1.4;
    }
  </style>
</head>
<body>

  <!-- ========================================================
       PAGE 1: MONOLITHIC CYBER COVER
       ======================================================== -->
  <div class="page">
    <div class="glow-cyan" style="top: -20mm; right: -20mm;"></div>
    <div class="glow-violet" style="bottom: 10mm; left: -20mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="cover-masthead">
        <div class="cover-brand-logo">
          ${logoDataUri ? `<img src="${logoDataUri}" alt="Logo" class="cover-logo-graphic">` : ''}
          <span class="cover-brand-title">HACK ON-LINE</span>
        </div>
        <div class="cover-top-badge">
          GLOBAL PROSPECTUS // ISSUE 2027
        </div>
      </div>

      <div class="cover-hero-box">
        <div class="eyebrow-tag">
          <span style="color:#10b981;">●</span>
          <span>THE PREMIER 24-HOUR VIRTUAL DEVELOPER SPRINT</span>
        </div>

        <div class="cover-monolithic-title">
          WHERE TOP BUILDERS<br><span>ACTUALLY SHIP.</span>
        </div>

        <div class="cover-deck-line">
          Hack On-Line is a high-velocity developer engineering competition connecting 2,500+ top software architects, systems builders, and AI researchers with forward-thinking tech enterprises. Zero pitch-deck theater. Fresh Git commits only. 100% builder IP ownership.
        </div>

        <div class="cover-stat-grid">
          <div class="cover-stat-card">
            <div class="cover-stat-value">2,500+</div>
            <div class="cover-stat-label">Vetted Engineers</div>
            <div class="cover-stat-sub">Premier Tech Hubs</div>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-value">24:00</div>
            <div class="cover-stat-label">Live Sprint</div>
            <div class="cover-stat-sub">Synchronous Ingest</div>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-value">5 Tracks</div>
            <div class="cover-stat-label">Deep-Tech Arenas</div>
            <div class="cover-stat-sub">T-15m Decryption</div>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-value">100%</div>
            <div class="cover-stat-label">Builder IP Rights</div>
            <div class="cover-stat-sub">Zero Equity Taken</div>
          </div>
        </div>

        <div class="cover-pillars-wrapper">
          <div class="cover-pillars-headline">// WHY LEADING TECH COMPANIES PARTNER WITH US</div>
          <div class="cover-pillars-flex">
            <div class="cover-pillar-card">
              <h4>Direct Code-First Hiring</h4>
              <p>Evaluate candidates by inspecting actual live Git pull requests, system architectures, and code hygiene written under pressure.</p>
            </div>
            <div class="cover-pillar-card">
              <h4>API & Developer Tool Adoption</h4>
              <p>Challenge hundreds of engineering teams to build production-grade prototypes with your SDKs, APIs, and cloud services.</p>
            </div>
            <div class="cover-pillar-card">
              <h4>Engineering Mindshare</h4>
              <p>Position your company as an authentic technology leader championing real engineering meritocracy and open innovation.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="cover-bottom-bar">
        <div>
          <strong>JANUARY 30–31, 2027 // 100% VIRTUAL</strong>
          <span>Primary Portals: Unstop & GitHub Organization</span>
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 6.8pt; text-align: right;">
          <span>CONFIDENTIAL PARTNERSHIP PACKET</span><br>
          <span style="color:#38bdf8;">HACK ON-LINE EXECUTIVE STEERING COMMITTEE</span>
        </div>
      </div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 2: DOCTRINE & THE 5 PROBLEM ARENAS
       ======================================================== -->
  <div class="page">
    <div class="glow-cyan" style="top: 40mm; left: -30mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="hud-header">
        <div class="telemetry-pill">
          <span class="live-dot"></span>
          <span>01 // ARCHITECTURE & SECTORS</span>
        </div>
        <div>HACK ON-LINE 2027</div>
      </div>

      <div style="margin-top: 3mm;">
        <div class="eyebrow-tag">THE ANTI-PITCH-DECK DOCTRINE</div>
        <h2 class="main-section-title">Built for Production, Not Slides</h2>
        <div class="main-section-lead">
          Traditional hackathons have become marketing theater where teams rehearse three-minute presentations with zero working code. Hack On-Line enforces unyielding operational rules designed to benchmark real engineering execution.
        </div>

        <div class="doctrine-strip-grid">
          <div class="doctrine-hud-box">
            <div class="doctrine-hud-num">01</div>
            <div class="doctrine-hud-title">The Empty Repo Mandate</div>
            <div class="doctrine-hud-desc">Every team initializes an empty repository at 10:00 AM IST. Automated Git commit history inspections and AST difference checkers ensure all code is authored during the sprint.</div>
          </div>

          <div class="doctrine-hud-box" style="border-top-color:#10b981;">
            <div class="doctrine-hud-num" style="color:#10b981;">02</div>
            <div class="doctrine-hud-title">100% Builder Sovereign IP</div>
            <div class="doctrine-hud-desc">We take zero equity and claim zero IP rights. Builders retain complete ownership, which attracts serious founders, open-source maintainers, and top-tier senior developers.</div>
          </div>

          <div class="doctrine-hud-box" style="border-top-color:#8b5cf6;">
            <div class="doctrine-hud-num" style="color:#8b5cf6;">03</div>
            <div class="doctrine-hud-title">T-15m Decryption Protocol</div>
            <div class="doctrine-hud-desc">Specific challenge requirements and rubric benchmarks remain encrypted until fifteen minutes prior to kickoff (09:45 AM IST), ensuring zero back-channel rehearsals.</div>
          </div>
        </div>

        <div class="eyebrow-tag" style="margin-top: 2mm;">THE 5 DEEP-TECH ARENAS</div>
        <div class="arenas-vertical-stack">
          <!-- Track 01 -->
          <div class="arena-tech-row" style="border-left-color: #10b981;">
            <div class="arena-left-meta">
              <span class="cyber-badge badge-emerald">TRACK 01 // AGTECH</span>
              <div class="arena-main-heading">Precision Agriculture & Sensor Meshes</div>
            </div>
            <div class="arena-right-details">
              <p>Edge IoT sensor meshes, automated irrigation dispatch, computer vision crop pathogen diagnostics, drone payload telemetry, and climate-resilient yield optimization.</p>
              <div class="arena-tag-cluster">
                <span class="arena-tech-tag">LoRaWAN / MQTT</span>
                <span class="arena-tech-tag">Offline MobileNet</span>
                <span class="arena-tech-tag">Satellite NDVI</span>
                <span class="arena-tech-tag">Soil Moisture Telemetry</span>
              </div>
            </div>
          </div>

          <!-- Track 02 -->
          <div class="arena-tech-row" style="border-left-color: #ec4899;">
            <div class="arena-left-meta">
              <span class="cyber-badge badge-pink">TRACK 02 // HEALTH</span>
              <div class="arena-main-heading">Clinical Intelligence & Bio-Computing</div>
            </div>
            <div class="arena-right-details">
              <p>Point-of-care clinical diagnostics, on-device biometric signal processing (ECG/PPG), privacy-preserving patient records, and real-time medical triage pipelines.</p>
              <div class="arena-tag-cluster">
                <span class="arena-tech-tag">FHIR & HL7 Adapters</span>
                <span class="arena-tech-tag">Edge Signal DSP</span>
                <span class="arena-tech-tag">Quantized TFLite</span>
                <span class="arena-tech-tag">Federated Learning</span>
              </div>
            </div>
          </div>

          <!-- Track 03 -->
          <div class="arena-tech-row" style="border-left-color: #06b6d4;">
            <div class="arena-left-meta">
              <span class="cyber-badge badge-cyan">TRACK 03 // SPACE</span>
              <div class="arena-main-heading">Aerospace Telemetry & Satellite Edge</div>
            </div>
            <div class="arena-right-details">
              <p>CubeSat flight computer architectures, orbital trajectory prediction, open space debris tracking, delay-tolerant satellite mesh networks, and onboard SAR imagery.</p>
              <div class="arena-tag-cluster">
                <span class="arena-tech-tag">SGP4 Ephemeris</span>
                <span class="arena-tech-tag">Bundle Protocol (DTN)</span>
                <span class="arena-tech-tag">Rust Embedded RTOS</span>
                <span class="arena-tech-tag">SAR Flood Mapping</span>
              </div>
            </div>
          </div>

          <!-- Track 04 -->
          <div class="arena-tech-row" style="border-left-color: #8b5cf6;">
            <div class="arena-left-meta">
              <span class="cyber-badge badge-violet">TRACK 04 // CRYPTO</span>
              <div class="arena-main-heading">Zero-Knowledge & Privacy Protocols</div>
            </div>
            <div class="arena-right-details">
              <p>High-integrity verifiable computation, zero-knowledge proofs, privacy-preserving rollups, decentralized identity schemes, and trust-minimized peer-to-peer protocols.</p>
              <div class="arena-tag-cluster">
                <span class="arena-tech-tag">Circom & Noir</span>
                <span class="arena-tech-tag">Zk-SNARK Circuits</span>
                <span class="arena-tech-tag">State Proofs</span>
                <span class="arena-tech-tag">Encrypted Mempools</span>
              </div>
            </div>
          </div>

          <!-- Track 05 -->
          <div class="arena-tech-row" style="border-left-color: #f59e0b;">
            <div class="arena-left-meta">
              <span class="cyber-badge badge-amber">TRACK 05 // CLIMATE</span>
              <div class="arena-main-heading">Clean Energy Grids & Marginal Carbon</div>
            </div>
            <div class="arena-right-details">
              <p>Renewable energy demand-response dispatch, distributed micro-grid load balancing, real-time carbon intensity telemetry, and planetary sensor meshes.</p>
              <div class="arena-tag-cluster">
                <span class="arena-tech-tag">Time-Series Telemetry</span>
                <span class="arena-tech-tag">Smart Inverter MQTT</span>
                <span class="arena-tech-tag">Carbon Intensity APIs</span>
                <span class="arena-tech-tag">Storage Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hud-footer">
        <div>HACK ON-LINE 2027 // SPONSORSHIP PACKET</div>
        <div>DOCTRINE & ARENAS</div>
        <div class="page-indicator">PAGE 02 OF 06</div>
      </div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 3: AUDIENCE & SPONSOR ROI
       ======================================================== -->
  <div class="page">
    <div class="glow-violet" style="top: 20mm; right: -30mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="hud-header">
        <div class="telemetry-pill">
          <span class="live-dot"></span>
          <span>02 // AUDIENCE & SPONSOR VALUE</span>
        </div>
        <div>HACK ON-LINE 2027</div>
      </div>

      <div style="margin-top: 3.5mm;">
        <div class="eyebrow-tag">TALENT SPECTRUM & DEMOGRAPHICS</div>
        <h2 class="main-section-title">The Engineers Companies Want to Hire</h2>
        <div class="main-section-lead">
          Hack On-Line convenes 2,500+ builders across premier engineering institutions and autonomous developer ecosystems. Sponsoring provides an unfiltered channel into verified technical talent.
        </div>

        <div class="demographics-dashboard">
          <div class="dash-box">
            <div class="dash-box-header">
              <span>TECHNICAL SPECIALIZATIONS</span>
              <span style="font-family:'JetBrains Mono'; font-size:7pt; color:#38bdf8;">2,500+ BUILDERS</span>
            </div>

            <div class="meter-row">
              <div class="meter-labels">
                <span>Distributed Systems & Full-Stack</span>
                <strong style="color:#38bdf8;">38%</strong>
              </div>
              <div class="meter-rail"><div class="meter-fill" style="width: 38%; background: #38bdf8;"></div></div>
            </div>

            <div class="meter-row">
              <div class="meter-labels">
                <span>AI / Machine Learning & Computer Vision</span>
                <strong style="color:#34d399;">28%</strong>
              </div>
              <div class="meter-rail"><div class="meter-fill" style="width: 28%; background: #34d399;"></div></div>
            </div>

            <div class="meter-row">
              <div class="meter-labels">
                <span>Cloud Infra, DevOps & Security</span>
                <strong style="color:#c084fc;">16%</strong>
              </div>
              <div class="meter-rail"><div class="meter-fill" style="width: 16%; background: #c084fc;"></div></div>
            </div>

            <div class="meter-row">
              <div class="meter-labels">
                <span>Embedded IoT, Firmware & Robotics</span>
                <strong style="color:#fbbf24;">10%</strong>
              </div>
              <div class="meter-rail"><div class="meter-fill" style="width: 10%; background: #fbbf24;"></div></div>
            </div>

            <div class="meter-row">
              <div class="meter-labels">
                <span>Zero-Knowledge & Crypto Systems</span>
                <strong style="color:#f472b6;">8%</strong>
              </div>
              <div class="meter-rail"><div class="meter-fill" style="width: 8%; background: #f472b6;"></div></div>
            </div>
          </div>

          <div class="dash-box">
            <div class="dash-box-header">
              <span>ACADEMIC & COMMUNITY REACH</span>
              <span style="font-family:'JetBrains Mono'; font-size:7pt; color:#34d399;">PAN-INDIA & GLOBAL</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:2.5mm; font-size:7.5pt;">
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:2.5mm; border-radius:5px;">
                <strong style="color:#38bdf8; display:block; font-size:8.2pt;">Tier-1 Engineering Institutions</strong>
                Participants represent leading institutes including IITs (Bombay, Delhi, Madras, Kharagpur), NITs, BITS Pilani, IIITs, and select international virtual hubs.
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:2.5mm; border-radius:5px;">
                <strong style="color:#34d399; display:block; font-size:8.2pt;">Pre-Screened Capability</strong>
                Participants self-select for a rigorous 24-hour sprint that explicitly forbids slide decks, filtering out passive attendees and attracting high-output builders.
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:2.5mm; border-radius:5px;">
                <strong style="color:#c084fc; display:block; font-size:8.2pt;">Multidisciplinary Teams</strong>
                Average team size of 3 builders with balanced architectures: Systems Backend, Modern Frontend, and Domain AI/Data specialists.
              </div>
            </div>
          </div>
        </div>

        <div class="eyebrow-tag">STRATEGIC RETURN ON INVESTMENT</div>
        <div class="roi-four-grid">
          <div class="roi-panel">
            <h4>
              <span style="color:#38bdf8;">01 //</span> Direct Code-First Hiring
            </h4>
            <p>Skip generic resume keyword matching. Evaluate candidates based on live Git commit velocity, pull request hygiene, and real architectural defense presentations.</p>
          </div>

          <div class="roi-panel" style="border-top-color:#34d399;">
            <h4>
              <span style="color:#34d399;">02 //</span> Developer Tool & API Ingest
            </h4>
            <p>Challenge hundreds of developers to deploy your APIs, cloud services, and developer SDKs under pressure, generating working open-source reference implementations.</p>
          </div>

          <div class="roi-panel" style="border-top-color:#c084fc;">
            <h4>
              <span style="color:#c084fc;">03 //</span> Dedicated Problem Bounties
            </h4>
            <p>Frame a sponsored track addressing your enterprise's active technical bottlenecks. Walk away with dozens of creative, functional prototypes within 24 hours.</p>
          </div>

          <div class="roi-panel" style="border-top-color:#fbbf24;">
            <h4>
              <span style="color:#fbbf24;">04 //</span> Premium Developer Mindshare
            </h4>
            <p>Showcase your technical leadership via opening keynote addresses, live technical workshops, and direct multi-channel marketing to 50,000+ developer impressions.</p>
          </div>
        </div>
      </div>

      <div class="hud-footer">
        <div>HACK ON-LINE 2027 // SPONSORSHIP PACKET</div>
        <div>DEMOGRAPHICS & VALUE</div>
        <div class="page-indicator">PAGE 03 OF 06</div>
      </div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 4: THE ORGANIZING CREW
       ======================================================== -->
  <div class="page">
    <div class="glow-cyan" style="bottom: 10mm; right: -30mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="hud-header">
        <div class="telemetry-pill">
          <span class="live-dot"></span>
          <span>03 // THE GOVERNING COMMITTEE</span>
        </div>
        <div>HACK ON-LINE 2027</div>
      </div>

      <div style="margin-top: 3.5mm;">
        <div class="eyebrow-tag">EXECUTIVE LEADERSHIP</div>
        <h2 class="main-section-title">Governed by Technical Engineers</h2>
        <div class="main-section-lead">
          Hack On-Line is steered by developers and operations architects who hold the event to rigorous technical and institutional standards, ensuring flawless partner execution.
        </div>

        <div class="crew-cyber-grid">
          <!-- Hriday Bardia -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#ff8c66; color:#ff8c66;">HB</div>
            <div class="crew-meta-box">
              <h4>Hriday Bardia</h4>
              <div class="crew-meta-role">Lead Organizing Director</div>
              <div class="crew-meta-desc">Overseeing overarching hackathon strategy, institutional execution, schedule rigor, and global developer experience across 24H.</div>
            </div>
          </div>

          <!-- Khush Salecha -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#06b6d4; color:#06b6d4;">KS</div>
            <div class="crew-meta-box">
              <h4>Khush Salecha</h4>
              <div class="crew-meta-role">Head of Operations & Logistics</div>
              <div class="crew-meta-desc">Directing virtual pipeline execution, synchronous schedule coordination, timeline governance, and platform reliability.</div>
            </div>
          </div>

          <!-- K Jitesh Kumar Reddy -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#8b5cf6; color:#8b5cf6;">KR</div>
            <div class="crew-meta-box">
              <h4>K Jitesh Kumar Reddy</h4>
              <div class="crew-meta-role">Head of Technical Evaluation</div>
              <div class="crew-meta-desc">Architecting automated Git commit validation, benchmark parameters, and rubric calibration for engineering jury panels.</div>
            </div>
          </div>

          <!-- Varad Kanade -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#10b981; color:#10b981;">VK</div>
            <div class="crew-meta-box">
              <h4>Varad Kanade</h4>
              <div class="crew-meta-role">Head of Engineering Systems</div>
              <div class="crew-meta-desc">Managing high-availability submission portals, live scoreboards, API mock environments, and real-time infrastructure.</div>
            </div>
          </div>

          <!-- Narayan Priyadarshi -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#f59e0b; color:#f59e0b;">NP</div>
            <div class="crew-meta-box">
              <h4>Narayan Priyadarshi</h4>
              <div class="crew-meta-role">Head of Dev Community</div>
              <div class="crew-meta-desc">Leading developer engagement, participant support, mentor coordination, and round-the-clock builder assistance.</div>
            </div>
          </div>

          <!-- Ayush Singh Chauhan -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#ff8c66; color:#ff8c66;">AC</div>
            <div class="crew-meta-box">
              <h4>Ayush Singh Chauhan</h4>
              <div class="crew-meta-role">Head of Strategic Partnerships</div>
              <div class="crew-meta-desc">Driving strategic corporate alliances, industry reviewer networks, university chapters, and sponsor value delivery.</div>
            </div>
          </div>

          <!-- Ved Raj -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#06b6d4; color:#06b6d4;">VR</div>
            <div class="crew-meta-box">
              <h4>Ved Raj</h4>
              <div class="crew-meta-role">Lead Operations Support</div>
              <div class="crew-meta-desc">Directing live participant escalation triage, technical support pipelines, environment diagnostics, and operational logistics.</div>
            </div>
          </div>

          <!-- Satwik Kumar Guru -->
          <div class="crew-cyber-card">
            <div class="crew-avatar-orb" style="border-color:#8b5cf6; color:#8b5cf6;">SG</div>
            <div class="crew-meta-box">
              <h4>Satwik Kumar Guru</h4>
              <div class="crew-meta-role">Technical Operations Support</div>
              <div class="crew-meta-desc">Supporting builder environment setups, continuous runtime diagnostic verification, submission ingest, and escalation resolution.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="hud-footer">
        <div>HACK ON-LINE 2027 // SPONSORSHIP PACKET</div>
        <div>EXECUTIVE LEADERSHIP</div>
        <div class="page-indicator">PAGE 04 OF 06</div>
      </div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 5: SPONSORSHIP TIERS MATRIX
       ======================================================== -->
  <div class="page">
    <div class="glow-cyan" style="top: -20mm; left: -20mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="hud-header">
        <div class="telemetry-pill">
          <span class="live-dot"></span>
          <span>04 // PARTNERSHIP SYNDICATE</span>
        </div>
        <div>HACK ON-LINE 2027</div>
      </div>

      <div style="margin-top: 3.5mm;">
        <div class="eyebrow-tag">SPONSORSHIP PACKAGES</div>
        <h2 class="main-section-title">Transparent, High-Yield Partnership Tiers</h2>
        <div class="main-section-lead">
          We offer structured partnership tiers tailored to your talent acquisition targets, developer API adoption goals, and brand leadership priorities.
        </div>

        <div class="tier-cards-row">
          <div class="tier-box vip">
            <span class="cyber-badge badge-cyan" style="margin-bottom:1mm;">TITLE PARTNER</span>
            <div class="tier-box-name">Visionary</div>
            <div class="tier-box-price">₹5,00,000</div>
            <div class="tier-box-slots">EXCLUSIVE (1 SLOT)</div>
          </div>

          <div class="tier-box">
            <span class="cyber-badge badge-violet" style="margin-bottom:1mm;">PLATINUM</span>
            <div class="tier-box-name">Innovator</div>
            <div class="tier-box-price">₹2,50,000</div>
            <div class="tier-box-slots">LIMITED (2 SLOTS)</div>
          </div>

          <div class="tier-box">
            <span class="cyber-badge badge-emerald" style="margin-bottom:1mm;">GOLD</span>
            <div class="tier-box-name">Accelerator</div>
            <div class="tier-box-price">₹1,25,000</div>
            <div class="tier-box-slots">LIMITED (4 SLOTS)</div>
          </div>

          <div class="tier-box">
            <span class="cyber-badge badge-amber" style="margin-bottom:1mm;">SILVER</span>
            <div class="tier-box-name">Ecosystem</div>
            <div class="tier-box-price">₹60,000</div>
            <div class="tier-box-slots">FLEXIBLE</div>
          </div>
        </div>

        <table class="matrix-cyber-table">
          <thead>
            <tr>
              <th>DELIVERABLES MATRIX</th>
              <th style="background:#0284c7; color:#ffffff;">TITLE (₹5L)</th>
              <th>PLATINUM (₹2.5L)</th>
              <th>GOLD (₹1.25L)</th>
              <th>SILVER (₹60K)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Official Co-Branding ("Presented by [Brand]")</td>
              <td class="yes">✓ EXCLUSIVE</td>
              <td class="no">—</td>
              <td class="no">—</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Dedicated Problem Track & Naming Rights</td>
              <td class="yes">✓ FULL TRACK</td>
              <td class="yes">✓ BOUNTY TRACK</td>
              <td class="no">—</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Keynote Speaking Slot at Opening / Closing</td>
              <td class="yes">15 MINS</td>
              <td class="yes">8 MINS</td>
              <td class="no">—</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Pre-Hackathon Technical Workshop / Product Demo</td>
              <td class="yes">✓ 45 MINS</td>
              <td class="yes">✓ 30 MINS</td>
              <td class="yes">✓ 15 MINS</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Complete Opt-In Resume Book & Git Dossiers</td>
              <td class="yes">✓ ALL BUILDERS</td>
              <td class="yes">✓ ALL BUILDERS</td>
              <td class="yes">TOP 100 TEAMS</td>
              <td class="yes">TOP 25 TEAMS</td>
            </tr>
            <tr>
              <td>Direct Fast-Track Hiring & Interview Ingest</td>
              <td class="yes">✓ UNLIMITED</td>
              <td class="yes">✓ PRIORITY</td>
              <td class="yes">✓ STANDARD</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Evaluation Jury & Finalist Judge Seats</td>
              <td class="yes">4 JUDGES</td>
              <td class="yes">2 JUDGES</td>
              <td class="yes">1 JUDGE</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Dedicated Discord & Slack Mentor Channels</td>
              <td class="yes">✓ DEDICATED</td>
              <td class="yes">✓ DEDICATED</td>
              <td class="yes">✓ SHARED</td>
              <td class="yes">✓ SHARED</td>
            </tr>
            <tr>
              <td>Sponsored API / Developer Tool Bounty Track</td>
              <td class="yes">✓ INCLUDED</td>
              <td class="yes">✓ INCLUDED</td>
              <td class="yes">✓ OPTIONAL</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Digital Logo Visibility & Media Impressions</td>
              <td class="yes">TIER L1 (MAX)</td>
              <td class="yes">TIER L2</td>
              <td class="yes">TIER L3</td>
              <td class="yes">TIER L4</td>
            </tr>
            <tr>
              <td>Targeted Direct Email & Social Announcements</td>
              <td class="yes">3 BLASTS</td>
              <td class="yes">2 BLASTS</td>
              <td class="yes">1 BLAST</td>
              <td class="no">—</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 3.5mm; font-size: 7.2pt; color: #94a3b8; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 2.5mm 3.5mm;">
          <strong style="color: #38bdf8;">Custom In-Kind & Tooling Partnerships:</strong> We actively partner with cloud providers, API platforms, and hardware manufacturers offering compute credits (AWS/GCP/Azure), API tokens, dev tools, or participant hardware kits.
        </div>
      </div>

      <div class="hud-footer">
        <div>HACK ON-LINE 2027 // SPONSORSHIP PACKET</div>
        <div>TIERS & MATRIX</div>
        <div class="page-indicator">PAGE 05 OF 06</div>
      </div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 6: ENGAGEMENT PROTOCOL & DIRECT LINES
       ======================================================== -->
  <div class="page">
    <div class="glow-violet" style="bottom: -20mm; right: -20mm;"></div>
    <div class="grid-overlay"></div>

    <div class="content-layer">
      <div class="hud-header">
        <div class="telemetry-pill">
          <span class="live-dot"></span>
          <span>05 // ENGAGEMENT PROTOCOL</span>
        </div>
        <div>HACK ON-LINE 2027</div>
      </div>

      <div style="margin-top: 3.5mm;">
        <div class="eyebrow-tag">ONBOARDING TIMELINE</div>
        <h2 class="main-section-title">Streamlined Partner Integration</h2>
        <div class="main-section-lead">
          Our organizing team manages all logistical, technical, and promotional workflows to make partnership execution seamless and time-efficient.
        </div>

        <div class="timeline-four-cols">
          <div class="step-hud-card">
            <div class="step-num-big">01</div>
            <div class="step-card-title">Discovery Call</div>
            <div class="step-card-body">A 20-minute briefing to align on talent acquisition goals, API integrations, and sector selection.</div>
          </div>

          <div class="step-hud-card">
            <div class="step-num-big">02</div>
            <div class="step-card-title">Track Calibration</div>
            <div class="step-card-body">Co-authoring challenge prompts, API documentation links, and rubric evaluation benchmarks.</div>
          </div>

          <div class="step-hud-card">
            <div class="step-num-big">03</div>
            <div class="step-card-title">Developer Ingest</div>
            <div class="step-card-body">Broadcasting your brand to 2,500+ builders via targeted announcements and pre-event workshops.</div>
          </div>

          <div class="step-hud-card">
            <div class="step-num-big">04</div>
            <div class="step-card-title">Live Sprint & Handoff</div>
            <div class="step-card-body">Keynote delivery, live mentoring, judging defense, and instant delivery of candidate dossiers and code.</div>
          </div>
        </div>

        <div class="executive-contact-banner">
          <div class="contact-banner-header">
            <span>PARTNER WITH HACK ON-LINE 2027</span>
            <span style="font-family:'JetBrains Mono'; font-size:7.5pt; color:#38bdf8;">JANUARY 30–31, 2027</span>
          </div>
          <div class="contact-banner-sub">
            Secure your track presence and gain direct access to premier engineering talent. Connect with our organizing leadership directly:
          </div>

          <div class="contact-direct-grid">
            <div class="direct-officer-item">
              <div class="post">Lead Organizing Director</div>
              <div class="name">Hriday Bardia</div>
              <div class="email">hridaybardia07@gmail.com</div>
              <div style="color: #94a3b8; font-size: 6.5pt; margin-top: 0.5mm;">Strategy, Governance & Institutional Alliances</div>
            </div>

            <div class="direct-officer-item">
              <div class="post">Head of Strategic Partnerships</div>
              <div class="name">Ayush Singh Chauhan</div>
              <div class="email">ayushchauhan2707@gmail.com</div>
              <div style="color: #94a3b8; font-size: 6.5pt; margin-top: 0.5mm;">Sponsor Onboarding & Corporate Deliverables</div>
            </div>
          </div>

          <div style="margin-top: 3.5mm; padding-top: 2.5mm; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 6.8pt; color: #94a3b8;">
            <span>WEB: https://hack-on-line.com</span>
            <span>PORTAL: Unstop & GitHub</span>
            <span>FORMAT: 100% Virtual Global Sprint</span>
          </div>
        </div>

        <div class="terminal-closing-quote">
          <span style="color:#10b981; font-weight:800;">$</span> "Software is not written in presentation slides. It is forged in terminal windows, tested under pressure, and proven in commits. Join us in setting a higher bar for the global engineering community."
        </div>
      </div>

      <div class="hud-footer">
        <div>HACK ON-LINE 2027 // SPONSORSHIP PACKET</div>
        <div>ONBOARDING & CONTACT</div>
        <div class="page-indicator">PAGE 06 OF 06</div>
      </div>
    </div>
  </div>

</body>
</html>
`;

// Write HTML
const outputHtmlPath = path.join(__dirname, '..', 'public', 'brochure.html');
fs.writeFileSync(outputHtmlPath, htmlContent, 'utf8');
console.log('Luxury cyber brochure HTML written to:', outputHtmlPath);

// Render to PDF using Headless Chrome
const tempPdfPath = path.join(process.env.TEMP || 'C:\\Users\\HRIDAY\\AppData\\Local\\Temp', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');
const publicPdfPath = path.join(__dirname, '..', 'public', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');
const rootPdfPath = path.join(__dirname, '..', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlUrl = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

console.log('Compiling luxury cyber PDF via Chrome headless...');
const cmd = `"${chromePath}" --headless --disable-gpu --no-sandbox "--print-to-pdf=${tempPdfPath}" --no-pdf-header-footer "${htmlUrl}"`;
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(tempPdfPath)) {
  fs.copyFileSync(tempPdfPath, publicPdfPath);
  fs.copyFileSync(tempPdfPath, rootPdfPath);
  console.log('PDF successfully compiled:');
  console.log(' - Public path:', publicPdfPath, `(${fs.statSync(publicPdfPath).size} bytes)`);
  console.log(' - Root path:', rootPdfPath, `(${fs.statSync(rootPdfPath).size} bytes)`);
} else {
  console.error('Failed to compile PDF.');
  process.exit(1);
}
