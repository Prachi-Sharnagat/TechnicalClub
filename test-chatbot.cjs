const fs = require('fs');

// Simple harness to evaluate and test ES modules in Node.js
function loadModule(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  // Strip import/export syntax for CommonJS evaluation
  code = code.replace(/import\s+.*?\s+from\s+['"][^'"]+['"];?/g, '');
  code = code.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 = exports.$1 =');
  code = code.replace(/export\s+function\s+(\w+)/g, 'const $1 = exports.$1 = function');
  code = code.replace(/export\s+default\s+/g, 'exports.default = ');

  const mod = { exports: {} };
  const fn = new Function('exports', 'module', code);
  fn(mod.exports, mod);
  return mod.exports;
}

console.log('--- TESTING TC-BOT INTENT MATCHING & KNOWLEDGE BASE ---');

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

// 1. Test Knowledge Base
const kb = loadModule('./src/lib/chatbotKnowledgeBase.js');
assert(kb.BOT_IDENTITY.name === 'TC-BOT', 'Bot name is TC-BOT');
assert(Boolean(kb.INITIAL_GREETING.text), 'Initial greeting is defined');
assert(kb.INITIAL_GREETING.text.includes("Hey there! 👾 Welcome to Technical Club RBU."), 'Greeting starts with approved text');
assert(kb.INITIAL_GREETING.text.includes("Learn. Build. Innovate. Repeat. 🚀"), 'Greeting contains approved mission');
assert(Array.isArray(kb.SUGGESTED_QUESTIONS) && kb.SUGGESTED_QUESTIONS.length === 8, '8 suggested questions provided');

// Verify Robo Drive in KB
const rd = kb.KNOWLEDGE_BASE.roboDrive;
assert(rd.summary.includes('ROBO DRIVE'), 'Robo Drive summary present');
assert(rd.summary.includes('22 October 2026'), 'Robo Drive date is 22 October 2026');
assert(rd.summary.includes('Digital Tower'), 'Robo Drive venue is Digital Tower');
assert(rd.actions.some(a => a.url && a.url.includes('docs.google.com/forms')), 'Google Form action present');

// 2. Test Intent Matcher
// Wire mock knowledge base into intent matcher
let matcherCode = fs.readFileSync('./src/lib/chatbotIntentMatcher.js', 'utf8');
matcherCode = matcherCode.replace(/import\s+\{\s*KNOWLEDGE_BASE\s*\}\s+from\s+['"][^'"]+['"];?/, 'const KNOWLEDGE_BASE = kbMod.KNOWLEDGE_BASE;');
matcherCode = matcherCode.replace(/export\s+function\s+(\w+)/g, 'const $1 = exports.$1 = function');

const matcherMod = { exports: {} };
const fn = new Function('exports', 'module', 'kbMod', matcherCode);
fn(matcherMod.exports, matcherMod, kb);

const { matchUserIntent, generateBotResponse, normalizeQuery } = matcherMod.exports;

// Test Normalization
assert(normalizeQuery('  Hello, World!! 123  ') === 'hello world 123', 'Normalizer strips punctuation and trims');
assert(normalizeQuery('') === '', 'Normalizer handles empty input');
assert(normalizeQuery(null) === '', 'Normalizer handles null safely');

// Test All 8 Suggested Questions Match Intended Nodes
const testCases = [
  { q: 'Who are we?', expectedId: 'who-we-are' },
  { q: 'What are our technical domains?', expectedId: 'technical-domains' },
  { q: 'What events do we organize?', expectedId: 'events-overview' },
  { q: 'What is Robo Drive?', expectedId: 'robo-drive-details' },
  { q: 'What projects do we work on?', expectedId: 'club-projects' },
  { q: 'How can I join the club?', expectedId: 'join-recruitment' },
  { q: 'Where can I find event registrations?', expectedId: 'event-registrations' },
  { q: 'How can I contact the club?', expectedId: 'contact-info' }
];

testCases.forEach(({ q, expectedId }) => {
  const node = matchUserIntent(q);
  assert(node && node.id === expectedId, `Query "${q}" maps to node "${expectedId}" (got "${node?.id}")`);
});

// Test Common Phrasing Variations
const variations = [
  { q: 'tell me about web dev and graphics', expectedId: 'technical-domains' },
  { q: 'when is the rc car racing competition', expectedId: 'robo-drive-details' },
  { q: 'how do i register for hackathon', expectedId: 'event-registrations' },
  { q: 'email address of the club', expectedId: 'contact-info' },
  { q: 'how to be a member', expectedId: 'join-recruitment' },
  { q: 'hi there', expectedId: 'greeting' },
  { q: 'hello tc bot', expectedId: 'greeting' }
];

variations.forEach(({ q, expectedId }) => {
  const node = matchUserIntent(q);
  assert(node && node.id === expectedId, `Variation "${q}" maps to node "${expectedId}"`);
});

// Test Fallback on Unknown Query
const fallbackNode = matchUserIntent('xyzqwerty123asdfghjkl987654');
assert(fallbackNode && fallbackNode.id === 'unknown-query', 'Unmatched query maps to friendly fallback');

// Test Response Generation
const response = generateBotResponse('What is Robo Drive?');
assert(response.sender === 'bot', 'Response sender is bot');
assert(response.text.includes('ROBO DRIVE'), 'Response contains Robo Drive details');
assert(Array.isArray(response.actions) && response.actions.length > 0, 'Response contains action buttons');
assert(Boolean(response.timestamp), 'Response has timestamp');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
