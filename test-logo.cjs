const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING TECHNICAL CLUB RBU OFFICIAL LOGO & FAVICON ---');

// 1. Verify file exists in public/ directory with correct size
const logoPath = path.join(__dirname, 'public', 'technical-club-logo.png');
assert(fs.existsSync(logoPath), 'public/technical-club-logo.png must exist');
const stats = fs.statSync(logoPath);
assert(stats.size > 10000, `Logo file size should be substantial (got ${stats.size} bytes)`);
console.log(`[PASS] public/technical-club-logo.png exists (${stats.size} bytes)`);

// 2. Verify PNG header and dimensions
const buf = fs.readFileSync(logoPath);
assert.strictEqual(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a', 'Must be a valid PNG');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
assert.strictEqual(width, 1024, 'Width must match original 1024px');
assert.strictEqual(height, 1024, 'Height must match original 1024px');
console.log(`[PASS] Logo dimensions verified: ${width}x${height} (1:1 square ratio preserved)`);

// 3. Verify index.html contains correct favicon links
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(indexHtml.includes('<link rel="icon" type="image/png" href="/technical-club-logo.png" />'), 'index.html must contain link rel="icon"');
assert(indexHtml.includes('<link rel="apple-touch-icon" href="/technical-club-logo.png" />'), 'index.html must contain link rel="apple-touch-icon"');
console.log('[PASS] index.html favicon and apple-touch-icon links verified with root-relative path');

// 4. Verify SiteNav.jsx contains img element with logo
const siteNavContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'site', 'SiteNav.jsx'), 'utf8');
assert(siteNavContent.includes('src="/technical-club-logo.png"'), 'SiteNav must reference /technical-club-logo.png');
assert(siteNavContent.includes('className="logo-img"'), 'SiteNav must use logo-img class');
assert(siteNavContent.includes('TECHNICAL CLUB'), 'SiteNav must keep text TECHNICAL CLUB beside logo');
assert(!siteNavContent.includes('<Link className="logo px" to="/" onClick={same(\'/\')} aria-label="Technical Club RBU Home">\n          <i aria-hidden="true" />'), 'Blue decorative square <i> must be replaced in SiteNav');
console.log('[PASS] SiteNav.jsx properly renders <img> logo alongside TECHNICAL CLUB brand text');

// 5. Verify base.css defines .logo-img styling
const baseCss = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'base.css'), 'utf8');
assert(baseCss.includes('.logo-img'), 'base.css must define .logo-img rules');
assert(baseCss.includes('object-fit: contain'), '.logo-img must use object-fit: contain to prevent stretching');
console.log('[PASS] base.css provides .logo-img styling with object-fit: contain and crisp presentation');

// 6. Verify dist/ build output has logo copied
const distLogo = path.join(__dirname, 'dist', 'technical-club-logo.png');
assert(fs.existsSync(distLogo), 'dist/technical-club-logo.png must exist after build');
assert.strictEqual(fs.statSync(distLogo).size, stats.size, 'dist logo size must match public logo size');
console.log('[PASS] Production build in dist/ correctly contains technical-club-logo.png');

console.log('\nAll logo and favicon tests passed successfully!');
