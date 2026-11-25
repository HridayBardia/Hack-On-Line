"use client";

import React, { useState, useMemo } from "react";
import TeamLanyardRail, { LanyardMember } from "@/components/common/TeamLanyardRail";
import { Sparkles } from "lucide-react";
import { CREW_SECURITY_DATA } from "@/lib/crewQrData";

interface ExtendedCrewMember extends LanyardMember {
  category: "STEERING" | "SUPPORT";
  department: string;
}

export function TeamSection() {
  const [activeTab, setActiveTab] = useState<"ALL" | "STEERING" | "SUPPORT">("ALL");

  // Generate crisp high-resolution SVG avatars with initials and luxury glow
  const createAvatar = (initials: string, color: string) => {
    const encodedColor = encodeURIComponent(color);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><defs><radialGradient id="bg" cx="50%" cy="38%" r="62%"><stop offset="0%" stop-color="%231f2334"/><stop offset="100%" stop-color="%23090a0f"/></radialGradient><linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${encodedColor}"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0.2"/></linearGradient></defs><rect width="240" height="240" fill="url(%23bg)"/><circle cx="120" cy="120" r="106" fill="none" stroke="url(%23ring)" stroke-width="6"/><circle cx="120" cy="120" r="96" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-opacity="0.15" stroke-dasharray="10 8"/><text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="3">${initials}</text></svg>`;
  };

  const allCrew: ExtendedCrewMember[] = useMemo(
    () => [
      {
        id: "crew-01",
        name: "Hriday Bardia",
        role: "Lead Organizing Director",
        team: "Executive Steering",
        category: "STEERING",
        department: "Executive Strategy & General Direction",
        image: createAvatar("HB", "#FF8C66"),
        bio: "Overseeing overarching hackathon strategy, institutional execution, schedule rigor, and global developer experience across 24H.",
        tags: ["Director", "Steering", "Strategy"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=hridaybardia07@gmail.com" },
          { label: "GitHub", href: "https://github.com/HridayBardia" },
        ],
        tone: 1,
        drop: 6,
        instagramUrl: CREW_SECURITY_DATA["crew-01"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-01"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-01"]?.svg,
      },
      {
        id: "crew-02",
        name: "Khush Salecha",
        role: "Head of Operations & Logistics",
        team: "Executive Steering",
        category: "STEERING",
        department: "Operations & Timeline Orchestration",
        image: createAvatar("KS", "#06B6D4"),
        bio: "Directing virtual pipeline execution, synchronous schedule coordination, timeline governance, and platform reliability.",
        tags: ["Operations", "Logistics", "Sync"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=khushsalecha007@gmail.com" },
          { label: "GitHub", href: "https://github.com/KhushSalecha" },
        ],
        tone: 2,
        drop: 18,
        instagramUrl: CREW_SECURITY_DATA["crew-02"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-02"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-02"]?.svg,
      },
      {
        id: "crew-03",
        name: "K Jitesh Kumar Reddy",
        role: "Head of Technical Evaluation",
        team: "Executive Steering",
        category: "STEERING",
        department: "Evaluation Governance & Rubric Systems",
        image: createAvatar("KR", "#8B5CF6"),
        bio: "Architecting automated Git commit validation, benchmark parameters, and rubric calibration for engineering panels.",
        tags: ["Evaluation", "Audit", "Git Rigor"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=jitesh.konapalli16@gmail.com" },
          { label: "GitHub", href: "https://github.com/jitesh0216" },
        ],
        tone: 3,
        drop: 2,
        instagramUrl: CREW_SECURITY_DATA["crew-03"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-03"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-03"]?.svg,
      },
      {
        id: "crew-04",
        name: "Varad Kanade",
        role: "Head of Engineering Systems",
        team: "Executive Steering",
        category: "STEERING",
        department: "Platform Architecture & Infrastructure",
        image: createAvatar("VK", "#10B981"),
        bio: "Managing high-availability submission portals, live scoreboards, API mock environments, and real-time infrastructure.",
        tags: ["Platform", "Infra", "Scoreboards"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=kanadevarad2@gmail.com" },
          { label: "GitHub", href: "https://github.com/VaradKanade13" },
        ],
        tone: 4,
        drop: 14,
        instagramUrl: CREW_SECURITY_DATA["crew-04"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-04"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-04"]?.svg,
      },
      {
        id: "crew-05",
        name: "Narayan Priyadarshi",
        role: "Head of Dev Community",
        team: "Executive Steering",
        category: "STEERING",
        department: "Developer Community & Mentorship",
        image: createAvatar("NP", "#F59E0B"),
        bio: "Leading developer engagement, participant support, mentor coordination, and round-the-clock builder assistance.",
        tags: ["Community", "Mentorship", "Support"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=menarayan.15@gmail.com" },
          { label: "GitHub", href: "https://github.com/menarayan15-boop" },
        ],
        tone: 5,
        drop: 22,
        instagramUrl: CREW_SECURITY_DATA["crew-05"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-05"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-05"]?.svg,
      },
      {
        id: "crew-06",
        name: "Ayush Singh Chauhan",
        role: "Head of Strategic Partnerships",
        team: "Executive Steering",
        category: "STEERING",
        department: "Industry Alliances & Outreach",
        image: createAvatar("AC", "#FF8C66"),
        bio: "Driving strategic ecosystem alliances, industry reviewer networks, university chapters, and developer outreach channels.",
        tags: ["Partnerships", "Alliances", "Outreach"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=ayushchauhan2707@gmail.com" },
          { label: "GitHub", href: "https://github.com/ayush-2707-Cloud" },
        ],
        tone: 1,
        drop: 8,
        instagramUrl: CREW_SECURITY_DATA["crew-06"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-06"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-06"]?.svg,
      },
      {
        id: "crew-07",
        name: "Ved Raj",
        role: "Lead Operations Support",
        team: "Extra Support",
        category: "SUPPORT",
        department: "Technical & Event Operations Support",
        image: createAvatar("VR", "#06B6D4"),
        bio: "Directing live participant escalation triage, technical support pipelines, environment diagnostics, and operational logistics.",
        tags: ["Live Support", "Operations", "Triage"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=vedrajhari35035@gmail.com" },
          { label: "GitHub", href: "https://github.com/Dj-coder-glitch" },
        ],
        tone: 2,
        drop: 16,
        instagramUrl: CREW_SECURITY_DATA["crew-07"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-07"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-07"]?.svg,
      },
      {
        id: "crew-08",
        name: "Satwik Kumar Guru",
        role: "Technical Operations Support",
        team: "Extra Support",
        category: "SUPPORT",
        department: "Runtime Diagnostics & Ops Support",
        image: createAvatar("SG", "#8B5CF6"),
        bio: "Supporting builder environment setups, continuous runtime diagnostic verification, submission ingest, and escalation resolution.",
        tags: ["Extra Support", "Runtime Ops", "Helpdesk"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=satwikguru895@gmail.com" },
          { label: "GitHub", href: "https://github.com/satwikguru895-source" },
        ],
        tone: 3,
        drop: 10,
        instagramUrl: CREW_SECURITY_DATA["crew-08"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-08"]?.scanPhrase,
        qrSvg: CREW_SECURITY_DATA["crew-08"]?.svg,
      },
    ],
    []
  );

  const displayedMembers = useMemo(() => {
    if (activeTab === "ALL") return allCrew;
    return allCrew.filter((m) => m.category === activeTab);
  }, [activeTab, allCrew]);

  return (
    <section
      id="team"
      aria-label="Organizing Crew"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-44 pb-16 sm:pb-24 scroll-mt-40 relative z-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/10 gap-6 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>04 // ORGANIZATIONAL LEADERSHIP & OPERATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Organizing Crew
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
            The engineering directors and operations team behind Hack On-Line 2027.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/15 backdrop-blur-2xl shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "ALL"
              ? "bg-white text-zinc-950 shadow-md scale-[1.02]"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            All Crew (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("STEERING")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "STEERING"
              ? "bg-white text-zinc-950 shadow-md scale-[1.02]"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            Steering (6)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SUPPORT")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "SUPPORT"
              ? "bg-white text-zinc-950 shadow-md scale-[1.02]"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            Extra Support (2)
          </button>
        </div>
      </div>

      {/* Interactive Physics Instructions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-zinc-300">Physics Simulation:</span>
          <span>Drag horizontally to slide rail · Pull downwards to stretch lanyard cord</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Click any badge to flip 180° for verified credentials & contacts</span>
        </div>
      </div>

      {/* Interactive Lanyard Badges Rail */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 p-2 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <TeamLanyardRail
          key={activeTab} // reset simulation cleanly on tab switch
          items={displayedMembers}
          caption="Interact with any badge to inspect credentials, role focus, and direct contact channels."
          className="bg-transparent border-0"
        />
      </div>
    </section>
  );
}

export default TeamSection;
