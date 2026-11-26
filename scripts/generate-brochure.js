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
  <title>Hack On-Line 2027 // Strategic Partnership Dossier</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

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
      font-family: 'Newsreader', 'Georgia', serif;
      background-color: #f8f9fa;
      color: #111827;
      line-height: 1.55;
      font-size: 9.2pt;
    }

    /* Page container: exact A4 */
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: #ffffff;
      padding: 16mm 20mm 15mm 20mm;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
    }

    @media print {
      body {
        background: transparent;
      }
      .page {
        border-bottom: none;
      }
    }

    /* Editorial Running Header */
    .editorial-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 3mm;
      border-bottom: 1.5px solid #111827;
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .editorial-header .bold-tag {
      font-weight: 800;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Editorial Running Footer */
    .editorial-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 3.5mm;
      border-top: 1px solid #111827;
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      color: #4b5563;
      letter-spacing: 0.08em;
    }

    .editorial-footer .page-count {
      font-weight: 800;
      color: #111827;
    }

    /* Typography */
    h1, h2, h3 {
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      color: #000000;
      letter-spacing: -0.03em;
    }

    .editorial-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #1e3a8a;
      display: block;
      margin-bottom: 2mm;
    }

    .editorial-title {
      font-size: 23pt;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.035em;
      color: #000000;
      margin-bottom: 3mm;
    }

    .editorial-lead {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 10.5pt;
      font-style: italic;
      color: #374151;
      line-height: 1.5;
      margin-bottom: 5mm;
      padding-bottom: 3mm;
      border-bottom: 0.5px solid #d1d5db;
    }

    /* 2-Column Newspaper Layout */
    .two-col-story {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8mm;
      text-align: justify;
      hyphens: auto;
    }

    .two-col-story p {
      margin-bottom: 3mm;
      font-size: 8.8pt;
      line-height: 1.55;
      color: #1f2937;
    }

    .dropcap::first-letter {
      float: left;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 34pt;
      line-height: 0.75;
      font-weight: 900;
      margin-right: 3mm;
      margin-top: 1mm;
      color: #000000;
    }

    .pull-quote {
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: 13.5pt;
      font-style: italic;
      line-height: 1.35;
      color: #000000;
      border-left: 2.5px solid #000000;
      padding-left: 4mm;
      margin: 4mm 0;
    }

    .field-note {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      line-height: 1.45;
      background: #f3f4f6;
      border-left: 2px solid #1e3a8a;
      padding: 3mm 3.5mm;
      margin: 3.5mm 0;
      color: #1f2937;
    }

    /* Editorial Thin Divider */
    .divider-thin {
      height: 0.5px;
      background: #d1d5db;
      margin: 4mm 0;
    }

    .divider-heavy {
      height: 2px;
      background: #000000;
      margin: 5mm 0;
    }

    /* ========================================================
       PAGE 1: COVER BROADSIDE (MAGAZINE COVER STYLE)
       ======================================================== */
    .cover-top-masthead {
      border-bottom: 3px double #000000;
      padding-bottom: 4mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .masthead-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .masthead-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .masthead-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #000000;
    }

    .masthead-issue {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      font-weight: 600;
      color: #4b5563;
      text-align: right;
      letter-spacing: 0.08em;
    }

    .cover-main-headline {
      margin-top: 8mm;
      margin-bottom: 5mm;
    }

    .headline-deck {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 800;
      letter-spacing: 0.16em;
      color: #1e3a8a;
      text-transform: uppercase;
      margin-bottom: 2mm;
    }

    .headline-huge {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 34pt;
      font-weight: 900;
      line-height: 1.0;
      letter-spacing: -0.04em;
      color: #000000;
      margin-bottom: 4mm;
    }

    .headline-sub {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 12pt;
      font-style: italic;
      color: #374151;
      line-height: 1.45;
      max-width: 95%;
      margin-bottom: 6mm;
    }

    .cover-story-summary {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 8mm;
      margin-top: 4mm;
      border-top: 1px solid #111827;
      padding-top: 5mm;
    }

    .cover-story-summary p {
      font-size: 9.5pt;
      line-height: 1.6;
      color: #1f2937;
      text-align: justify;
    }

    .cover-index-box {
      border-left: 1px solid #d1d5db;
      padding-left: 6mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
    }

    .index-header {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #111827;
      margin-bottom: 3mm;
      border-bottom: 1px solid #111827;
      padding-bottom: 1.5mm;
    }

    .index-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2.2mm;
      color: #4b5563;
    }

    .index-item span:first-child {
      color: #111827;
      font-weight: 600;
    }

    .cover-stats-ticker {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1.5px solid #111827;
      border-bottom: 1.5px solid #111827;
      padding: 4mm 0;
      margin-top: 6mm;
    }

    .stat-ticker-cell {
      padding: 0 4mm;
      border-right: 1px solid #e5e7eb;
    }

    .stat-ticker-cell:last-child {
      border-right: none;
    }

    .stat-ticker-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 19pt;
      font-weight: 800;
      color: #000000;
      line-height: 1;
      margin-bottom: 1mm;
    }

    .stat-ticker-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #4b5563;
      letter-spacing: 0.06em;
    }

    /* ========================================================
       PAGE 2: THE ANATOMY OF A CRUCIBLE
       ======================================================== */
    .pillar-narrative {
      margin-top: 4mm;
      display: flex;
      flex-direction: column;
      gap: 4mm;
    }

    .narrative-strip {
      border-top: 1px solid #111827;
      padding-top: 2.5mm;
      display: grid;
      grid-template-columns: 50mm 1fr;
      gap: 6mm;
    }

    .strip-meta {
      font-family: 'JetBrains Mono', monospace;
    }

    .strip-num {
      font-size: 14pt;
      font-weight: 900;
      color: #1e3a8a;
      line-height: 1;
      margin-bottom: 1mm;
    }

    .strip-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9pt;
      font-weight: 800;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .strip-prose p {
      font-size: 8.5pt;
      color: #27272a;
      line-height: 1.5;
    }

    /* ========================================================
       PAGE 3: THE 5 BATTLEGROUNDS
       ======================================================== */
    .arenas-list {
      display: flex;
      flex-direction: column;
      gap: 3.5mm;
      margin-top: 3mm;
    }

    .arena-entry {
      border-top: 1px solid #111827;
      padding-top: 2mm;
      display: grid;
      grid-template-columns: 55mm 1fr;
      gap: 6mm;
    }

    .arena-tag-col {
      font-family: 'JetBrains Mono', monospace;
    }

    .arena-code {
      font-size: 7.2pt;
      font-weight: 800;
      color: #1e3a8a;
    }

    .arena-title-main {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9.5pt;
      font-weight: 800;
      color: #000000;
      line-height: 1.25;
      margin-top: 0.5mm;
    }

    .arena-subhead {
      font-size: 7.2pt;
      color: #4b5563;
      margin-top: 1mm;
    }

    .arena-body-col p {
      font-size: 8.2pt;
      color: #374151;
      line-height: 1.45;
      margin-bottom: 1.5mm;
    }

    .arena-chips {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      color: #1e3a8a;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .arena-chips span {
      background: #f1f5f9;
      padding: 1.5px 5px;
      border-radius: 2px;
      border: 0.5px solid #cbd5e1;
    }

    /* ========================================================
       PAGE 4: THE DIRECTORATE & COHORT
       ======================================================== */
    .masthead-roster {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm 8mm;
      margin-top: 4mm;
      border-top: 1px solid #111827;
      padding-top: 4mm;
    }

    .roster-member {
      border-bottom: 0.5px dotted #9ca3af;
      padding-bottom: 2.5mm;
    }

    .roster-name-role {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1mm;
    }

    .roster-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9pt;
      font-weight: 800;
      color: #000000;
    }

    .roster-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      font-weight: 700;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .roster-bio {
      font-size: 7.5pt;
      color: #4b5563;
      line-height: 1.35;
    }

    /* Demographic breakdown editorial style */
    .editorial-metrics-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4mm;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 3.5mm;
      margin-top: 4mm;
    }

    .metric-cell strong {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11pt;
      color: #000000;
      margin-bottom: 0.5mm;
    }

    .metric-cell span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      color: #6b7280;
      text-transform: uppercase;
    }

    /* ========================================================
       PAGE 5: SPONSORSHIP SYNDICATE (CLEAN EDITORIAL TABLE)
       ======================================================== */
    .prospectus-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4mm;
      font-size: 7.8pt;
    }

    .prospectus-table th {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8pt;
      font-weight: 800;
      color: #000000;
      border-top: 2px solid #000000;
      border-bottom: 1.5px solid #000000;
      padding: 2.5mm 2mm;
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .prospectus-table td {
      padding: 2.2mm 2mm;
      border-bottom: 0.5px solid #e5e7eb;
      color: #1f2937;
      vertical-align: top;
    }

    .prospectus-table tr:hover td {
      background: #f9fafb;
    }

    .tier-title-col {
      font-weight: 800;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8.5pt;
      color: #000000;
    }

    .tier-investment-col {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      color: #1e3a8a;
      white-space: nowrap;
    }

    .tier-desc-col {
      font-size: 7.5pt;
      color: #4b5563;
      line-height: 1.4;
    }

    .tier-slots-col {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      color: #047857;
      white-space: nowrap;
    }

    .syndicate-rules {
      margin-top: 4mm;
      border-top: 1px solid #111827;
      padding-top: 3mm;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      font-size: 7.5pt;
      color: #4b5563;
    }

    .syndicate-rules strong {
      color: #000000;
      display: block;
      margin-bottom: 1mm;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8pt;
    }

    /* ========================================================
       PAGE 6: ENGAGEMENT PROTOCOL & DIRECT LINES
       ======================================================== */
    .protocol-steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4mm;
      border-top: 1px solid #111827;
      padding-top: 3.5mm;
      margin-top: 4mm;
      margin-bottom: 6mm;
    }

    .protocol-step-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16pt;
      font-weight: 900;
      color: #000000;
      line-height: 1;
      margin-bottom: 1.5mm;
    }

    .protocol-step-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 8.5pt;
      font-weight: 800;
      color: #000000;
      margin-bottom: 1mm;
    }

    .protocol-step-desc {
      font-size: 7.5pt;
      color: #4b5563;
      line-height: 1.4;
    }

    .executive-contact-editorial {
      border: 1.5px solid #111827;
      padding: 5mm 6mm;
      margin-bottom: 5mm;
      background: #fafafa;
    }

    .contact-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11pt;
      font-weight: 800;
      margin-bottom: 2mm;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      margin-top: 3mm;
    }

    .contact-card-ed {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
    }

    .contact-card-ed .title {
      font-size: 6.8pt;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
    }

    .contact-card-ed .name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9.5pt;
      font-weight: 800;
      color: #000000;
      margin: 0.5mm 0;
    }

    .contact-card-ed .email {
      color: #1e3a8a;
      font-weight: 700;
    }

    .manifesto-seal {
      border-top: 0.5px solid #d1d5db;
      padding-top: 3mm;
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: 10pt;
      color: #4b5563;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>

  <!-- ========================================================
       PAGE 1: THE BROADSIDE (MAGAZINE COVER / MANIFESTO COVER)
       ======================================================== -->
  <div class="page">
    <div class="cover-top-masthead">
      <div class="masthead-brand">
        ${logoDataUri ? `<img src="${logoDataUri}" alt="Logo" class="masthead-logo">` : ''}
        <span class="masthead-title">HACK ON-LINE</span>
      </div>
      <div class="masthead-issue">
        CONFIDENTIAL DOSSIER // ISSUE 2027.01<br>
        GLOBAL SPRINT DATE: JAN 30–31, 2027
      </div>
    </div>

    <div class="cover-main-headline">
      <div class="headline-deck">A PROSPECTUS FOR ENGINEERING LEADERS</div>
      <div class="headline-huge">THE END OF THE<br>SLIDE DECK.</div>
      <div class="headline-sub">
        How 2,500 engineers, 24 hours of live Git commits, and five deep-tech arenas are resetting the standard for corporate technical sponsorship.
      </div>
    </div>

    <div class="cover-story-summary">
      <div>
        <p class="dropcap">
          Most tech hackathons have devolved into theater. Teams arrive with pre-built repositories, tweak a front-end wrapper, rehearse a three-minute pitch deck, and walk away with awards while writing zero original code. Corporate sponsors sit at branded tables, hand out stickers, and return to their offices with a spreadsheet of parsed resumes from students who cannot debug a production service.
        </p>
        <p style="margin-top: 3mm;">
          Hack On-Line was engineered to kill that model. On January 30, 2027, 2,500+ verified builders enter a synchronized 24-hour sprint. Repositories must be initialized empty. Problem statements decrypt only fifteen minutes before the opening bell. Every pull request is timestamped and audited by automated AST verification engines and active industry engineering directors.
        </p>
      </div>

      <div class="cover-index-box">
        <div class="index-header">DOSSIER CONTENTS</div>
        <div class="index-item"><span>01. The Manifesto</span><span>PAGE 02</span></div>
        <div class="index-item"><span>02. The 5 Battlegrounds</span><span>PAGE 03</span></div>
        <div class="index-item"><span>03. The Builder Cohort</span><span>PAGE 04</span></div>
        <div class="index-item"><span>04. The Directorate</span><span>PAGE 04</span></div>
        <div class="index-item"><span>05. Sponsorship Syndicate</span><span>PAGE 05</span></div>
        <div class="index-item"><span>06. Protocol of Engagement</span><span>PAGE 06</span></div>

        <div style="margin-top: 5mm; border-top: 1px dotted #9ca3af; padding-top: 3mm; font-size: 6.8pt; color: #4b5563;">
          <strong>TARGET AUDIENCE:</strong> Chief Technology Officers, Heads of Talent, VP Engineering, Developer Relations Directors.
        </div>
      </div>
    </div>

    <div class="cover-stats-ticker">
      <div class="stat-ticker-cell">
        <div class="stat-ticker-num">2,500+</div>
        <div class="stat-ticker-label">Screened Engineers</div>
      </div>
      <div class="stat-ticker-cell">
        <div class="stat-ticker-num">24:00</div>
        <div class="stat-ticker-label">Continuous Sprint</div>
      </div>
      <div class="stat-ticker-cell">
        <div class="stat-ticker-num">0%</div>
        <div class="stat-ticker-label">Equity Extracted</div>
      </div>
      <div class="stat-ticker-cell">
        <div class="stat-ticker-num">100%</div>
        <div class="stat-ticker-label">Fresh Commits Only</div>
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>DISTRIBUTED & VIRTUAL</div>
      <div class="page-count">01 / 06</div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 2: ACT I & II — THE MANIFESTO & THE CRUCIBLE
       ======================================================== -->
  <div class="page">
    <div class="editorial-header">
      <div class="bold-tag">SECTION 01 // DOCTRINE & ARCHITECTURE</div>
      <div>THE GENESIS OF HACK ON-LINE</div>
    </div>

    <div style="margin-top: 4mm;">
      <span class="editorial-tag">ACT I: THE CRUCIBLE</span>
      <h2 class="editorial-title">Why Authentic Engineering Can't Be Faked</h2>
      <div class="editorial-lead">
        "If a developer cannot defend their architecture in a terminal, their slide deck is meaningless."
      </div>

      <div class="two-col-story">
        <div>
          <p class="dropcap">
            Software engineering is suffering from an authenticity deficit. In an era where generative tools can fabricate a functional prototype in forty seconds and polished keynote templates can mask fundamentally broken logic, traditional hiring and competition frameworks have broken down.
          </p>
          <p>
            When corporate leaders sponsor a hackathon, they are not seeking marketing theater. They need to answer three fundamental questions: Can this engineer construct reliable systems under severe temporal constraints? Do they understand edge-case failure modes? And how do they think when their primary framework crashes at midnight?
          </p>
          <div class="pull-quote">
            "We built Hack On-Line because we were tired of watching great engineers lose to charismatic presenters with zero code behind their demo."
          </div>
        </div>

        <div>
          <p>
            Hack On-Line is structured as an unyielding technical sprint. We impose constraints that mirror high-stakes production emergencies: zero prior preparation, synchronized global start times, and relentless peer scrutiny.
          </p>
          <p>
            Because we take zero equity and claim zero rights to participant intellectual property, the caliber of developers who participate is fundamentally different. Founders building real infrastructure, PhD students researching novel zero-knowledge cryptography, and systems programmers who refuse to participate in traditional collegiate hackathons make up our primary cohort.
          </p>
          <div class="field-note">
            <strong>THE CITADEL PROTOCOL:</strong> Every submission is mirrored across automated Git testing rigs. Repositories with anomalous commit histories (e.g., massive 10,000-line single-commit paste jobs) are quarantined by our evaluation engine before a human judge ever sees them.
          </div>
        </div>
      </div>

      <div class="divider-heavy"></div>

      <span class="editorial-tag">ACT II: THE FOUR OPERATIONAL LAWS</span>
      <div class="pillar-narrative">
        <div class="narrative-strip">
          <div class="strip-meta">
            <div class="strip-num">01</div>
            <div class="strip-name">The Empty Repo Law</div>
          </div>
          <div class="strip-prose">
            <p>Every team begins from an initialized blank Git branch at 10:00 AM IST. Pre-existing boilerplate, uncommitted private libraries, and cloned commercial codebases are strictly disqualified via automated AST comparison engines.</p>
          </div>
        </div>

        <div class="narrative-strip">
          <div class="strip-meta">
            <div class="strip-num">02</div>
            <div class="strip-name">T-15m Decryption</div>
          </div>
          <div class="strip-prose">
            <p>Specific challenge constraints and benchmark datasets remain cryptographically encrypted until fifteen minutes prior to the opening bell (09:45 AM IST), ensuring zero prior rehearsal or back-channel advantage.</p>
          </div>
        </div>

        <div class="narrative-strip">
          <div class="strip-meta">
            <div class="strip-num">03</div>
            <div class="strip-name">100% Builder Sovereign IP</div>
          </div>
          <div class="strip-prose">
            <p>We believe builders should own their sweat. Participants retain 100% open-source or commercial ownership of their work. This respect for creator autonomy is why top-tier developers choose our arena.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>DOCTRINE & ARCHITECTURE</div>
      <div class="page-count">02 / 06</div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 3: ACT III — THE FIVE BATTLEGROUNDS
       ======================================================== -->
  <div class="page">
    <div class="editorial-header">
      <div class="bold-tag">SECTION 02 // PROBLEM SECTORS</div>
      <div>THE FIVE BATTLEGROUNDS</div>
    </div>

    <div style="margin-top: 4mm;">
      <span class="editorial-tag">ACT III: THE FIVE BATTLEGROUNDS</span>
      <h2 class="editorial-title">Five Arenas. Real Crises. Zero Toys.</h2>
      <div class="editorial-lead">
        We do not assign generic prompts like "Build an app for mental wellness." We frame rigorous, deep-tech engineering bottlenecks where enterprise software meets physical, biological, or cryptographic reality.
      </div>

      <div class="arenas-list">
        <!-- ARENA 01 -->
        <div class="arena-entry">
          <div class="arena-tag-col">
            <div class="arena-code">SECTOR 01 // AGTECH</div>
            <div class="arena-title-main">Precision AgTech & Sensor Meshes</div>
            <div class="arena-subhead">Edge IoT • LoRaWAN • Crop CV</div>
          </div>
          <div class="arena-body-col">
            <p>
              <strong>The Crisis:</strong> Modern agricultural sensing is crippled by remote connectivity dropouts and high cloud latency. How do automated micro-irrigation valves and crop-pathogen vision models execute locally on solar-powered microcontrollers under zero-bandwidth constraints?
            </p>
            <div class="arena-chips">
              <span>MQTT Telemetry</span>
              <span>Lightweight MobileNet</span>
              <span>Soil Moisture Tension</span>
              <span>Satellite NDVI Ingest</span>
            </div>
          </div>
        </div>

        <!-- ARENA 02 -->
        <div class="arena-entry">
          <div class="arena-tag-col">
            <div class="arena-code">SECTOR 02 // HEALTHCARE</div>
            <div class="arena-title-main">Clinical Intelligence & Bio-Computing</div>
            <div class="arena-subhead">Edge Signal DSP • FHIR • Privacy</div>
          </div>
          <div class="arena-body-col">
            <p>
              <strong>The Crisis:</strong> High-risk medical telemetry (ECG/EEG) cannot be shipped to third-party cloud servers without severe HIPAA and patient privacy liability. Builders must architect on-device DSP triage filters and federated models that preserve total patient anonymity.
            </p>
            <div class="arena-chips">
              <span>FHIR / HL7 Adapters</span>
              <span>Quantized TFLite</span>
              <span>ECG Arrhythmia DSP</span>
              <span>Federated Learning</span>
            </div>
          </div>
        </div>

        <!-- ARENA 03 -->
        <div class="arena-entry">
          <div class="arena-tag-col">
            <div class="arena-code">SECTOR 03 // AEROSPACE</div>
            <div class="arena-title-main">Orbital Mechanics & Satellite Edge</div>
            <div class="arena-subhead">CubeSat RTOS • SGP4 • DTN</div>
          </div>
          <div class="arena-body-col">
            <p>
              <strong>The Crisis:</strong> Low-Earth orbit satellites experience contact windows as short as 6 minutes per pass. Teams build flight-software architectures using delay-tolerant protocols, orbital debris trajectory collision evaluators, and onboard synthetic aperture radar (SAR) flood mapping.
            </p>
            <div class="arena-chips">
              <span>SGP4 Ephemeris</span>
              <span>Bundle Protocol (DTN)</span>
              <span>Embedded Rust / RTOS</span>
              <span>SAR Flood Analytics</span>
            </div>
          </div>
        </div>

        <!-- ARENA 04 -->
        <div class="arena-entry">
          <div class="arena-tag-col">
            <div class="arena-code">SECTOR 04 // CRYPTOGRAPHY</div>
            <div class="arena-title-main">Zero-Knowledge & Privacy Protocols</div>
            <div class="arena-subhead">Circom / Noir • Account Abstraction</div>
          </div>
          <div class="arena-body-col">
            <p>
              <strong>The Crisis:</strong> Transparent distributed ledgers leak business logic, proprietary financial telemetry, and employee identities. Participants synthesize custom zk-SNARK circuits to prove correct computation and balance verification without exposing state data.
            </p>
            <div class="arena-chips">
              <span>Zk-SNARK Circuits</span>
              <span>Noir / Circom</span>
              <span>Encrypted Mempools</span>
              <span>Verifiable Random Beacons</span>
            </div>
          </div>
        </div>

        <!-- ARENA 05 -->
        <div class="arena-entry">
          <div class="arena-tag-col">
            <div class="arena-code">SECTOR 05 // CLIMATE</div>
            <div class="arena-title-main">Clean Energy Grids & Marginal Emissions</div>
            <div class="arena-subhead">Time-Series • Micro-Grid Load Balancing</div>
          </div>
          <div class="arena-body-col">
            <p>
              <strong>The Crisis:</strong> Massive compute clusters consume gigawatt-hours during peak fossil-fuel grid strain. Teams design dynamic dispatch schedulers that track real-time marginal carbon emissions and balance micro-solar batteries across distributed nodes.
            </p>
            <div class="arena-chips">
              <span>Smart Inverter MQTT</span>
              <span>Carbon Intensity APIs</span>
              <span>Peak-Load Storage Dispatch</span>
              <span>Urban Heat Mitigation</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>FIVE PROBLEM ARENAS</div>
      <div class="page-count">03 / 06</div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 4: ACT IV — THE BUILDERS & THE DIRECTORATE
       ======================================================== -->
  <div class="page">
    <div class="editorial-header">
      <div class="bold-tag">SECTION 03 // HUMAN CAPITAL & GOVERNANCE</div>
      <div>THE COHORT & THE DIRECTORATE</div>
    </div>

    <div style="margin-top: 4mm;">
      <span class="editorial-tag">ACT IV: THE COHORT</span>
      <h2 class="editorial-title">The Talent That Bypasses LinkedIn</h2>
      <div class="editorial-lead">
        The most capable engineers rarely respond to cold recruiter inboxes. They spend their weekends in high-velocity build environments. Sponsoring Hack On-Line places your engineering leadership inside the war room with them.
      </div>

      <div class="editorial-metrics-strip">
        <div class="metric-cell">
          <strong>38% Systems & Backend</strong>
          <span>Distributed primitives, Rust, Go, microservice resilience</span>
        </div>
        <div class="metric-cell">
          <strong>28% AI/ML & Vision</strong>
          <span>Edge model quantization, neural DSP, autonomous CV</span>
        </div>
        <div class="metric-cell">
          <strong>34% Infra, ZK & Hardware</strong>
          <span>Cloud architecture, zero-knowledge circuits, IoT firmware</span>
        </div>
      </div>

      <div class="divider-heavy" style="margin-top: 5mm; margin-bottom: 4mm;"></div>

      <span class="editorial-tag">THE GOVERNING DIRECTORATE</span>
      <div style="font-size: 8pt; color: #4b5563; margin-bottom: 2mm;">
        Hack On-Line is steered by active developers and operations architects who demand uncompromised institutional rigor:
      </div>

      <div class="masthead-roster">
        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Hriday Bardia</span>
            <span class="roster-role">Lead Organizing Director</span>
          </div>
          <div class="roster-bio">Executive direction, institutional strategy, evaluation governance, and global developer ecosystem orchestration.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Khush Salecha</span>
            <span class="roster-role">Head of Operations & Logistics</span>
          </div>
          <div class="roster-bio">Synchronous timeline execution, virtual pipeline reliability, and platform operational governance.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">K Jitesh Kumar Reddy</span>
            <span class="roster-role">Head of Technical Evaluation</span>
          </div>
          <div class="roster-bio">Automated Git commit audit systems, rubric calibration, and engineering jury panel governance.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Varad Kanade</span>
            <span class="roster-role">Head of Engineering Systems</span>
          </div>
          <div class="roster-bio">Submission infrastructure, high-availability live telemetry scoreboards, and platform resilience.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Narayan Priyadarshi</span>
            <span class="roster-role">Head of Dev Community</span>
          </div>
          <div class="roster-bio">Builder engagement, round-the-clock participant mentorship coordination, and developer advocacy.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Ayush Singh Chauhan</span>
            <span class="roster-role">Head of Strategic Partnerships</span>
          </div>
          <div class="roster-bio">Corporate ecosystem alliances, industry reviewer networks, and direct sponsor value realization.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Ved Raj</span>
            <span class="roster-role">Lead Operations Support</span>
          </div>
          <div class="roster-bio">Live participant escalation triage, technical helpdesk pipelines, and runtime operational support.</div>
        </div>

        <div class="roster-member">
          <div class="roster-name-role">
            <span class="roster-name">Satwik Kumar Guru</span>
            <span class="roster-role">Technical Operations Support</span>
          </div>
          <div class="roster-bio">Runtime diagnostics verification, submission ingest tracking, and developer troubleshooting.</div>
        </div>
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>BUILDERS & GOVERNANCE</div>
      <div class="page-count">04 / 06</div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 5: ACT V — THE PARTNERSHIP SYNDICATE
       ======================================================== -->
  <div class="page">
    <div class="editorial-header">
      <div class="bold-tag">SECTION 04 // SPONSORSHIP SYNDICATE</div>
      <div>THE TERMS OF ALLIANCE</div>
    </div>

    <div style="margin-top: 4mm;">
      <span class="editorial-tag">ACT V: THE PARTNERSHIP THESIS</span>
      <h2 class="editorial-title">Capital Investment & Strategic Yield</h2>
      <div class="editorial-lead">
        We do not offer logo placement on lanyards. Every sponsorship position is structured to yield verifiable recruitment pipelines, live software integrations, and authentic technical visibility.
      </div>

      <table class="prospectus-table">
        <thead>
          <tr>
            <th style="width: 28%;">SYNDICATE POSITION</th>
            <th style="width: 18%;">INVESTMENT</th>
            <th style="width: 14%;">SLOTS</th>
            <th style="width: 40%;">CORE STRATEGIC DELIVERABLES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tier-title-col">
              TITLE PARTNER<br>
              <span style="font-size:7pt; color:#6b7280; font-weight:normal;">Exclusive Co-Host</span>
            </td>
            <td class="tier-investment-col">₹5,00,000<br><span style="font-size:6.5pt; color:#6b7280;">$6,200 USD</span></td>
            <td class="tier-slots-col">1 EXCLUSIVE</td>
            <td class="tier-desc-col">
              <strong>"Hack On-Line 2027 Presented by [Your Brand]"</strong>. Exclusive ownership of a named Problem Arena. 15-minute keynote address at Kickoff. Full access to complete 2,500+ candidate resume book and Git commit logs. 4 seats on final evaluation jury. Dedicated pre-event 45m technical workshop.
            </td>
          </tr>

          <tr>
            <td class="tier-title-col">
              PLATINUM PARTNER<br>
              <span style="font-size:7pt; color:#6b7280; font-weight:normal;">Track Sponsor</span>
            </td>
            <td class="tier-investment-col">₹2,50,000<br><span style="font-size:6.5pt; color:#6b7280;">$3,100 USD</span></td>
            <td class="tier-slots-col">2 POSITIONS</td>
            <td class="tier-desc-col">
              Dedicated Challenge Track Bounty with custom problem prompt. 8-minute keynote presentation. Complete opt-in candidate dossier access. 2 evaluation jury seats. 30-minute pre-hackathon developer tech talk. Dedicated Slack/Discord support channel.
            </td>
          </tr>

          <tr>
            <td class="tier-title-col">
              GOLD PARTNER<br>
              <span style="font-size:7pt; color:#6b7280; font-weight:normal;">API & Tooling Partner</span>
            </td>
            <td class="tier-investment-col">₹1,25,000<br><span style="font-size:6.5pt; color:#6b7280;">$1,550 USD</span></td>
            <td class="tier-slots-col">4 POSITIONS</td>
            <td class="tier-desc-col">
              Dedicated API / DevTool integration bounty. Access to Top 100 finalist candidate profiles and GitHub repositories. 1 evaluation jury seat. 15-minute product demonstration slot during developer onboarding.
            </td>
          </tr>

          <tr>
            <td class="tier-title-col">
              SILVER PARTNER<br>
              <span style="font-size:7pt; color:#6b7280; font-weight:normal;">Ecosystem Supporter</span>
            </td>
            <td class="tier-investment-col">₹60,000<br><span style="font-size:6.5pt; color:#6b7280;">$750 USD</span></td>
            <td class="tier-slots-col">FLEXIBLE</td>
            <td class="tier-desc-col">
              Access to Top 25 finalist team dossiers. Mentor desk representation throughout the 24H sprint. Brand presence across Unstop portal and official closing ceremony broadcast.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="syndicate-rules">
        <div>
          <strong>IN-KIND & CLOUD INFRASTRUCTURE PARTNERS</strong>
          We welcome strategic tooling alliances offering cloud compute credits (AWS, GCP, Azure), API keys, developer subscriptions, or hardware test-bench units. In-kind partners receive customized branding and direct developer integration workshops based on fair credit value.
        </div>
        <div>
          <strong>THE CODE-FIRST HIRING GUARANTEE</strong>
          Sponsors receive raw, unedited Git telemetry: commit frequencies, test passes, pull request comments, and architectural schemas for every candidate. You evaluate builders based on how they actually write software under pressure.
        </div>
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>PARTNERSHIP SYNDICATE</div>
      <div class="page-count">05 / 06</div>
    </div>
  </div>


  <!-- ========================================================
       PAGE 6: ACT VI — THE ONBOARDING PROTOCOL & DIRECT LINES
       ======================================================== -->
  <div class="page">
    <div class="editorial-header">
      <div class="bold-tag">SECTION 05 // ONBOARDING & ENGAGEMENT</div>
      <div>THE PROTOCOL OF ALLIANCE</div>
    </div>

    <div style="margin-top: 4mm;">
      <span class="editorial-tag">ACT VI: THE ONBOARDING PROTOCOL</span>
      <h2 class="editorial-title">How to Enter the War Room</h2>
      <div class="editorial-lead">
        We maintain a streamlined, low-friction integration process designed to respect your corporate calendar. From agreement signing to live sprint deployment, our technical team handles all documentation and logistics.
      </div>

      <div class="protocol-steps">
        <div>
          <div class="protocol-step-num">01</div>
          <div class="protocol-step-title">Alignment Call</div>
          <div class="protocol-step-desc">A focused 20-minute discussion to map your hiring targets, developer API priorities, and preferred problem sector.</div>
        </div>

        <div>
          <div class="protocol-step-num">02</div>
          <div class="protocol-step-title">Track Calibration</div>
          <div class="protocol-step-desc">Co-authoring your custom challenge prompt, API documentation links, and rubric scoring benchmarks with our technical committee.</div>
        </div>

        <div>
          <div class="protocol-step-num">03</div>
          <div class="protocol-step-title">Developer Ingest</div>
          <div class="protocol-step-desc">Broadcasting your technical presence to 2,500+ builders via targeted announcements, documentation links, and pre-event workshops.</div>
        </div>

        <div>
          <div class="protocol-step-num">04</div>
          <div class="protocol-step-title">The 24H Sprint</div>
          <div class="protocol-step-desc">Live mentorship, keynote address, evaluation defense judging, and immediate post-event delivery of complete candidate dossiers.</div>
        </div>
      </div>

      <div class="executive-contact-editorial">
        <div class="contact-headline">DIRECT EXECUTIVE COMMUNICATION</div>
        <p style="font-size: 8.2pt; color: #374151; line-height: 1.45;">
          To reserve an exclusive track position or discuss a tailored corporate partnership, connect directly with our organizing leadership:
        </p>

        <div class="contact-grid">
          <div class="contact-card-ed">
            <div class="title">Lead Organizing Director</div>
            <div class="name">Hriday Bardia</div>
            <div class="email">hridaybardia07@gmail.com</div>
            <div style="color: #6b7280; font-size: 6.8pt; margin-top: 0.5mm;">Strategy, Governance & Institutional Alliances</div>
          </div>

          <div class="contact-card-ed">
            <div class="title">Head of Strategic Partnerships</div>
            <div class="name">Ayush Singh Chauhan</div>
            <div class="email">ayushchauhan2707@gmail.com</div>
            <div style="color: #6b7280; font-size: 6.8pt; margin-top: 0.5mm;">Sponsor Onboarding & Corporate Deliverables</div>
          </div>
        </div>

        <div style="margin-top: 3.5mm; padding-top: 2.5mm; border-top: 0.5px solid #d1d5db; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 6.8pt; color: #4b5563;">
          <span>WEB PORTAL: https://hack-on-line.com</span>
          <span>PLATFORM: Unstop & GitHub</span>
          <span>DATES: JAN 30–31, 2027</span>
        </div>
      </div>

      <div class="manifesto-seal">
        "Software is not written in presentation slides. It is forged in terminal windows, tested under pressure, and proven in commits. Join us in setting a higher bar for the global engineering community."
      </div>
    </div>

    <div class="editorial-footer">
      <div>HACK ON-LINE 2027 // PROSPECTUS</div>
      <div>ONBOARDING & DIRECTORY</div>
      <div class="page-count">06 / 06</div>
    </div>
  </div>

</body>
</html>
`;

// Write HTML
const outputHtmlPath = path.join(__dirname, '..', 'public', 'brochure.html');
fs.writeFileSync(outputHtmlPath, htmlContent, 'utf8');
console.log('Bespoke editorial HTML written to:', outputHtmlPath);

// Render to PDF using Headless Chrome
const tempPdfPath = path.join(process.env.TEMP || 'C:\\Users\\HRIDAY\\AppData\\Local\\Temp', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');
const publicPdfPath = path.join(__dirname, '..', 'public', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');
const rootPdfPath = path.join(__dirname, '..', 'Hack_On-Line_2027_Sponsorship_Brochure.pdf');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlUrl = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

console.log('Compiling bespoke editorial PDF via Chrome headless...');
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
