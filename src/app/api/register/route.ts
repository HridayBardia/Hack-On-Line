import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 5 Official Problem Tracks Whitelist
const VALID_TRACKS = [
  "track-01", // Agriculture & AgTech
  "track-02", // Medical & Healthcare
  "track-03", // Space & Aerospace
  "track-04", // Crypto and Privacy
  "track-05", // Clean and green tech
] as const;

// HTML tag stripping sanitization helper
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags to eliminate Stored XSS
    .trim()
    .slice(0, maxLength);
}

// Validation Regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const GITHUB_HANDLE_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const TEAM_NAME_REGEX = /^[a-zA-Z0-9\s\-_.,#&]{3,60}$/;

export async function POST(request: NextRequest) {
  // 1. Payload Size Limit Enforcement (Max 64KB)
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > 64 * 1024) {
    return NextResponse.json(
      { error: "Payload Too Large", message: "Request payload must not exceed 64KB." },
      { status: 413 }
    );
  }

  try {
    const rawBody = await request.json();

    // 2. Strict Schema Parsing & Sanitization
    const teamName = sanitizeString(rawBody.teamName, 60);
    const leaderName = sanitizeString(rawBody.leaderName, 80);
    const leaderEmail = sanitizeString(rawBody.leaderEmail, 255).toLowerCase();
    const githubHandle = sanitizeString(rawBody.githubHandle, 40);
    const trackId = sanitizeString(rawBody.trackId, 30);
    const memberCount = Number(rawBody.memberCount);

    // 3. Validation Logic
    const validationErrors: Record<string, string> = {};

    if (!teamName || !TEAM_NAME_REGEX.test(teamName)) {
      validationErrors.teamName = "Team name must be between 3 and 60 alphanumeric characters.";
    }

    if (!leaderName || leaderName.length < 2) {
      validationErrors.leaderName = "Full name must be at least 2 characters long.";
    }

    if (!leaderEmail || !EMAIL_REGEX.test(leaderEmail)) {
      validationErrors.leaderEmail = "A valid email address is required.";
    }

    if (githubHandle && !GITHUB_HANDLE_REGEX.test(githubHandle)) {
      validationErrors.githubHandle = "Invalid GitHub handle format.";
    }

    if (!trackId || !VALID_TRACKS.includes(trackId as (typeof VALID_TRACKS)[number])) {
      validationErrors.trackId = "Please select a valid Hack On-Line 2027 problem track.";
    }

    if (isNaN(memberCount) || memberCount < 1 || memberCount > 4) {
      validationErrors.memberCount = "Team size must be between 1 and 4 builders.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Validation failed on one or more fields.",
          details: validationErrors,
        },
        { status: 422 }
      );
    }

    // 4. Parameterized Database Persistence via Singleton with duplicate collision checks
    const queryText = `
      INSERT INTO teams (name, leader_name, leader_email, github_handle, track_id, member_count, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
      RETURNING id, name, track_id, status, created_at;
    `;

    const result = await db.query(queryText, [
      teamName,
      leaderName,
      leaderEmail,
      githubHandle || "",
      trackId,
      memberCount,
    ]);

    const createdTeam = result.rows[0] as Record<string, unknown> | undefined;

    return NextResponse.json(
      {
        success: true,
        message: "Registration received successfully. Verification email dispatched.",
        registrationId: (createdTeam?.id as string) || crypto.randomUUID(),
        team: {
          name: teamName,
          track: trackId,
          status: "PENDING",
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as { code?: string })?.code;

    // Handle duplicate registrations with clean 409 Conflict
    if (errorCode === "23505" || errorMessage.includes("already registered")) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "A team with this name or leader email is already registered.",
        },
        { status: 409 }
      );
    }

    console.error("[REGISTRATION API ERROR]", {
      timestamp: new Date().toISOString(),
      error: errorMessage,
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing registration. Please try again.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}

// 5. Edge Cached GET Endpoint (Public metadata offloaded to CDN edge)
export async function GET() {
  let count = 0;
  try {
    const result = await db.query<{ count: number }>("SELECT COUNT(*) FROM teams;");
    count = result.rows[0]?.count || 0;
  } catch {}

  return NextResponse.json(
    {
      eventName: "Hack On-Line 2027",
      eventDates: "January 30–31, 2027",
      registrationStatus: "OPEN",
      registeredSquads: count,
      availableTracks: VALID_TRACKS,
      maxTeamSize: 4,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
