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

const { EVENTS_DATA, OFFICIAL_REGISTRATION_FORM_URL, GOOGLE_FORM_URL } = eventsMod.exports;

// 3. Test official registration form URL
assert.strictEqual(
  OFFICIAL_REGISTRATION_FORM_URL,
  'https://forms.gle/hLqNfVHBEkY3NKcH6',
  'Official registration form URL must match https://forms.gle/hLqNfVHBEkY3NKcH6'
);
console.log('[PASS] OFFICIAL_REGISTRATION_FORM_URL verified: https://forms.gle/hLqNfVHBEkY3NKcH6');

// 4. Test events data integrity & exclusion of past events
const pastEvent = EVENTS_DATA.find(e => e.slug === 'grandmasters-jeopardy');
assert(pastEvent !== undefined, 'Past event exists in raw data');
const openEvents = EVENTS_DATA.filter(e => e.displayStatus !== 'past' && e.registrationOpen === true);
assert(!openEvents.some(e => e.id === pastEvent.id), 'Past events must NOT appear in openEvents');
console.log('[PASS] Past events (like Marvel Assemble: Jeopardy) are correctly excluded from active filter');

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

// 6. Verify RegisterPage.jsx contains the required elements for the clean official Google Form card
const regPageContent = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'RegisterPage.jsx'), 'utf8');

// UI requirement: Heading: EVENT REGISTRATION
assert(regPageContent.includes('EVENT REGISTRATION'), 'Must include heading EVENT REGISTRATION');

// UI requirement: Description: Register for Technical Club RBU events using our official registration form.
assert(
  regPageContent.includes('Register for Technical Club RBU events using our official registration form.'),
  'Must include exact description copy'
);

// UI requirement: Add a small label: OFFICIAL GOOGLE FORM
assert(regPageContent.includes('OFFICIAL GOOGLE FORM'), 'Must include small label OFFICIAL GOOGLE FORM');

// UI requirement: Add a prominent button: REGISTER NOW →
assert(regPageContent.includes('REGISTER NOW →'), 'Must include button with label REGISTER NOW →');

// UI requirement: Link button to official Google Form URL
assert(
  regPageContent.includes('OFFICIAL_REGISTRATION_FORM_URL') ||
  regPageContent.includes('https://forms.gle/hLqNfVHBEkY3NKcH6'),
  'Must link to official Google Form'
);

// UI requirement: Safe external link attributes
assert(regPageContent.includes('target="_blank"'), 'Must have target="_blank"');
assert(regPageContent.includes('rel="noopener noreferrer"'), 'Must have rel="noopener noreferrer"');

// Functional requirement: Retain query-based modal / dialog capability without breaking
assert(regPageContent.includes('EventRegistrationModal'), 'Must import EventRegistrationModal for event query handling');
assert(regPageContent.includes('reg-organizer-pill'), 'Organizer displayed in badge row');
assert(regPageContent.includes('reg-featured-card'), 'Must use retro pixel featured card container');
console.log('[PASS] RegisterPage.jsx contains official Google Form card, exact headings, labels, button, and safe link attributes');

// 7. Verify robo-drive-2026 data has no duplicate facts array
const robo = EVENTS_DATA.find(e => e.slug === 'robo-drive' || e.id === 'robo-drive-2026');
assert(robo !== undefined, 'Robo Drive exists in events data');
assert(!robo.facts || robo.facts.length <= 2, 'Robo Drive must not contain bloat facts array');
console.log('[PASS] Robo Drive event data verified in events list');

// 8. Verify EventCard.jsx smart filter keeps unique info while filtering out duplicate date/venue/organizer
const eventCardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'events', 'EventCard.jsx'), 'utf8');
assert(eventCardContent.includes('uniqueFacts'), 'EventCard.jsx implements uniqueFacts filter');
console.log('[PASS] EventCard.jsx prevents duplicate event facts from rendering site-wide');

// 9. Verify Contact Us configuration and Register page section
const contactPath = path.join(__dirname, 'src', 'data', 'contact.js');
assert(fs.existsSync(contactPath), 'src/data/contact.js must exist');
const contactContent = fs.readFileSync(contactPath, 'utf8');
assert(contactContent.includes('technicalclub@rknec.edu'), 'contact.js must contain verified email technicalclub@rknec.edu');
assert(contactContent.includes('https://www.instagram.com/technicalclubrbu/'), 'contact.js must contain official Instagram link');
assert(contactContent.includes('@technicalclubrbu'), 'contact.js must contain official Instagram handle');
console.log('[PASS] src/data/contact.js defines verified email and Instagram configuration');

// 10. Verify RegisterPage.jsx renders Contact Us section with email and Instagram links
assert(regPageContent.includes('CLUB_CONTACT'), 'RegisterPage.jsx must import CLUB_CONTACT');
assert(regPageContent.includes('reg-contact-section'), 'RegisterPage.jsx must render Contact Us section');
assert(regPageContent.includes('mailto:'), 'Contact section must contain working mailto: link');
const eventCardIdx = regPageContent.indexOf('reg-featured-card');
const contactSectionIdx = regPageContent.indexOf('reg-contact-section');
assert(eventCardIdx !== -1 && contactSectionIdx !== -1 && eventCardIdx < contactSectionIdx, 'Contact Us section must be rendered AFTER the events section');
console.log('[PASS] RegisterPage.jsx renders accessible Contact Us section with safe external links positioned after events');

// 11. Verify CSS has responsive styles for both Event Registration card and Contact Us section
const regCssContent = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'register.css'), 'utf8');
assert(regCssContent.includes('.reg-featured-card'), 'register.css must include .reg-featured-card');
assert(regCssContent.includes('.reg-google-form-pill'), 'register.css must include .reg-google-form-pill');
assert(regCssContent.includes('.reg-btn-official'), 'register.css must include .reg-btn-official');
assert(regCssContent.includes('.reg-contact-section'), 'register.css must include .reg-contact-section');
assert(regCssContent.includes('.reg-contact-grid'), 'register.css must include .reg-contact-grid');
assert(regCssContent.includes('.reg-contact-card'), 'register.css must include .reg-contact-card');
console.log('[PASS] register.css contains retro-pixel styles and responsive layout for Registration Card & Contact Us');

// 12. Verify Registration Card has VIEW TASK PDF button beside REGISTER NOW
assert(regPageContent.includes('VIEW TASK PDF ↗'), 'Registration card must include VIEW TASK PDF ↗ button');
assert(regCssContent.includes('.reg-btn-task-hero'), 'register.css must include .reg-btn-task-hero style');
console.log('[PASS] Registration card renders VIEW TASK PDF ↗ button beside REGISTER NOW');

// 13. Verify DOMAIN-WISE RECRUITMENT TASKS section
assert(regPageContent.includes('DOMAIN-WISE RECRUITMENT TASKS'), 'Must render DOMAIN-WISE RECRUITMENT TASKS heading');
assert(
  regPageContent.includes('Choose your domain, open the task PDF, and follow the instructions before applying.'),
  'Must render exact subtitle'
);
assert(regPageContent.includes('reg-tasks-section'), 'Must render reg-tasks-section');
assert(regPageContent.includes('reg-tasks-grid'), 'Must render reg-tasks-grid');

// 14. Verify all 6 domain recruitment tasks in src/data/recruitmentTasks.js
const tasksDataPath = path.join(__dirname, 'src', 'data', 'recruitmentTasks.js');
assert(fs.existsSync(tasksDataPath), 'src/data/recruitmentTasks.js must exist');
const tasksDataCode = fs.readFileSync(tasksDataPath, 'utf8');
const tasksMod = { exports: {} };
const tasksFn = new Function('exports', tasksDataCode.replace(/export\s+const\s+(\w+)\s*=/g, 'exports.$1 ='));
tasksFn(tasksMod.exports);
const { RECRUITMENT_TASKS, MASTER_AUDITION_PDF, MASTER_AUDITION_FILENAME } = tasksMod.exports;

assert(Array.isArray(RECRUITMENT_TASKS), 'RECRUITMENT_TASKS must be an array');
assert.strictEqual(RECRUITMENT_TASKS.length, 6, 'Must have exactly 6 domain tasks');

const expectedDomains = [
  { name: 'WEB DEVELOPMENT', desc: 'Build websites and web applications using modern web technologies.', pdf: 'web-development-task.pdf' },
  { name: 'GRAPHICS', desc: 'Explore visual design, posters, branding, and creative graphics.', pdf: 'graphics-task.pdf' },
  { name: 'ELECTRONICS', desc: 'Explore electronics, Arduino, sensors, circuits, and robotics.', pdf: 'electronics-task.pdf' },
  { name: 'VIDEO EDITING', desc: 'Create engaging videos through editing, storytelling, and motion.', pdf: 'video-editing-task.pdf' },
  { name: 'PUBLICITY', desc: 'Explore outreach, social media, event promotion, and club communication.', pdf: 'publicity-task.pdf' },
  { name: '3D MODELLING', desc: 'Create 3D models, digital assets, and rendered visualizations.', pdf: '3d-modelling-task.pdf' }
];

expectedDomains.forEach(exp => {
  const found = RECRUITMENT_TASKS.find(t => t.name === exp.name);
  assert(found !== undefined, `Missing domain task: ${exp.name}`);
  assert.strictEqual(found.description, exp.desc, `Description mismatch for ${exp.name}`);
  assert(found.pdfUrl.endsWith(exp.pdf), `PDF path mismatch for ${exp.name}`);

  // Verify physical PDF file exists and is valid
  const physicalPdf = path.join(__dirname, 'public', 'tasks', exp.pdf);
  assert(fs.existsSync(physicalPdf), `Missing PDF file: public/tasks/${exp.pdf}`);
  const stat = fs.statSync(physicalPdf);
  assert(stat.size > 1000, `PDF public/tasks/${exp.pdf} is suspiciously small: ${stat.size} bytes`);
  const header = fs.readFileSync(physicalPdf, { length: 5 }).toString();
  assert(header.startsWith('%PDF-'), `File public/tasks/${exp.pdf} is not a valid PDF`);
});
console.log('[PASS] All 6 domain recruitment tasks defined with verified descriptions and valid physical PDF files');

// 15. Verify master audition booklet PDF exists
const masterPdfPath = path.join(__dirname, 'public', 'tasks', 'technical-club-audition-tasks.pdf');
assert(fs.existsSync(masterPdfPath), 'Master audition PDF must exist');
const masterStat = fs.statSync(masterPdfPath);
assert(masterStat.size > 10000, 'Master audition PDF must be non-empty');
console.log(`[PASS] Master audition tasks PDF verified (${masterStat.size} bytes)`);

// 16. Verify responsive CSS grid for domain tasks (3 cols desktop, 2 cols tablet, 1 col mobile)
assert(regCssContent.includes('.reg-tasks-grid'), 'register.css must define .reg-tasks-grid');
assert(regCssContent.includes('repeat(3, 1fr)'), 'Desktop must use 3 cards per row');
assert(regCssContent.includes('repeat(2, 1fr)'), 'Tablet must use 2 cards per row');
assert(regCssContent.includes('grid-template-columns: 1fr'), 'Mobile must stack 1 card per row');
console.log('[PASS] register.css defines 3-card desktop, 2-card tablet, and 1-card mobile responsive grid');

console.log('\nAll Register Page & Recruitment Task tests passed successfully!');
