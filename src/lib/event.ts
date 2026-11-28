// Event details shared across the site.

export const SITE_URL = "https://hackon-line.co.in";

export const EVENT_START = "2027-01-30T10:00:00+05:30";
export const EVENT_END = "2027-01-31T10:00:00+05:30";

const calendarParams = new URLSearchParams({
  action: "TEMPLATE",
  text: "Hack On-Line 2027: 24-hour virtual hackathon",
  dates: "20270130T043000Z/20270131T043000Z",
  location: "Online",
  details: [
    "Times in IST:",
    "30 Jan, 9:45 AM: problem tracks released",
    "30 Jan, 10:00 AM: hacking starts",
    "31 Jan, 10:00 AM: code freeze and submissions close",
    "31 Jan, 4:30 PM: final round",
    "31 Jan, 6:30 PM: awards",
    "",
    SITE_URL,
  ].join("\n"),
});

export const CALENDAR_URL = `https://calendar.google.com/calendar/render?${calendarParams}`;
