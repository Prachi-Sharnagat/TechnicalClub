// Events content and data model. Images live in src/assets/.
import posterRoboDrive from '../assets/poster-robodrive.jpg';
import posterJeopardy from '../assets/pst2.webp';
import posterRobo from '../assets/pst3.webp';
import posterShinobi from '../assets/pst4.webp';

// Internal registration route (kept intact for existing flow)
export const REGISTER_URL = '/register';
export const registerLink = (title) => `${REGISTER_URL}?event=${encodeURIComponent(title)}`;

export const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfice9Ifzg7YpWEtqGTf3QvIVXtpg9M4_yfXXg_Y2Iv2dfFCw/viewform';
export const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfice9Ifzg7YpWEtqGTf3QvIVXtpg9M4_yfXXg_Y2Iv2dfFCw/viewform?embedded=true';

export const HERO = {
  label: '// CLUB EVENTS',
  title: 'EVENTS',
  intro: "Workshops, contests, robotics and build nights. Explore our active arena, discover upcoming challenges, and check out what we've already achieved."
};

export const EVENT_CATEGORIES = [
  { id: 'ongoing', label: 'ONGOING EVENTS', shortLabel: 'ONGOING', count: 1 },
  { id: 'upcoming', label: 'UPCOMING EVENTS', shortLabel: 'UPCOMING', count: 3 },
  { id: 'past', label: 'PAST EVENTS', shortLabel: 'PAST', count: 3 }
];

export const EVENTS_DATA = [
  // --- ONGOING EVENTS ---
  {
    id: 'robo-drive-2026',
    title: 'ROBO DRIVE',
    slug: 'robo-drive',
    organizer: 'Technical Club RBU',
    tagline: 'Crafted for Speed. Engineered for Precision.',
    description: 'A premier robotics race where participants pilot high-performance RC cars engineered by Technical Club RBU across a specially designed obstacle arena with thrilling speed runs and precision track challenges.',
    date: '22 October 2026',
    time: '10:00 AM onwards',
    venue: 'Digital Tower, Ground Floor Common Area',
    poster: posterRoboDrive,
    posterAlt: 'Official Robo Drive event poster - Technical Club RBU',
    category: 'ROBOTICS',
    displayStatus: 'ongoing',
    registrationOpen: true,
    registrationType: 'google-form',
    registrationUrl: GOOGLE_FORM_URL,
    embedUrl: GOOGLE_FORM_EMBED_URL,
    featured: true,
    sortOrder: 1,
    badge: 'LIVE REGISTRATION'
  },

  // --- UPCOMING EVENTS ---
  {
    id: 'web-dev-workshop',
    title: 'Web Dev Workshop',
    slug: 'web-dev-workshop',
    organizer: 'Technical Club RBU',
    tagline: 'Code modern responsive web apps from zero to hero.',
    text: 'Learn HTML, CSS, JavaScript and React by building a real website with the crew.',
    description: 'Learn HTML, CSS, JavaScript and React by building a real website with the crew.',
    icon: 'ui',
    tag: 'WORKSHOP',
    category: 'WORKSHOP',
    displayStatus: 'upcoming',
    slots: '10 AM - 6 PM',
    date: 'Announcing Soon',
    time: '10:00 AM - 6:00 PM',
    venue: 'Lab DT-304',
    registrationOpen: true,
    registrationType: 'internal',
    registrationUrl: registerLink('Web Dev Workshop'),
    featured: false,
    sortOrder: 1,
    facts: ['Hands-on project', 'Beginners welcome', 'Slots: 10 AM - 6 PM']
  },
  {
    id: 'hack-night',
    title: 'Hack Night',
    slug: 'hack-night',
    organizer: 'Technical Club RBU',
    tagline: 'Overnight collaborative hackathon & prototype build.',
    text: 'Team up and build something in one night. Bring an idea and a laptop.',
    description: 'Team up and build something in one night. Bring an idea and a laptop.',
    icon: 'chip',
    tag: 'HACKATHON',
    category: 'HACKATHON',
    displayStatus: 'upcoming',
    slots: '10 AM - 6 PM',
    date: 'Announcing Soon',
    time: '10:00 AM - 6:00 PM',
    venue: 'Auditorium Block A',
    registrationOpen: true,
    registrationType: 'internal',
    registrationUrl: registerLink('Hack Night'),
    featured: false,
    sortOrder: 2,
    facts: ['Form teams of 2-4', 'Hardware & Software', 'Slots: 10 AM - 6 PM']
  },
  {
    id: 'project-demo-day',
    title: 'Project Demo Day',
    slug: 'project-demo-day',
    organizer: 'Technical Club RBU',
    tagline: 'Showcase your innovations and receive faculty mentorship.',
    text: 'Show what you built and get feedback from the club.',
    description: 'Show what you built and get feedback from the club.',
    icon: 'play',
    tag: 'SHOWCASE',
    category: 'SHOWCASE',
    displayStatus: 'upcoming',
    slots: '10 AM - 6 PM',
    date: 'Announcing Soon',
    time: '10:00 AM - 6:00 PM',
    venue: 'Digital Tower Exhibition Hall',
    registrationOpen: true,
    registrationType: 'internal',
    registrationUrl: registerLink('Project Demo Day'),
    featured: false,
    sortOrder: 3,
    facts: ['Industry mentors', 'Live demos', 'Slots: 10 AM - 6 PM']
  },

  // --- PAST EVENTS ---
  {
    id: 'grandmasters-jeopardy',
    title: "Marvel Assemble: GrandMaster's Jeopardy",
    slug: 'grandmasters-jeopardy',
    organizer: 'Technical Club RBU',
    theme: 'Marvel Assemble',
    tagline: 'Assemble Your Knowledge: A Battle Across Trivial Realms!',
    description: 'A trivia showdown summoning all MCU, comic, and technical lore heroes for a high-stakes team quiz battle.',
    category: 'QUIZ',
    kind: 'QUIZ',
    displayStatus: 'past',
    status: 'Completed',
    date: '7 February',
    time: '11:00 AM onwards',
    venue: 'DT-702',
    poster: posterJeopardy,
    posterAlt: "Marvel Assemble GrandMaster's Jeopardy event poster",
    registrationOpen: false,
    registrationType: 'none',
    featured: true,
    sortOrder: 1,
    badge: 'COMPLETED',
    facts: [
      'Prize pool Rs. 3000'
    ]
  },
  {
    id: 'robo-mania',
    title: 'Robo Mania',
    slug: 'robo-mania',
    organizer: 'Technical Club RBU',
    tagline: 'High-voltage robot showdown powered by Sunshine Engineering.',
    description: 'Three rounds of intense robotic competition including Kaun Banega Robopati, Rush Hour, and Robo Soccer.',
    category: 'ROBOTICS',
    kind: 'ROBOTICS',
    displayStatus: 'past',
    status: 'Completed',
    poster: posterRobo,
    posterAlt: 'Robo Mania robotics tournament poster',
    registrationOpen: false,
    registrationType: 'none',
    featured: false,
    sortOrder: 2,
    badge: 'COMPLETED',
    facts: [
      '3 rounds: Kaun Banega Robopati, Rush Hour, Robo Soccer',
      'Powered by Sunshine Engineering'
    ]
  },
  {
    id: 'shinobi-showdown',
    title: 'Shinobi Showdown',
    slug: 'shinobi-showdown',
    organizer: 'Technical Club RBU',
    tagline: 'Ultimate online competitive coding contest with Coding Ninjas.',
    description: 'Multi-tiered algorithmic contest designed to test speed, efficiency, and edge-case handling.',
    category: 'CODING CONTEST',
    kind: 'CODING CONTEST',
    displayStatus: 'past',
    status: 'Completed',
    date: '23 April',
    time: '1:00 PM to 4:00 PM',
    venue: 'Online Coding Contest',
    poster: posterShinobi,
    posterAlt: 'Shinobi Showdown online coding contest poster',
    registrationOpen: false,
    registrationType: 'none',
    featured: false,
    sortOrder: 3,
    badge: 'COMPLETED',
    facts: [
      'With Coding Ninjas'
    ]
  }
];

// Compatibility exports
export const UPCOMING = EVENTS_DATA.filter((e) => e.displayStatus === 'upcoming');
export const COMPLETED = EVENTS_DATA.filter((e) => e.displayStatus === 'past');
export const ONGOING = EVENTS_DATA.filter((e) => e.displayStatus === 'ongoing');

export function getEventsByStatus(status) {
  return EVENTS_DATA.filter((e) => e.displayStatus === status).sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
}

export const NAV = [
  ['ONGOING', '#events-hub'],
  ['UPCOMING', '#events-hub'],
  ['PAST', '#events-hub']
];
