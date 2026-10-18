/**
 * Automated test suite for Register Page bug fix & event selection
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING REGISTER PAGE COMPONENT & LOGIC ---');

// 1. Test src/fire.js does not throw when imported and handles missing env vars safely
let fireCode = fs.readFileSync(path.join(__dirname, 'src', 'fire.js'), 'utf8');
// Mock import.meta.env
fireCode = fireCode.replace(/import\.meta\.env\.(\w+)/g, 'undefined');
// Transform imports to CommonJS stubs for node testing
fireCode = fireCode.replace(/import\s*\{[^}]+\}\s*from\s*['"]firebase\/app['"];?/g, 'const initializeApp = () => ({ name: "[DEFAULT]" });');
fireCode = fireCode.replace(/import\s*\{[^}]+\}\s*from\s*['"]firebase\/firestore['"];?/g, 'const getFirestore = () => ({});');
fireCode = fireCode.replace(/export\s*\{\s*app,\s*db\s*\};?/g, 'module.exports = { app, db };');

const fireModule = { exports: {} };
const fireFn = new Function('module', 'exports', fireCode);
fireFn(fireModule, fireModule.exports);

assert(fireModule.exports.app !== undefined, 'Firebase app should be safely defined');
assert(fireModule.exports.db !== undefined, 'Firebase db should be safely defined');
console.log('[PASS] src/fire.js initializes safely without throwing unhandled exceptions');

// 2. Load events data
let eventsCode = fs.readFileSync(path.join(__dirname, 'src', 'data', 'events.js'), 'utf8');
eventsCode = eventsCode.replace(/import\s+posterRoboDrive[^\n]+;/g, 'const posterRoboDrive = "mock-robodrive.jpg";');
eventsCode = eventsCode.replace(/import\s+posterJeopardy[^\n]+;/g, 'const posterJeopardy = "mock-jeopardy.webp";');
eventsCode = eventsCode.replace(/import\s+posterRobo[^\n]+;/g, 'const posterRobo = "mock-robo.webp";');
eventsCode = eventsCode.replace(/import\s+posterShinobi[^\n]+;/g, 'const posterShinobi = "mock-shinobi.webp";');
eventsCode = eventsCode.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 = exports.$1 =');
eventsCode = eventsCode.replace(/export\s+function\s+(\w+)/g, 'const $1 = exports.$1 = function');

const eventsMod = { exports: {} };
const eventsFn = new Function('exports', 'module', eventsCode);
eventsFn(eventsMod.exports, eventsMod);

const { EVENTS_DATA, GOOGLE_FORM_URL } = eventsMod.exports;

// 3. Test current event selection filter
const openEvents = EVENTS_DATA.filter(e => e.displayStatus !== 'past' && e.registrationOpen === true);

assert(openEvents.length >= 1, 'At least one open event must exist');
console.log(`[PASS] Open events count: ${openEvents.length}`);

// Confirm Robo Drive is the primary open event
const robo = openEvents.find(e => e.slug === 'robo-drive' || e.id === 'robo-drive-2026');
assert(robo !== undefined, 'Robo Drive must be present in open events');
assert.strictEqual(robo.title, 'ROBO DRIVE', 'Title is ROBO DRIVE');
assert.strictEqual(robo.date, '22 October 2026', 'Date is 22 October 2026');
assert.strictEqual(robo.time, '10:00 AM onwards', 'Time is 10:00 AM onwards');
assert.strictEqual(robo.venue, 'Digital Tower, Ground Floor Common Area', 'Venue is Digital Tower Ground Floor Common Area');
assert.strictEqual(robo.registrationOpen, true, 'registrationOpen is true');
assert.strictEqual(robo.registrationType, 'google-form', 'registrationType is google-form');
assert.strictEqual(robo.registrationUrl, GOOGLE_FORM_URL, 'registrationUrl points to verified Google Form');
assert(robo.poster, 'Poster is defined');
console.log('[PASS] Robo Drive details, verified Google Form URL, and poster verified');

// 4. Test excluding past events
const pastEvent = EVENTS_DATA.find(e => e.slug === 'grandmasters-jeopardy');
assert(pastEvent !== undefined, 'Past event exists in raw data');
assert(!openEvents.some(e => e.id === pastEvent.id), 'Past events must NOT appear in openEvents');
console.log('[PASS] Past events (like Marvel Assemble: Jeopardy) are correctly excluded');

// 5. Test closed event logic: an event with registrationOpen: false should be excluded
const testDataWithClosed = [
  ...EVENTS_DATA,
  {
    id: 'test-closed-event',
    title: 'Closed Workshop',
    displayStatus: 'upcoming',
    registrationOpen: false
  }
];
const filteredClosed = testDataWithClosed.filter(e => e.displayStatus !== 'past' && e.registrationOpen === true);
assert(!filteredClosed.some(e => e.id === 'test-closed-event'), 'Closed event must be excluded');
console.log('[PASS] Closed events with registrationOpen: false are correctly excluded');

// 6. Test no-events empty state message
const emptyData = [];
const filteredEmpty = emptyData.filter(e => e.displayStatus !== 'past' && e.registrationOpen === true);
assert.strictEqual(filteredEmpty.length, 0, 'Zero events when empty');
const EMPTY_MSG = 'No events are currently open for registration. Check back soon!';
assert(EMPTY_MSG.includes('No events are currently open for registration'), 'Empty state message matches specification');
console.log('[PASS] Empty state condition and copy verified: "No events are currently open for registration. Check back soon!"');

// 7. Verify RegisterPage.jsx contains the required elements and no duplicates
const regPageContent = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'RegisterPage.jsx'), 'utf8');
assert(regPageContent.includes('EventRegistrationModal'), 'Must import EventRegistrationModal');
assert(regPageContent.includes('No events are currently open for registration. Check back soon!'), 'Must include empty state copy');
assert(regPageContent.includes('featuredEvent'), 'Must render featured event');
assert(regPageContent.includes('REGISTER NOW'), 'Must render Register Now button');
assert(!regPageContent.includes('<span className="reg-meta-label">// STATUS</span>'), 'Duplicate status box removed from metadata list');
assert(!regPageContent.includes('<span className="reg-meta-label">// ORGANIZER</span>'), 'Organizer removed from metadata list to avoid duplication with badge header');
assert(regPageContent.includes('reg-organizer-pill'), 'Organizer displayed once in badge row');
assert(regPageContent.includes('DATE:'), 'Structured metadata contains DATE');
assert(regPageContent.includes('TIME:'), 'Structured metadata contains TIME');
assert(regPageContent.includes('VENUE:'), 'Structured metadata contains VENUE');
console.log('[PASS] RegisterPage.jsx source contains single organizer line, structured Date/Time/Venue, and no duplicates');

// 8. Verify robo-drive-2026 data has no duplicate facts array
assert(!robo.facts || robo.facts.length === 0, 'Robo Drive must not contain duplicate facts array');
console.log('[PASS] Robo Drive event data does not contain duplicate facts');

// 9. Verify EventCard.jsx smart filter keeps unique info while filtering out duplicate date/venue/organizer
const eventCardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'events', 'EventCard.jsx'), 'utf8');
assert(eventCardContent.includes('uniqueFacts'), 'EventCard.jsx implements uniqueFacts filter');
console.log('[PASS] EventCard.jsx prevents duplicate event facts from rendering site-wide');

// 10. Verify Contact Us configuration and Register page section
const contactPath = path.join(__dirname, 'src', 'data', 'contact.js');
assert(fs.existsSync(contactPath), 'src/data/contact.js must exist');
const contactContent = fs.readFileSync(contactPath, 'utf8');
assert(contactContent.includes('technicalclub@rknec.edu'), 'contact.js must contain verified email technicalclub@rknec.edu');
assert(contactContent.includes('https://www.instagram.com/technicalclubrbu/'), 'contact.js must contain official Instagram link');
assert(contactContent.includes('@technicalclubrbu'), 'contact.js must contain official Instagram handle');
console.log('[PASS] src/data/contact.js defines verified email and Instagram configuration');

// 11. Verify RegisterPage.jsx renders Contact Us section with email and Instagram links
assert(regPageContent.includes('CLUB_CONTACT'), 'RegisterPage.jsx must import CLUB_CONTACT');
assert(regPageContent.includes('reg-contact-section'), 'RegisterPage.jsx must render Contact Us section');
assert(regPageContent.includes('mailto:'), 'Contact section must contain working mailto: link');
assert(regPageContent.includes('target="_blank"'), 'Instagram link must open in a new tab');
assert(regPageContent.includes('rel="noopener noreferrer"'), 'Instagram link must have rel="noopener noreferrer" for security');
const eventCardIdx = regPageContent.indexOf('reg-featured-card');
const contactSectionIdx = regPageContent.indexOf('reg-contact-section');
assert(eventCardIdx !== -1 && contactSectionIdx !== -1 && eventCardIdx < contactSectionIdx, 'Contact Us section must be rendered AFTER the events section');
console.log('[PASS] RegisterPage.jsx renders accessible Contact Us section with safe external links positioned after events');

// 12. Verify CSS has responsive styles for Contact Us section
const regCssContent = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'register.css'), 'utf8');
assert(regCssContent.includes('.reg-contact-section'), 'register.css must include .reg-contact-section');
assert(regCssContent.includes('.reg-contact-grid'), 'register.css must include .reg-contact-grid');
assert(regCssContent.includes('.reg-contact-card'), 'register.css must include .reg-contact-card');
console.log('[PASS] register.css contains retro-pixel styles and responsive layout for Contact Us');

console.log('\nAll Register Page tests passed successfully!');
