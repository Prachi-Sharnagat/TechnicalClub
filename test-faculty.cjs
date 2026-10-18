/**
 * Automated test suite for Faculty Coordinators feature
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING FACULTY COORDINATORS FEATURE ---');

// 1. Check data file exists and exports 3 coordinators
const facultyPath = path.join(__dirname, 'src', 'data', 'faculty.js');
assert(fs.existsSync(facultyPath), 'src/data/faculty.js must exist');
const facultyContent = fs.readFileSync(facultyPath, 'utf8');

assert(facultyContent.includes('export const FACULTY_COORDINATORS'), 'Must export FACULTY_COORDINATORS');
console.log('[PASS] src/data/faculty.js exists and exports FACULTY_COORDINATORS');

// Parse coordinators via regex/evaluation
const coordinatorIds = (facultyContent.match(/id:\s*['"]([^'"]+)['"]/g) || []).map(m => m.replace(/id:\s*['"]|['"]/g, ''));
assert.strictEqual(coordinatorIds.length, 3, 'Must have exactly 3 faculty coordinator profile entries');
console.log(`[PASS] Exactly 3 faculty coordinators defined: ${coordinatorIds.join(', ')}`);

// Verify required fields exist in data
const requiredFields = ['name', 'designation', 'department', 'photo', 'profileUrl', 'isVerified'];
for (const field of requiredFields) {
  assert(facultyContent.includes(field + ':'), `Field "${field}" must exist in coordinator objects`);
}
console.log('[PASS] All required coordinator fields (name, designation, department, photo, profileUrl, isVerified) are present');

// Verify components exist
assert(fs.existsSync(path.join(__dirname, 'src', 'components', 'members', 'FacultyCard.jsx')), 'FacultyCard.jsx must exist');
assert(fs.existsSync(path.join(__dirname, 'src', 'components', 'members', 'FacultySection.jsx')), 'FacultySection.jsx must exist');
assert(fs.existsSync(path.join(__dirname, 'src', 'components', 'site', 'MembersSection.jsx')), 'MembersSection.jsx must exist');
assert(fs.existsSync(path.join(__dirname, 'src', 'styles', 'faculty.css')), 'src/styles/faculty.css must exist');
console.log('[PASS] All component and style files exist');

// Verify MembersSection places FacultySection before OrbitShowcase
const membersSectionContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'site', 'MembersSection.jsx'), 'utf8');
const facultyIdx = membersSectionContent.indexOf('<FacultySection />');
const orbitIdx = membersSectionContent.indexOf('<OrbitShowcase />');
assert(facultyIdx !== -1, 'MembersSection must render FacultySection');
assert(orbitIdx !== -1, 'MembersSection must render OrbitShowcase');
assert(facultyIdx < orbitIdx, 'FacultySection must be placed BEFORE OrbitShowcase');
console.log('[PASS] FacultySection is placed above OrbitShowcase in MembersSection');

// Verify MainPage uses MembersSection in VIEWS
const mainPageContent = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'MainPage.jsx'), 'utf8');
assert(mainPageContent.includes('members: MembersSection'), 'MainPage VIEWS must map members to MembersSection');
console.log('[PASS] MainPage uses MembersSection for members route');

// Verify styles support reduced motion
const cssContent = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'faculty.css'), 'utf8');
assert(cssContent.includes('prefers-reduced-motion'), 'faculty.css must include prefers-reduced-motion media query');
assert(cssContent.includes('repeat(3, 1fr)'), 'faculty.css must support 3 cards in one row on desktop');
console.log('[PASS] faculty.css includes desktop 3-column grid and prefers-reduced-motion rules');

console.log('\nAll Faculty Coordinators tests passed successfully!');
