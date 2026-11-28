// The run of the event, shared by the hero timeline, the schedule and the tracks.
// Finalist numbers are left out until the organisers confirm them.

export interface Stage {
  id: string;
  /** ISO time with the IST offset */
  at: string;
  name: string;
  detail: string;
}

export const STAGES: Stage[] = [
  {
    id: "tracks",
    at: "2027-01-30T09:45:00+05:30",
    name: "Tracks released",
    detail: "Problem statements for all five tracks are published on Unstop and the event platform.",
  },
  {
    id: "start",
    at: "2027-01-30T10:00:00+05:30",
    name: "Hacking starts",
    detail: "The 24 hours begin. Start your repository after this time.",
  },
  {
    id: "checkpoint",
    at: "2027-01-30T18:00:00+05:30",
    name: "Architecture checkpoint",
    detail: "Teams share their component plan, API structure and repository link for a peer check.",
  },
  {
    id: "mentors",
    at: "2027-01-31T02:00:00+05:30",
    name: "Mentor office hours",
    detail: "Mentors help with debugging, architecture and deployment problems.",
  },
  {
    id: "freeze",
    at: "2027-01-31T10:00:00+05:30",
    name: "Code freeze",
    detail: "Submissions close on Unstop. Send your live project link and a 2-minute walkthrough.",
  },
  {
    id: "shortlist",
    at: "2027-01-31T11:30:00+05:30",
    name: "Shortlist round",
    detail: "Tech and software industry experts review repositories, commit history and live links to pick the finalists.",
  },
  {
    id: "final",
    at: "2027-01-31T16:30:00+05:30",
    name: "Final round",
    detail: "Finalists demonstrate their projects live and answer questions about how they built them.",
  },
  {
    id: "awards",
    at: "2027-01-31T18:30:00+05:30",
    name: "Awards",
    detail: "Winners are announced across all five tracks.",
  },
];

export const TRACKS_RELEASE = Date.parse(STAGES[0].at);

const IST_OFFSET_MS = 5.5 * 3_600_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Formatted by hand so the server and every browser produce identical text
function toIst(ms: number) {
  return new Date(ms + IST_OFFSET_MS);
}

export function formatDay(ms: number) {
  const d = toIst(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function formatTime(ms: number) {
  const d = toIst(ms);
  const hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "AM" : "PM"}`;
}

/** "63d 4h", "5h 20m" or "12m" */
export function formatSpan(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Index of the latest stage that has started at `ms`, or -1 before the first */
export function stageIndexAt(ms: number) {
  return STAGES.findLastIndex((stage) => Date.parse(stage.at) <= ms);
}

/** The stage happening right now. The last stage stays current for one hour. */
export function liveStageIndex(now: number | null) {
  if (now === null || now > Date.parse(STAGES[STAGES.length - 1].at) + 3_600_000) return -1;
  return stageIndexAt(now);
}
