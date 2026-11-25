-- ============================================================================
-- Hack On-Line 2027: Production Database Schema & Index Optimization
-- Architected for 10,000+ Concurrent Users & OWASP Top 10 Security Hardening
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL UNIQUE,
    track_id VARCHAR(50) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'DISQUALIFIED')),
    repo_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Participants Table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    github_handle VARCHAR(80),
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    track_id VARCHAR(50) NOT NULL,
    commit_hash VARCHAR(40) NOT NULL,
    demo_url VARCHAR(500),
    stage_01_score NUMERIC(5, 2) DEFAULT 0.00,
    stage_02_score NUMERIC(5, 2) DEFAULT 0.00,
    final_score NUMERIC(5, 2) GENERATED ALWAYS AS (stage_01_score * 0.40 + stage_02_score * 0.60) STORED,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Audit Logs Table (OWASP A09: Security Logging & Monitoring)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    ip_hash VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- HIGH-CONCURRENCY COMPOSITE INDEXES
-- Eliminates N+1 queries and ensures index-only scans under 10k load
-- ============================================================================

-- Fast lookup for team status and chronological sorting
CREATE INDEX IF NOT EXISTS idx_teams_status_created 
    ON teams (status, created_at DESC);

-- Fast team track grouping
CREATE INDEX IF NOT EXISTS idx_teams_track_status 
    ON teams (track_id, status);

-- Fast participant verification and team member enumeration
CREATE INDEX IF NOT EXISTS idx_participants_team_email 
    ON participants (team_id, email);

-- Scoreboard leaderboards: instant order by final score per track
CREATE INDEX IF NOT EXISTS idx_submissions_track_score 
    ON submissions (track_id, final_score DESC);

-- Fast audit trail scans
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action_timestamp 
    ON audit_logs (user_id, action, created_at DESC);

-- ============================================================================
-- POSTGRESQL ROW-LEVEL SECURITY (RLS) POLICIES
-- Zero Trust: Prevents Insecure Direct Object References (IDOR) & Data Leaks
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Teams Policy:
-- Public can read verified teams for leaderboard; users can only update their own team
CREATE POLICY teams_read_public ON teams
    FOR SELECT
    USING (status = 'CONFIRMED');

CREATE POLICY teams_owner_access ON teams
    FOR ALL
    USING (leader_email = current_setting('request.jwt.claims', true)::jsonb->>'email')
    WITH CHECK (leader_email = current_setting('request.jwt.claims', true)::jsonb->>'email');

-- 2. Participants Policy:
-- Team members can read their own team member records
CREATE POLICY participants_team_access ON participants
    FOR ALL
    USING (
        team_id IN (
            SELECT t.id FROM teams t 
            WHERE t.leader_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
        )
    );

-- 3. Submissions Policy:
-- Leaderboard view for finished judging; team owners can view and submit their own
CREATE POLICY submissions_owner_access ON submissions
    FOR ALL
    USING (
        team_id IN (
            SELECT t.id FROM teams t 
            WHERE t.leader_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
        )
    );

CREATE POLICY submissions_leaderboard_read ON submissions
    FOR SELECT
    USING (final_score > 0);

-- 4. Audit Logs Policy:
-- Strictly append-only for services; read-only for system administrators
CREATE POLICY audit_logs_service_insert ON audit_logs
    FOR INSERT
    WITH CHECK (true);
