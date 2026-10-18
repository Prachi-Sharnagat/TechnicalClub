const fs = require('fs');

let code = fs.readFileSync('./src/data/events.js', 'utf8');

// Strip out image imports
code = code.replace(/import\s+posterRoboDrive[^\n]+;/g, 'const posterRoboDrive = "mock-robodrive.jpg";');
code = code.replace(/import\s+posterJeopardy[^\n]+;/g, 'const posterJeopardy = "mock-jeopardy.webp";');
code = code.replace(/import\s+posterRobo[^\n]+;/g, 'const posterRobo = "mock-robo.webp";');
code = code.replace(/import\s+posterShinobi[^\n]+;/g, 'const posterShinobi = "mock-shinobi.webp";');

// Transform ES module exports to CommonJS
code = code.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 = exports.$1 =');
code = code.replace(/export\s+function\s+(\w+)/g, 'const $1 = exports.$1 = function');

const mod = { exports: {} };
const fn = new Function('exports', 'module', code);
fn(mod.exports, mod);

const {
  EVENT_CATEGORIES,
  EVENTS_DATA,
  getEventsByStatus,
  GOOGLE_FORM_URL,
  UPCOMING,
  COMPLETED,
  ONGOING
} = mod.exports;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

console.log('--- TESTING TECHNICAL CLUB EVENTS DATA & LOGIC ---');

// 1. Categories
assert(Array.isArray(EVENT_CATEGORIES) && EVENT_CATEGORIES.length === 3, 'Three categories exist');
assert(EVENT_CATEGORIES[0].id === 'ongoing', 'First category is ongoing');
assert(EVENT_CATEGORIES[1].id === 'upcoming', 'Second category is upcoming');
assert(EVENT_CATEGORIES[2].id === 'past', 'Third category is past');

// 2. Ongoing Event - Robo Drive
const ongoing = getEventsByStatus('ongoing');
assert(ongoing.length >= 1, 'Ongoing events exist');
const robo = ongoing[0];
assert(robo.title === 'ROBO DRIVE', 'First event is ROBO DRIVE');
assert(robo.organizer === 'Technical Club RBU', 'Organizer is Technical Club RBU');
assert(robo.tagline === 'Crafted for Speed. Engineered for Precision.', 'Tagline is exact');
assert(robo.date === '22 October 2026', 'Date is 22 October 2026');
assert(robo.time === '10:00 AM onwards', 'Time is 10:00 AM onwards');
assert(robo.venue === 'Digital Tower, Ground Floor Common Area', 'Venue is Digital Tower, Ground Floor Common Area');
assert(robo.displayStatus === 'ongoing', 'displayStatus is ongoing');
assert(robo.registrationOpen === true, 'registrationOpen is true');
assert(robo.registrationType === 'google-form', 'registrationType is google-form');
assert(robo.registrationUrl === 'https://docs.google.com/forms/d/e/1FAIpQLSfice9Ifzg7YpWEtqGTf3QvIVXtpg9M4_yfXXg_Y2Iv2dfFCw/viewform', 'registrationUrl matches approved Google Form');
assert(robo.poster === 'mock-robodrive.jpg', 'Robo Drive poster is imported');

// 3. Past Event - GrandMaster's Jeopardy
const past = getEventsByStatus('past');
const jeopardy = past.find(e => e.title.includes("GrandMaster's Jeopardy"));
assert(Boolean(jeopardy), "Marvel Assemble: GrandMaster's Jeopardy is in past events");
assert(jeopardy.theme === 'Marvel Assemble', 'Theme is Marvel Assemble');
assert(jeopardy.category === 'QUIZ', 'Category is QUIZ');
assert(jeopardy.status === 'Completed', 'Status is Completed');
assert(jeopardy.date === '7 February', 'Date displayed is 7 February');
assert(jeopardy.registrationOpen === false, 'Registration is closed for completed event');
assert(jeopardy.registrationType === 'none', 'registrationType is none');
assert(jeopardy.poster === 'mock-jeopardy.webp', 'Poster is imported');

// 4. Backwards compatibility
assert(Array.isArray(UPCOMING) && UPCOMING.length === 3, 'UPCOMING export intact');
assert(Array.isArray(COMPLETED) && COMPLETED.length === 3, 'COMPLETED export intact');
assert(Array.isArray(ONGOING) && ONGOING.length === 1, 'ONGOING export intact');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
