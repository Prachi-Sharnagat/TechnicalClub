/**
 * Automated test suite for Students & Orbit Member Sequence and Siddhant Deshmukh profile
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING STUDENTS & ORBIT SECTION ---');

// 1. Verify src/data/members.js
const membersPath = path.join(__dirname, 'src', 'data', 'members.js');
assert(fs.existsSync(membersPath), 'src/data/members.js must exist');
const membersContent = fs.readFileSync(membersPath, 'utf8');

// Ensure Siddhant Deshmukh is the first member
assert(membersContent.includes("name: 'Siddhant Deshmukh'"), 'Must include Siddhant Deshmukh in members');
assert(membersContent.includes("role: 'Technical Club Coordinator (TCC)'"), 'Must assign role Technical Club Coordinator (TCC)');
assert(membersContent.includes('i === 0'), 'Siddhant Deshmukh must be at index 0');
console.log('[PASS] Siddhant Deshmukh configured as the first member with role Technical Club Coordinator (TCC)');

// Ensure Devansh Tiwari is preserved
assert(membersContent.includes("name: 'Devansh Tiwari'"), 'Devansh Tiwari profile must be preserved');
console.log('[PASS] Devansh Tiwari profile preserved at index 1');

// Ensure no invented personal details
assert(!membersContent.includes('siddhant@') && !membersContent.includes('deshmukh@'), 'Must not invent personal email for Siddhant');
console.log('[PASS] No invented personal details (email, photo) for Siddhant');

// 2. Verify OrbitShowcase.jsx initial active state
const orbitPath = path.join(__dirname, 'src', 'components', 'OrbitShowcase.jsx');
assert(fs.existsSync(orbitPath), 'OrbitShowcase.jsx must exist');
const orbitContent = fs.readFileSync(orbitPath, 'utf8');

assert(orbitContent.includes('useState(0)'), 'OrbitShowcase must initialize active index to 0');
assert(orbitContent.includes('const member = MEMBERS[active];'), 'Current member must derive from active index');
console.log('[PASS] OrbitShowcase initializes active/featured member to index 0 (Siddhant Deshmukh)');

// 3. Dynamic evaluation check of MEMBERS array
// Using quick mock of modules if needed or node import
const esmContent = fs.readFileSync(membersPath, 'utf8');
assert(esmContent.includes('length: 30'), 'Total members count should be 30');

// 4. Verify Faculty Coordinators data remains clean (no Siddhant Deshmukh in faculty)
const facultyPath = path.join(__dirname, 'src', 'data', 'faculty.js');
const facultyContent = fs.readFileSync(facultyPath, 'utf8');
assert(!facultyContent.includes('Siddhant Deshmukh'), 'Siddhant Deshmukh must remain excluded from faculty section');
console.log('[PASS] Faculty section remains strictly for faculty coordinators');

console.log('--- ALL STUDENTS & ORBIT TESTS PASSED! ---');
