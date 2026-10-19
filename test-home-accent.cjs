/**
 * Automated test suite for Home Page Scanning/Photo Section Accent Color (#002A74)
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING HOME PAGE SCANNING SECTION COLOR UPDATE ---');

// 1. Verify HomeHero.jsx retains original content and structure
const heroPath = path.join(__dirname, 'src', 'components', 'HomeHero.jsx');
assert(fs.existsSync(heroPath), 'HomeHero.jsx must exist');
const heroContent = fs.readFileSync(heroPath, 'utf8');

assert(heroContent.includes('Window title="lab_cam.exe"'), 'Must preserve Window with title "lab_cam.exe"');
assert(heroContent.includes('className="hero-stage"'), 'Must preserve hero-stage container');
assert(heroContent.includes('className="inner"'), 'Must preserve inner photo container');
assert(heroContent.includes('className="scan"'), 'Must preserve scan element');
assert(heroContent.includes('Pixelated src={image}'), 'Must preserve Pixelated component');
console.log('[PASS] HomeHero.jsx structure, lab_cam.exe title, and scanning elements are preserved');

// 2. Verify HOME data in src/data/home.js preserves image and captions
const homeDataPath = path.join(__dirname, 'src', 'data', 'home.js');
assert(fs.existsSync(homeDataPath), 'src/data/home.js must exist');
const homeData = fs.readFileSync(homeDataPath, 'utf8');

assert(homeData.includes("text: 'Robots that roll'"), 'Must preserve caption "Robots that roll"');
assert(homeData.includes("text: 'Arduino + AI workshops'"), 'Must preserve caption "Arduino + AI workshops"');
assert(homeData.includes("image: heroImg"), 'Must preserve workshop photograph reference (heroImg)');
console.log('[PASS] src/data/home.js captions and workshop photograph preserved');

// 3. Verify CSS in src/styles/home.css
const homeCssPath = path.join(__dirname, 'src', 'styles', 'home.css');
assert(fs.existsSync(homeCssPath), 'src/styles/home.css must exist');
const homeCss = fs.readFileSync(homeCssPath, 'utf8');

// Check local CSS variable
assert(homeCss.includes('--home-scan-accent: #002A74;'), 'Must define local CSS variable --home-scan-accent: #002A74');
console.log('[PASS] --home-scan-accent: #002A74 is defined in .hero-stage');

// Check window frame border uses the new accent
assert(homeCss.includes('.hero-stage .win'), 'Must define .hero-stage .win styling');
assert(homeCss.includes('border: 4px solid var(--home-scan-accent);'), 'Window frame border must use var(--home-scan-accent)');
console.log('[PASS] .hero-stage .win border uses #002A74');

// Check title bar uses new accent for background
assert(homeCss.includes('.hero-stage .bar'), 'Must define .hero-stage .bar styling');
assert(homeCss.includes('background: var(--home-scan-accent);'), 'Title bar background must use var(--home-scan-accent)');
console.log('[PASS] .hero-stage .bar background uses #002A74');

// Check bright blue accents are retained for contrast
assert(homeCss.includes('color: var(--home-scan-bright);') || homeCss.includes('color: #5B8CFF;'), 'Title bar label must maintain bright blue contrast');
assert(homeCss.includes('.hero-stage .bar i'), 'Window bar buttons must be styled');
console.log('[PASS] Bright blue highlights and contrast retained for lab_cam.exe and bar controls');

// Check scanning beam updates
assert(homeCss.includes('.hero-stage .scan::after'), 'Must style .hero-stage .scan::after');
assert(homeCss.includes('rgba(0, 42, 116'), 'Scanning line gradient must incorporate #002A74 (rgba(0, 42, 116))');
console.log('[PASS] Scanning beam gradient incorporates #002A74');

// Check chip styling
assert(homeCss.includes('.hero-stage .chip'), 'Must style .hero-stage .chip');
assert(homeCss.includes('border-color: var(--home-scan-accent);'), 'Chips must use var(--home-scan-accent) border');
console.log('[PASS] Floating captions/chips use #002A74 border');

// 4. Verify global tokens in base.css were NOT accidentally modified
const baseCssPath = path.join(__dirname, 'src', 'styles', 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
assert(!baseCss.includes('#002A74'), 'Global base.css must not be modified with local section color #002A74');
console.log('[PASS] Global color scheme in base.css is preserved without leakage');

console.log('--- ALL HOME PAGE COLOR UPDATE TESTS PASSED! ---');
