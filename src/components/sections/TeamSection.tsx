"use client";

import React, { useState, useMemo } from "react";
import TeamLanyardRail, { LanyardMember } from "@/components/common/TeamLanyardRail";
import { Sparkles } from "lucide-react";
import { CREW_SECURITY_DATA } from "@/lib/crewQrData";

type CommitteeFilter = "ALL" | "MANAGEMENT" | "TECHNICAL" | "HOSTING" | "FINANCE" | "MARKETING";

interface ExtendedCrewMember extends LanyardMember {
  category: Exclude<CommitteeFilter, "ALL">;
  department: string;
}

export function TeamSection() {
  const [activeTab, setActiveTab] = useState<CommitteeFilter>("ALL");

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
        role: "Management Committee",
        team: "Organizing Crew",
        category: "MANAGEMENT",
        department: "Event Management & Operations",
        image: createAvatar("HB", "#FF8C66"),
        bio: "Overseeing overarching hackathon strategy, institutional execution, committee coordination, and 24H event management.",
        tags: ["Management", "Strategy", "Operations"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=hridaybardia07@gmail.com" },
          { label: "GitHub", href: "https://github.com/HridayBardia" },
        ],
        tone: 1,
        drop: 6,
        instagramUrl: CREW_SECURITY_DATA["crew-01"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-01"]?.scanPhrase,
      },
      {
        id: "crew-02",
        name: "Khush Salecha",
        role: "Hosting Committee",
        team: "Organizing Crew",
        category: "HOSTING",
        department: "Event Hosting & Operations",
        image: createAvatar("KS", "#06B6D4"),
        bio: "Directing live virtual event hosting, synchronous schedule coordination, speaker sessions, and seamless 24H stage execution.",
        tags: ["Hosting", "Operations", "Schedule"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=khushsalecha007@gmail.com" },
          { label: "GitHub", href: "https://github.com/KhushSalecha" },
        ],
        tone: 2,
        drop: 18,
        instagramUrl: CREW_SECURITY_DATA["crew-02"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-02"]?.scanPhrase,
      },
      {
        id: "crew-03",
        name: "K Jitesh Reddy",
        role: "Finance Committee",
        team: "Organizing Crew",
        category: "FINANCE",
        department: "Treasury, Grants & Prize Allocation",
        image: createAvatar("KR", "#8B5CF6"),
        bio: "Managing hackathon budgeting, prize pool allocation, sponsorship accounting, and transparent financial governance.",
        tags: ["Finance", "Treasury", "Budgeting"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=jitesh.konapalli16@gmail.com" },
          { label: "GitHub", href: "https://github.com/jitesh0216" },
        ],
        tone: 3,
        drop: 2,
        instagramUrl: CREW_SECURITY_DATA["crew-03"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-03"]?.scanPhrase,
      },
      {
        id: "crew-04",
        name: "Varad Kanade",
        role: "Finance Committee",
        team: "Organizing Crew",
        category: "FINANCE",
        department: "Sponsorship Operations & Budgeting",
        image: createAvatar("VK", "#10B981"),
        bio: "Coordinating sponsor financial agreements, operational expense tracking, and reward disbursement pipelines.",
        tags: ["Finance", "Sponsors", "Operations"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=kanadevarad2@gmail.com" },
          { label: "GitHub", href: "https://github.com/VaradKanade13" },
        ],
        tone: 4,
        drop: 14,
        instagramUrl: CREW_SECURITY_DATA["crew-04"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-04"]?.scanPhrase,
      },
      {
        id: "crew-05",
        name: "Narayan Priyadarshi",
        role: "Hosting Committee",
        team: "Organizing Crew",
        category: "HOSTING",
        department: "Community Hosting & Builder Support",
        image: createAvatar("NP", "#F59E0B"),
        bio: "Leading participant onboarding, virtual stage moderation, mentor coordination, and round-the-clock community support.",
        tags: ["Hosting", "Community", "Mentorship"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=menarayan.15@gmail.com" },
          { label: "GitHub", href: "https://github.com/menarayan15-boop" },
        ],
        tone: 5,
        drop: 22,
        instagramUrl: CREW_SECURITY_DATA["crew-05"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-05"]?.scanPhrase,
      },
      {
        id: "crew-07",
        name: "Ved Raj",
        role: "Management Committee",
        team: "Organizing Crew",
        category: "MANAGEMENT",
        department: "Operations Management & Coordination",
        image: createAvatar("VR", "#06B6D4"),
        bio: "Directing participant escalation triage, cross-committee operations, schedule execution, and event logistics.",
        tags: ["Management", "Operations", "Triage"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=vedrajhari35035@gmail.com" },
          { label: "GitHub", href: "https://github.com/Dj-coder-glitch" },
        ],
        tone: 2,
        drop: 10,
        instagramUrl: CREW_SECURITY_DATA["crew-07"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-07"]?.scanPhrase,
      },
      {
        id: "crew-06",
        name: "Ayush Singh Chauhan",
        role: "Technical Committee",
        team: "Organizing Crew",
        category: "TECHNICAL",
        department: "Engineering & Platform Reliability",
        image: createAvatar("AC", "#FF8C66"),
        bio: "Building core event web systems, deployment workflows, automated project review utilities, and track integrations.",
        tags: ["Technical", "Engineering", "Platform"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=ayushchauhan2707@gmail.com" },
          { label: "GitHub", href: "https://github.com/ayush-2707-Cloud" },
        ],
        tone: 1,
        drop: 16,
        instagramUrl: CREW_SECURITY_DATA["crew-06"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-06"]?.scanPhrase,
      },
      {
        id: "crew-08",
        name: "Satwik Kumar Guru",
        role: "Management Committee",
        team: "Organizing Crew",
        category: "MANAGEMENT",
        department: "Event Coordination & Ops Management",
        image: createAvatar("SG", "#8B5CF6"),
        bio: "Supporting builder onboarding, workflow coordination, team escalations, and real-time operational management.",
        tags: ["Management", "Coordination", "Operations"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=satwikguru895@gmail.com" },
          { label: "GitHub", href: "https://github.com/satwikguru895-source" },
        ],
        tone: 3,
        drop: 4,
        instagramUrl: CREW_SECURITY_DATA["crew-08"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-08"]?.scanPhrase,
      },
      {
        id: "crew-09",
        name: "Adya Gupta",
        role: "Social Marketing",
        team: "Organizing Crew",
        category: "MARKETING",
        department: "Social Campaigns & Outreach",
        image: createAvatar("AG", "#FF8C66"),
        bio: "Driving digital campaigns, social media storytelling, creator outreach, and nationwide developer community growth.",
        tags: ["Marketing", "Social", "Outreach"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=adyag36@gmail.com" },
          { label: "GitHub", href: "https://github.com/adyagupta-stack" },
        ],
        tone: 1,
        drop: 12,
        instagramUrl: CREW_SECURITY_DATA["crew-09"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-09"]?.scanPhrase,
      },
      {
        id: "crew-10",
        name: "A G Rajeswari",
        role: "Social Marketing",
        team: "Organizing Crew",
        category: "MARKETING",
        department: "Brand Communications & Content",
        image: createAvatar("AR", "#06B6D4"),
        bio: "Crafting hackathon brand communications, event announcements, partner spotlights, and participant engagement.",
        tags: ["Marketing", "Content", "Brand"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=agrajeswari26@gmail.com" },
          { label: "GitHub", href: "https://github.com/agrajeswari26" },
        ],
        tone: 2,
        drop: 20,
        instagramUrl: CREW_SECURITY_DATA["crew-10"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-10"]?.scanPhrase,
      },
      {
        id: "crew-11",
        name: "Anshul Kumar",
        role: "Technical Committee",
        team: "Organizing Crew",
        category: "TECHNICAL",
        department: "Technical Infrastructure & Web Ops",
        image: createAvatar("AK", "#10B981"),
        bio: "Contributing to frontend engineering, hackathon web tooling, deployment checks, and live participant technical support.",
        tags: ["Technical", "Web Ops", "Tooling"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=anshulkumaragr7@gmail.com" },
          { label: "GitHub", href: "https://github.com/anshul-kumar07" },
        ],
        tone: 4,
        drop: 8,
        instagramUrl: CREW_SECURITY_DATA["crew-11"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-11"]?.scanPhrase,
      },
      {
        id: "crew-12",
        name: "Sumit Kumawat",
        role: "Social Marketing",
        team: "Organizing Crew",
        category: "MARKETING",
        department: "Digital Promotion & Campus Reach",
        image: createAvatar("SK", "#F59E0B"),
        bio: "Amplifying Hack On-Line across developer chapters, campus networks, social channels, and live event highlights.",
        tags: ["Marketing", "Promotion", "Community"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=sumitkumawat21469@gmail.com" },
          { label: "GitHub", href: "https://share.google/ittOsC2duPrjnDUiX" },
        ],
        tone: 5,
        drop: 18,
        instagramUrl: CREW_SECURITY_DATA["crew-12"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-12"]?.scanPhrase,
      },
      {
        id: "crew-13",
        name: "Ankur Raj",
        role: "Finance Committee",
        team: "Organizing Crew",
        category: "FINANCE",
        department: "Financial Planning & Partner Ops",
        image: createAvatar("AR", "#8B5CF6"),
        bio: "Supporting budget planning, partner coordination, resource allocation, and transparent prize fulfillment logistics.",
        tags: ["Finance", "Planning", "Logistics"],
        links: [
          { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=rajankur2007@gmail.com" },
          { label: "GitHub", href: "https://github.com/rajankur2007" },
        ],
        tone: 3,
        drop: 6,
        instagramUrl: CREW_SECURITY_DATA["crew-13"]?.url,
        scanPhrase: CREW_SECURITY_DATA["crew-13"]?.scanPhrase,
      },
    ],
    []
  );

  const displayedMembers = useMemo(() => {
    if (activeTab === "ALL") return allCrew;
    return allCrew.filter((m) => m.category === activeTab);
  }, [activeTab, allCrew]);

  const filterOptions: Array<{ id: CommitteeFilter; label: string }> = [
    { id: "ALL", label: `All Crew (${allCrew.length})` },
    { id: "MANAGEMENT", label: `Management (${allCrew.filter((m) => m.category === "MANAGEMENT").length})` },
    { id: "TECHNICAL", label: `Technical (${allCrew.filter((m) => m.category === "TECHNICAL").length})` },
    { id: "HOSTING", label: `Hosting (${allCrew.filter((m) => m.category === "HOSTING").length})` },
    { id: "FINANCE", label: `Finance (${allCrew.filter((m) => m.category === "FINANCE").length})` },
    { id: "MARKETING", label: `Social Marketing (${allCrew.filter((m) => m.category === "MARKETING").length})` },
  ];

  return (
    <section
      id="team"
      aria-label="Organizing Crew"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-44 pb-16 sm:pb-24 scroll-mt-28 relative z-10 overflow-x-clip"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-white/10 gap-6 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>04 // ORGANIZATIONAL LEADERSHIP &amp; OPERATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Organizing Crew
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
            The organizing committees behind Hack On-Line 2027.
          </p>
        </div>

        {/* Filter Pills */}
        < div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/15 backdrop-blur-2xl shadow-xl w-full lg:w-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveTab(opt.id)}
              className={`flex-1 sm:flex-none text-center px-3 py-2 min-h-11 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center whitespace-nowrap ${activeTab === opt.id
                  ? "bg-white text-zinc-950 shadow-md scale-[1.02]"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              {opt.label}
            </button>
          ))}
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
          <span>Click any badge to flip 180° for verified credentials &amp; contacts</span>
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
