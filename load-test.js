import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Telemetry Metrics
export const registrationSuccess = new Rate('registration_success_rate');
export const rateLimitHits = new Counter('rate_limit_429_hits');
export const apiDuration = new Trend('api_register_duration');

export const options = {
  stages: [
    { duration: '30s', target: 200 },   // Stage 1: Warmup burst to 200 users
    { duration: '1m', target: 1000 },   // Stage 2: Scale up to 1,000 concurrent users
    { duration: '2m', target: 5000 },   // Stage 3: Heavy load spike to 5,000 users
    { duration: '1m', target: 10000 },  // Stage 4: Stress threshold push to 10,000 users
    { duration: '1m', target: 10000 },  // Stage 5: Peak sustain at 10,000
    { duration: '30s', target: 0 },     // Stage 6: Graceful cooldown
  ],
  thresholds: {
    // 95% of all requests must complete within 1.2s under heavy load
    http_req_duration: ['p(95)<1200'],
    // Page loads should be very fast (< 400ms at p90)
    'http_req_duration{type:landing}': ['p(90)<400'],
    // API writes must complete within 800ms
    api_register_duration: ['p(95)<800'],
    // Hard server error rate (5xx) must remain under 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

const TRACKS = ['track-01', 'track-02', 'track-03', 'track-04', 'track-05'];

function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export default function () {
  const userTypeRoll = Math.random();

  // 1. 70% of traffic: Landing Page Browsing (Read-heavy CDN tier)
  if (userTypeRoll < 0.70) {
    group('Browse Landing Page', () => {
      const res = http.get(`${BASE_URL}/`, {
        tags: { type: 'landing' },
      });

      check(res, {
        'status is 200': (r) => r.status === 200,
        'has security headers': (r) => r.headers['X-Content-Type-Options'] === 'nosniff',
      });
    });
  }
  // 2. 20% of traffic: Public Metadata API Inspection
  else if (userTypeRoll < 0.90) {
    group('Fetch Event Metadata API', () => {
      const res = http.get(`${BASE_URL}/api/register`, {
        tags: { type: 'api_get' },
      });

      check(res, {
        'status is 200': (r) => r.status === 200,
        'has edge cache-control': (r) => r.headers['Cache-Control'] !== undefined,
        'has valid JSON': (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.registrationStatus === 'OPEN';
          } catch {
            return false;
          }
        },
      });
    });
  }
  // 3. 10% of traffic: Squad Registration Submission (Write-heavy API tier)
  else {
    group('Submit Registration', () => {
      const uid = randomString(6);
      const payload = JSON.stringify({
        teamName: `Team_${uid}`,
        leaderName: `Builder ${uid}`,
        leaderEmail: `builder_${uid}@hackonline-test.com`,
        githubHandle: `dev-${uid}`,
        trackId: TRACKS[Math.floor(Math.random() * TRACKS.length)],
        memberCount: Math.floor(Math.random() * 4) + 1,
      });

      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
        tags: { type: 'api_post' },
      };

      const start = Date.now();
      const res = http.post(`${BASE_URL}/api/register`, payload, params);
      apiDuration.add(Date.now() - start);

      if (res.status === 429) {
        rateLimitHits.add(1);
        check(res, {
          'rate limited cleanly with 429': (r) => r.status === 429,
          'has retry-after header': (r) => r.headers['Retry-After'] !== undefined,
        });
        registrationSuccess.add(false);
      } else {
        const isSuccess = check(res, {
          'status is 201': (r) => r.status === 201,
          'returns registrationId': (r) => {
            try {
              const body = JSON.parse(r.body);
              return typeof body.registrationId === 'string';
            } catch {
              return false;
            }
          },
        });
        registrationSuccess.add(isSuccess);
      }
    });
  }

  // Realistic human pacing jitter between actions (1s - 3s)
  sleep(Math.random() * 2 + 1);
}
