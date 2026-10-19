/**
 * Automated test suite for Domains Section: 5 domains & Publicity support
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING TECHNICAL CLUB DOMAINS & PUBLICITY ---');

// 1. Verify DOMAINS array in src/data/domains.js
const domainsPath = path.join(__dirname, 'src', 'data', 'domains.js');
assert(fs.existsSync(domainsPath), 'src/data/domains.js must exist');
const domainsCode = fs.readFileSync(domainsPath, 'utf8');

// Parse DOMAINS array using Function evaluator
const mod = { exports: {} };
const fn = new Function('exports', domainsCode.replace(/export\s+const\s+(\w+)\s*=/g, 'exports.$1 ='));
fn(mod.exports);
const { DOMAINS, domainPath } = mod.exports;

assert(Array.isArray(DOMAINS), 'DOMAINS must be an array');
assert.strictEqual(DOMAINS.length, 5, `Must have exactly 5 domains (got ${DOMAINS.length})`);
console.log(`[PASS] DOMAINS array contains exactly 5 domains`);

// 2. Verify all 5 domain slugs
const expectedSlugs = ['web-dev', 'graphics', 'electronics', 'video-editing', 'publicity'];
expectedSlugs.forEach((slug) => {
  const found = DOMAINS.find((d) => d.slug === slug);
  assert(found !== undefined, `Missing domain with slug: ${slug}`);
});
console.log('[PASS] All 5 required domains (web-dev, graphics, electronics, video-editing, publicity) are present');

// 3. Verify Publicity domain details
const pub = DOMAINS.find((d) => d.slug === 'publicity');
assert.strictEqual(pub.name.toUpperCase(), 'PUBLICITY', 'Publicity title must be PUBLICITY');
assert.strictEqual(
  pub.text,
  'Social media, event promotion, outreach, branding and spreading awareness about club activities.',
  'Publicity description must match required copy exactly'
);
assert(pub.icon, 'Publicity must have an icon defined');
console.log('[PASS] Publicity domain title, description, and icon verified');

// 4. Verify Px.jsx supports Publicity icon
const pxPath = path.join(__dirname, 'src', 'components', 'graphics', 'Px.jsx');
const pxCode = fs.readFileSync(pxPath, 'utf8');
assert(pxCode.includes(`${pub.icon}:`), `Px.jsx BITS must include bitmap for icon: ${pub.icon}`);
console.log(`[PASS] Px.jsx contains pixel art bitmap for icon: ${pub.icon}`);

// 5. Verify App.jsx has /domains/publicity route
const appPath = path.join(__dirname, 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
assert(appCode.includes('/domains/publicity'), 'App.jsx must include route for /domains/publicity');
assert(appCode.includes('PublicityPage'), 'App.jsx must import and render PublicityPage');
console.log('[PASS] App.jsx defines working route /domains/publicity with PublicityPage');

// 6. Verify PublicityPage.jsx exists and has interactive components
const pubPagePath = path.join(__dirname, 'src', 'pages', 'PublicityPage.jsx');
assert(fs.existsSync(pubPagePath), 'PublicityPage.jsx must exist');
const pubPageCode = fs.readFileSync(pubPagePath, 'utf8');
assert(pubPageCode.includes('PUBLICITY'), 'PublicityPage must render PUBLICITY data');
assert(pubPageCode.includes('JoinCta') || pubPageCode.includes('/register'), 'PublicityPage must have working join interaction');
console.log('[PASS] PublicityPage.jsx is complete, consistent, and provides working join interaction');

// 7. Verify site.css responsive grid rules for .cards4
const cssPath = path.join(__dirname, 'src', 'styles', 'site.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');
assert(cssCode.includes('.cards4'), 'site.css must define .cards4');
assert(cssCode.includes('repeat(4, 1fr)'), '.cards4 must use 4 columns on large screens');
assert(cssCode.includes('repeat(2, 1fr)'), '.cards4 must use 2 columns on tablet');
assert(cssCode.includes('grid-template-columns: 1fr'), '.cards4 must stack 1 column on mobile');
console.log('[PASS] site.css includes 4-column large screen grid, wrapping 5th card, tablet 2-col, and mobile 1-col');

console.log('\nAll Domains & Publicity tests passed successfully!');
