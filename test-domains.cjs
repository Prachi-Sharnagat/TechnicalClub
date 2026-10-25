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
assert.strictEqual(DOMAINS.length, 6, `Must have exactly 6 domains (got ${DOMAINS.length})`);
console.log(`[PASS] DOMAINS array contains exactly 6 domains`);

// 2. Verify all 6 domain slugs
const expectedSlugs = ['web-dev', 'graphics', 'electronics', 'video-editing', 'publicity', '3d-modelling'];
expectedSlugs.forEach((slug) => {
  const found = DOMAINS.find((d) => d.slug === slug);
  assert(found !== undefined, `Missing domain with slug: ${slug}`);
});
console.log('[PASS] All 6 required domains (web-dev, graphics, electronics, video-editing, publicity, 3d-modelling) are present');

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

// 3b. Verify 3D Modelling domain details
const mod3d = DOMAINS.find((d) => d.slug === '3d-modelling');
assert.strictEqual(mod3d.name.toUpperCase(), '3D MODELLING', '3D Modelling title must be 3D MODELLING');
assert.strictEqual(
  mod3d.text,
  'Create 3D models, design digital assets, and explore 3D visualization, rendering, and modelling workflows.',
  '3D Modelling description must match required copy exactly'
);
assert(mod3d.icon, '3D Modelling must have an icon defined');
console.log('[PASS] 3D Modelling domain title, description, and icon verified');

// 4. Verify Px.jsx supports Publicity & 3D Modelling icons
const pxPath = path.join(__dirname, 'src', 'components', 'graphics', 'Px.jsx');
const pxCode = fs.readFileSync(pxPath, 'utf8');
assert(pxCode.includes(`${pub.icon}:`), `Px.jsx BITS must include bitmap for icon: ${pub.icon}`);
assert(pxCode.includes(`${mod3d.icon}:`), `Px.jsx BITS must include bitmap for icon: ${mod3d.icon}`);
console.log(`[PASS] Px.jsx contains pixel art bitmap for icons: ${pub.icon}, ${mod3d.icon}`);

// 5. Verify App.jsx has routes for publicity and 3d-modelling
const appPath = path.join(__dirname, 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
assert(appCode.includes('/domains/publicity'), 'App.jsx must include route for /domains/publicity');
assert(appCode.includes('PublicityPage'), 'App.jsx must import and render PublicityPage');
assert(appCode.includes('/domains/3d-modelling'), 'App.jsx must include route for /domains/3d-modelling');
assert(appCode.includes('ThreeDModellingPage'), 'App.jsx must import and render ThreeDModellingPage');
console.log('[PASS] App.jsx defines working routes for /domains/publicity and /domains/3d-modelling');

// 6. Verify PublicityPage.jsx and ThreeDModellingPage.jsx exist
const pubPagePath = path.join(__dirname, 'src', 'pages', 'PublicityPage.jsx');
assert(fs.existsSync(pubPagePath), 'PublicityPage.jsx must exist');
const pubPageCode = fs.readFileSync(pubPagePath, 'utf8');
assert(pubPageCode.includes('PUBLICITY'), 'PublicityPage must render PUBLICITY data');
assert(pubPageCode.includes('JoinCta') || pubPageCode.includes('/register'), 'PublicityPage must have working join interaction');

const modPagePath = path.join(__dirname, 'src', 'pages', 'ThreeDModellingPage.jsx');
assert(fs.existsSync(modPagePath), 'ThreeDModellingPage.jsx must exist');
const modPageCode = fs.readFileSync(modPagePath, 'utf8');
assert(modPageCode.includes('MODELLING'), 'ThreeDModellingPage must render MODELLING data');
assert(modPageCode.includes('JoinCta') || modPageCode.includes('/register'), 'ThreeDModellingPage must have working join interaction');
console.log('[PASS] PublicityPage.jsx and ThreeDModellingPage.jsx are complete and consistent');

// 7. Verify site.css responsive grid rules for .cards4
const cssPath = path.join(__dirname, 'src', 'styles', 'site.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');
assert(cssCode.includes('.cards4'), 'site.css must define .cards4');
assert(cssCode.includes('repeat(4, 1fr)'), '.cards4 must use 4 columns on large screens');
assert(cssCode.includes('repeat(2, 1fr)'), '.cards4 must use 2 columns on tablet');
assert(cssCode.includes('grid-template-columns: 1fr'), '.cards4 must stack 1 column on mobile');
console.log('[PASS] site.css includes 4-column large screen grid, wrapping 5th card, tablet 2-col, and mobile 1-col');

// 8. Verify public/web-dev-guide.pdf exists and is valid
const pdfPath = path.join(__dirname, 'public', 'web-dev-guide.pdf');
assert(fs.existsSync(pdfPath), 'public/web-dev-guide.pdf must exist');
const pdfStat = fs.statSync(pdfPath);
assert(pdfStat.size > 1000, `web-dev-guide.pdf must be non-empty (got ${pdfStat.size} bytes)`);
const pdfHeader = fs.readFileSync(pdfPath, { length: 5 });
assert(pdfHeader.toString().startsWith('%PDF-'), 'web-dev-guide.pdf must be a valid PDF file');
console.log('[PASS] public/web-dev-guide.pdf exists, is non-empty, and has valid PDF header');

// 9. Verify JOIN WEB DEV button links directly to /web-dev-guide.pdf with safe external attributes
const heroPath = path.join(__dirname, 'src', 'components', 'WebDevHero.jsx');
const heroCode = fs.readFileSync(heroPath, 'utf8');
assert(heroCode.includes('JOIN WEB DEV'), 'WebDevHero.jsx must render JOIN WEB DEV button');
assert(heroCode.includes('/web-dev-guide.pdf'), 'WebDevHero.jsx JOIN WEB DEV button must link to /web-dev-guide.pdf');
assert(heroCode.includes('target="_blank"'), 'WebDevHero.jsx JOIN WEB DEV button must open in new tab');
assert(heroCode.includes('rel="noopener noreferrer"'), 'WebDevHero.jsx JOIN WEB DEV button must include safe external rel');

const webdevPagePath = path.join(__dirname, 'src', 'pages', 'WebDevPage.jsx');
const webdevPageCode = fs.readFileSync(webdevPagePath, 'utf8');
assert(webdevPageCode.includes('JOIN WEB DEV'), 'WebDevPage.jsx Banner must include JOIN WEB DEV');
assert(webdevPageCode.includes('/web-dev-guide.pdf'), 'WebDevPage.jsx Banner must link to /web-dev-guide.pdf');
assert(webdevPageCode.includes("target: '_blank'"), 'WebDevPage.jsx Banner must have target: _blank');

console.log('[PASS] WebDevHero.jsx and WebDevPage.jsx JOIN WEB DEV buttons connected to /web-dev-guide.pdf with safe attributes');

console.log('\nAll Domains & Publicity tests passed successfully!');
