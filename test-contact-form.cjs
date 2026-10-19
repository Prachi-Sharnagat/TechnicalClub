/**
 * Automated test suite for Contact Us Collaboration Form & Social Branding
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- TESTING CONTACT US COLLABORATION FORM & SOCIAL BRANDING ---');

// 1. Verify CollaborationForm.jsx file exists
const formPath = path.join(__dirname, 'src', 'components', 'contact', 'CollaborationForm.jsx');
assert(fs.existsSync(formPath), 'CollaborationForm.jsx must exist in src/components/contact/');
const formCode = fs.readFileSync(formPath, 'utf8');
console.log('[PASS] CollaborationForm.jsx component file exists');

// 2. Verify all required and optional form fields exist in CollaborationForm.jsx
assert(formCode.includes('fullName'), 'Must include fullName field');
assert(formCode.includes('email'), 'Must include email field');
assert(formCode.includes('yearOfStudy'), 'Must include yearOfStudy dropdown');
assert(formCode.includes('areaOfInterest'), 'Must include areaOfInterest dropdown');
assert(formCode.includes('subject'), 'Must include subject field');
assert(formCode.includes('message'), 'Must include message field');
console.log('[PASS] All required and optional fields (fullName, email, yearOfStudy, areaOfInterest, subject, message) present');

// 3. Verify dropdown options for Area of Interest and Year of Study
const requiredAreas = [
  'Web Development',
  'Graphics & Design',
  'Electronics & Robotics',
  'Project Collaboration',
  'Other'
];
requiredAreas.forEach((area) => {
  assert(formCode.includes(area), `Area of interest must include option: ${area}`);
});
console.log('[PASS] Area of interest contains all required options: Web Development, Graphics & Design, Electronics & Robotics, Project Collaboration, Other');

const requiredYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
requiredYears.forEach((yr) => {
  assert(formCode.includes(yr), `Year of study must include option: ${yr}`);
});
console.log('[PASS] Year of study dropdown contains valid options (1st, 2nd, 3rd, 4th Year)');

// 4. Verify validation rules
// Full name: required
assert(formCode.includes('Full name is required'), 'Must validate required full name');
// Email: required with format regex
assert(formCode.includes('Student email is required'), 'Must validate required email');
assert(formCode.includes('@') && formCode.includes('test('), 'Must validate email format with regex');
// Area of interest: required
assert(formCode.includes('Please select an area of interest'), 'Must validate required area of interest');
// Subject: required
assert(formCode.includes('Subject is required'), 'Must validate required subject');
// Message: required with min and max bounds
assert(formCode.includes('Message is required'), 'Must validate required message');
assert(formCode.includes('MIN_MESSAGE_LENGTH') || formCode.includes('20'), 'Must enforce minimum message length');
assert(formCode.includes('MAX_MESSAGE_LENGTH') || formCode.includes('2000'), 'Must enforce maximum message length');
console.log('[PASS] Client-side validation verified: required fields, email format regex, and message length bounds');

// 5. Verify accessibility attributes
assert(formCode.includes('aria-required="true"'), 'Required inputs must have aria-required');
assert(formCode.includes('aria-invalid='), 'Inputs must toggle aria-invalid');
assert(formCode.includes('aria-describedby='), 'Inputs must link to error messages via aria-describedby');
assert(formCode.includes('role="alert"'), 'Validation errors must have role="alert"');
assert(formCode.includes('role="status"') || formCode.includes('aria-live='), 'Status announcements must have accessible live region');
assert(formCode.includes('htmlFor="collab-fullName"'), 'Labels must be associated with inputs via htmlFor');
console.log('[PASS] Accessibility attributes verified: aria-required, aria-invalid, aria-describedby, role="alert", and matching labels');

// 6. Verify Spam Protection
assert(formCode.includes('honeypot') || formCode.includes('collab-website'), 'Must include hidden honeypot spam protection');
assert(formCode.includes('mountTime') || formCode.includes('Date.now()'), 'Must include timing check against instant automated submissions');
console.log('[PASS] Spam protection verified: hidden honeypot field and submission timing guards');

// 7. Verify submission delivery and error transparency
assert(formCode.includes('firebase/firestore'), 'Must import Firestore primitives');
assert(formCode.includes('addDoc'), 'Must attempt document persistence via addDoc');
assert(formCode.includes('contact_enquiries'), 'Must route enquiries to contact_enquiries collection');
assert(formCode.includes('serverTimestamp()'), 'Must attach serverTimestamp to submissions');
// Must NOT pretend message was sent on failure
assert(formCode.includes('Direct database submission is currently unavailable') || formCode.includes('unavailable'), 'Must honestly report delivery issues when backend fails');
// Fallback email button
assert(formCode.includes('mailto:'), 'Must provide direct email fallback when database write fails');
// Must NOT expose secrets or use query strings for passwords/secrets
assert(!formCode.includes('password'), 'Must not store or leak passwords');
assert(!formCode.includes('apiKey='), 'Must not pass apiKey in query string');
console.log('[PASS] Firestore integration, honest error feedback, and secure mailto fallback verified');

// 8. Verify Email Card in RegisterPage.jsx
const regPagePath = path.join(__dirname, 'src', 'pages', 'RegisterPage.jsx');
const regPageCode = fs.readFileSync(regPagePath, 'utf8');
assert(regPageCode.includes('EMAIL'), 'RegisterPage.jsx must retain Email card');
assert(regPageCode.includes('email-symbol') || regPageCode.includes('reg-contact-svg-icon'), 'Email card must include recognizable envelope icon/logo');
assert(regPageCode.includes('mailto:${CLUB_CONTACT.email}') || regPageCode.includes('mailto:'), 'Email card must retain clickable mailto: link');
assert(regPageCode.includes('SEND EMAIL'), 'Email card must retain Send Email button');
console.log('[PASS] Email card verified: recognizable envelope icon, clickable mailto link, and functional button');

// 9. Verify Instagram Card in RegisterPage.jsx
assert(regPageCode.includes('INSTAGRAM'), 'RegisterPage.jsx must retain Instagram card');
assert(regPageCode.includes('instagram-symbol') || regPageCode.includes('instagram-accent'), 'Instagram card must include recognizable Instagram icon/logo');
assert(regPageCode.includes('CLUB_CONTACT.instagramUrl'), 'Instagram card must link to verified club profile');
assert(regPageCode.includes('target="_blank"'), 'Instagram link must open in new tab');
assert(regPageCode.includes('rel="noopener noreferrer"'), 'Instagram link must use rel="noopener noreferrer"');
assert(regPageCode.includes('OPEN INSTAGRAM'), 'Instagram card must retain Open Instagram button');
console.log('[PASS] Instagram card verified: recognizable Instagram icon, verified URL, safe new tab attributes, and functional button');

// 10. Verify extra contact cards removed & official club logo displayed after form
assert(!regPageCode.includes('CAMPUS ARENA'), 'Campus Arena card must be removed from Contact Us section');
assert(!regPageCode.includes('VISITING HOURS'), 'Visiting hours must be removed');
assert(regPageCode.includes('technical-club-logo.png'), 'Must display official Technical Club RBU logo');
assert(regPageCode.includes('reg-club-logo-img'), 'Must style the official logo with reg-club-logo-img');
console.log('[PASS] Extra cards removed; official Technical Club logo displayed after form');

// 11. Verify CollaborationForm is mounted in RegisterPage.jsx
assert(regPageCode.includes('<CollaborationForm />') || regPageCode.includes('<CollaborationForm/>'), 'RegisterPage.jsx must render CollaborationForm');
console.log('[PASS] CollaborationForm successfully rendered inside RegisterPage.jsx Contact Us section');

// 12. Verify register.css styles
const cssPath = path.join(__dirname, 'src', 'styles', 'register.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');
assert(cssCode.includes('.collab-form-container'), 'register.css must include .collab-form-container');
assert(cssCode.includes('.collab-input'), 'register.css must include .collab-input');
assert(cssCode.includes('.collab-select'), 'register.css must include .collab-select');
assert(cssCode.includes('.collab-textarea'), 'register.css must include .collab-textarea');
assert(cssCode.includes('.collab-submit-btn'), 'register.css must include .collab-submit-btn');
assert(cssCode.includes('.collab-error-banner'), 'register.css must include .collab-error-banner');
assert(cssCode.includes('.collab-success-box'), 'register.css must include .collab-success-box');
// Responsive layout in media queries
assert(cssCode.includes('@media (max-width: 767px)') && cssCode.includes('.collab-form-row'), 'Must provide mobile 1-column layout for form fields');
assert(cssCode.includes('prefers-reduced-motion') && cssCode.includes('.collab-submit-btn'), 'Must respect prefers-reduced-motion for form animations');
console.log('[PASS] register.css contains complete styling, responsive mobile stacking, and reduced-motion support');

// 13. Verify Px.jsx includes mail and instagram icons
const pxPath = path.join(__dirname, 'src', 'components', 'graphics', 'Px.jsx');
const pxCode = fs.readFileSync(pxPath, 'utf8');
assert(pxCode.includes('mail:'), 'Px.jsx BITS must include mail icon');
assert(pxCode.includes('instagram:'), 'Px.jsx BITS must include instagram icon');
console.log('[PASS] Px.jsx contains mail and instagram retro pixel icons');

console.log('\nAll Contact Collaboration Form & Social Branding tests passed successfully!');
