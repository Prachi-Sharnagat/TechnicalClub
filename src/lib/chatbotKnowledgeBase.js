/**
 * TC-BOT Knowledge Base
 * Fully verified club facts derived from existing repository content,
 * routes, domain pages, and verified event data.
 *
 * Strict constraint: No invented statistics, member counts, or unverified claims.
 */

export const BOT_IDENTITY = {
  name: 'TC-BOT',
  subtitle: 'Your Technical Club RBU Assistant',
  avatar: 'bot',
  status: 'ONLINE // READY'
};

export const INITIAL_GREETING = {
  id: 'msg-welcome',
  sender: 'bot',
  text: `Hey there! 👾 Welcome to Technical Club RBU.
We're a student-driven technology community where creativity meets innovation. From coding and web development to electronics and design, we explore ideas, build projects, organize events, and learn together.
Our mission? Learn. Build. Innovate. Repeat. 🚀
What would you like to explore?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  showSuggestions: true
};

export const SUGGESTED_QUESTIONS = [
  'Who are we?',
  'What are our technical domains?',
  'What events do we organize?',
  'What is Robo Drive?',
  'What projects do we work on?',
  'How can I join the club?',
  'Where can I find event registrations?',
  'How can I contact the club?'
];

export const KNOWLEDGE_BASE = {
  whoWeAre: {
    id: 'who-we-are',
    title: 'Who We Are',
    summary: `Technical Club RBU is a student-driven technology community based at Ramdeobaba University, Nagpur.

We bring together passionate coders, makers, designers, and innovators. Our community hosts workshops, build nights, technical competitions, and collaborative projects designed to turn theoretical ideas into working real-world solutions.`,
    actions: [
      { label: 'VISIT HOME', path: '/', isInternal: true },
      { label: 'EXPLORE DOMAINS', path: '/domains', isInternal: true }
    ],
    followUps: ['What are our technical domains?', 'What is Robo Drive?', 'How can I join the club?']
  },

  domains: {
    id: 'technical-domains',
    title: 'Our Technical Domains',
    summary: `Technical Club is organized into six specialized core domains:

1. 🌐 Web Development — Building modern responsive web applications, frontend architectures with React, APIs, and full-stack solutions.
2. 🎨 Graphics & Design — Creative visual storytelling, UI/UX prototyping, event branding, posters, and motion design.
3. ⚡ Electronics & Robotics — Hardware prototyping, Arduino, microcontrollers, embedded systems, and competitive robotics.
4. 🎬 Video Editing — Cinematic visual editing, DaVinci Resolve workflows, motion graphics, and creative event media.
5. 📢 Publicity — Social media, event promotion, outreach, branding and spreading awareness about club activities.
6. 🧊 3D Modelling — 3D asset creation, digital modelling, rendering workflows, and spatial visualization.`,
    actions: [
      { label: 'WEB DEV DOMAIN', path: '/domains/web-dev', isInternal: true },
      { label: 'GRAPHICS DOMAIN', path: '/domains/graphics', isInternal: true },
      { label: 'ELECTRONICS DOMAIN', path: '/domains/electronics', isInternal: true },
      { label: 'VIDEO EDITING', path: '/domains/video-editing', isInternal: true },
      { label: 'PUBLICITY DOMAIN', path: '/domains/publicity', isInternal: true },
      { label: '3D MODELLING', path: '/domains/3d-modelling', isInternal: true }
    ],
    followUps: ['What is Robo Drive?', 'What projects do we work on?', 'How can I join the club?']
  },

  events: {
    id: 'events-overview',
    title: 'Club Events',
    summary: `We organize high-impact technical events across three categories:

• ONGOING:
- No live events running today. Stay tuned for our next arena announcement!

• UPCOMING:
- Web Dev Workshop — Hands-on responsive web creation.
- Hack Night — Overnight collaborative prototype hackathon.
- Project Demo Day — Showcase innovations and receive club feedback.

• PAST HIGHLIGHTS:
- ROBO DRIVE — High-speed RC car obstacle course racing (22 October 2026, Digital Tower). Concluded successfully!
- Marvel Assemble: GrandMaster's Jeopardy — Marvel trivia quiz battle (Completed).
- Robo Mania — 3-round robotics tournament with Kaun Banega Robopati & Robo Soccer.
- Shinobi Showdown — Online competitive coding contest with Coding Ninjas.`,
    actions: [
      { label: 'VIEW ALL EVENTS', path: '/events', isInternal: true },
      { label: 'PAST HIGHLIGHTS', path: '/events?tab=past', isInternal: true }
    ],
    followUps: ['What is Robo Drive?', 'Where can I find event registrations?', 'How can I join the club?']
  },

  roboDrive: {
    id: 'robo-drive-details',
    title: 'ROBO DRIVE 2026',
    summary: `🏎️ ROBO DRIVE — Crafted for Speed. Engineered for Precision.

• Organizer: Technical Club RBU
• Date: 22 October 2026
• Time: 10:00 AM onwards
• Venue: Digital Tower, Ground Floor Common Area (near Lift 4)
• What it is: A premier robotics contest where participants piloted high-performance RC cars engineered by Technical Club through a custom obstacle arena with speed runs and precision challenges. Bots were provided by the club!

Status: Event successfully concluded! View the official poster and highlights in our Past Events gallery.`,
    actions: [
      { label: 'VIEW ROBO DRIVE POSTER', path: '/events?tab=past', isInternal: true },
      {
        label: 'ROBO DRIVE GOOGLE FORM',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSfice9Ifzg7YpWEtqGTf3QvIVXtpg9M4_yfXXg_Y2Iv2dfFCw/viewform',
        isInternal: false
      }
    ],
    followUps: ['Where can I find event registrations?', 'What are our technical domains?', 'How can I contact the club?']
  },

  projects: {
    id: 'club-projects',
    title: 'Projects & Build Nights',
    summary: `Our members actively build real-world software, hardware prototypes, and creative media:

• Web Applications: Real-time club platforms, interactive portfolios, event management portals, and community tools.
• Robotics & Hardware: Custom-built RC racing cars for Robo Drive, obstacle-avoiding bots, Arduino sensor rigs, and automated arena systems.
• Design & Media: Visual identities, event posters, retro pixel art, video highlights, and UI kits.

We host collaborative build nights where seniors mentor juniors from project idea to working deployment.`,
    actions: [
      { label: 'VIEW DOMAIN WORK', path: '/domains', isInternal: true },
      { label: 'MEET THE TEAM', path: '/members', isInternal: true }
    ],
    followUps: ['What are our technical domains?', 'How can I join the club?', 'What is Robo Drive?']
  },

  joinClub: {
    id: 'join-recruitment',
    title: 'Joining Technical Club',
    summary: `Technical Club welcomes enthusiastic students across all years and branches of RBU!

How to get involved:
1. Participate in our active events like Robo Drive, workshops, and hackathons.
2. Join our hands-on beginner build sessions.
3. Apply during our annual recruitment drives.
4. Fill out our club member interest / sign-in form to get notified about upcoming openings.`,
    actions: [
      { label: 'GO TO REGISTER', path: '/register', isInternal: true },
      { label: 'SEE UPCOMING WORKSHOPS', path: '/events?tab=upcoming', isInternal: true }
    ],
    followUps: ['What are our technical domains?', 'Where can I find event registrations?', 'How can I contact the club?']
  },

  registrations: {
    id: 'event-registrations',
    title: 'Event Registrations',
    summary: `Here is the current registration status:

1. Workshops & Hackathons (Web Dev Workshop, Hack Night, Demo Day):
   Status: 🟡 OPEN VIA INTERNAL PORTAL (/register)

2. Past Events:
   ROBO DRIVE (22 Oct 2026) and Marvel Assemble: Jeopardy are completed and entries are closed. Check the Events tab to see highlights!`,
    actions: [
      { label: 'INTERNAL REGISTER PAGE', path: '/register', isInternal: true },
      { label: 'PAST EVENTS GALLERY', path: '/events?tab=past', isInternal: true },
      {
        label: 'ROBO DRIVE GOOGLE FORM',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSfice9Ifzg7YpWEtqGTf3QvIVXtpg9M4_yfXXg_Y2Iv2dfFCw/viewform',
        isInternal: false
      }
    ],
    followUps: ['What is Robo Drive?', 'What events do we organize?', 'How can I contact the club?']
  },

  faculty: {
    id: 'faculty-coordinators',
    title: 'Faculty Coordinators',
    summary: `Technical Club RBU is guided by our institutional faculty coordinators and advisors who provide academic mentorship, governance, and technical leadership.

You can view our three faculty coordinator profiles at the very top of the Members page, featured before the student member orbit!`,
    actions: [
      { label: 'VIEW FACULTY COORDINATORS', path: '/members', isInternal: true },
      { label: 'WHO ARE WE?', path: '/', isInternal: true }
    ],
    followUps: ['Who are we?', 'What are our technical domains?', 'What projects do we work on?']
  },

  instagram: {
    id: 'instagram-social',
    title: 'Official Instagram — Technical Club RBU',
    summary: `📸 Follow Technical Club RBU on Instagram!

• Handle: @technicalclubrbu
• Link: https://www.instagram.com/technicalclubrbu/

Stay connected for live event updates, Robo Drive highlights, hackathon announcements, workshop registrations, and student projects!`,
    actions: [
      {
        label: 'OPEN INSTAGRAM',
        url: 'https://www.instagram.com/technicalclubrbu/',
        isInternal: false
      },
      {
        label: 'EMAIL US',
        url: 'mailto:technicalclub@rknec.edu',
        isInternal: false
      }
    ],
    followUps: ['What events do we organize?', 'What is Robo Drive?', 'How can I contact the club?']
  },

  contact: {
    id: 'contact-info',
    title: 'Contact Technical Club RBU',
    summary: `You can reach out to Technical Club through the following verified channels:

• Instagram: @technicalclubrbu (https://www.instagram.com/technicalclubrbu/)
• Email: technicalclub@rknec.edu
• Website: rcoem-technical.club
• Location: Digital Tower, Ramdeobaba University, Nagpur

Feel free to connect for event inquiries, project collaborations, or general questions!`,
    actions: [
      { label: 'FOLLOW ON INSTAGRAM', url: 'https://www.instagram.com/technicalclubrbu/', isInternal: false },
      { label: 'EMAIL US', url: 'mailto:technicalclub@rknec.edu', isInternal: false }
    ],
    followUps: ['Who are we?', 'What is Robo Drive?', 'How can I join the club?']
  },

  greetings: {
    id: 'greeting',
    title: 'Hello!',
    summary: `Hello! 👾 I'm TC-BOT, ready to assist. You can ask me about our technical domains, events like Robo Drive, projects, how to join the club, our Instagram, or how to contact us!`,
    actions: [
      { label: 'EXPLORE EVENTS', path: '/events', isInternal: true },
      { label: 'VIEW DOMAINS', path: '/domains', isInternal: true }
    ],
    followUps: ['Who are we?', 'What are our technical domains?', 'What is Robo Drive?']
  },

  fallback: {
    id: 'unknown-query',
    title: 'Need More Information',
    summary: `I didn't quite catch that question! 🤖 As TC-BOT, I can help you with:

• Who we are and our club mission
• Our technical domains (Web Dev, Graphics, Electronics, Video, Publicity, 3D Modelling)
• Ongoing events like Robo Drive
• Upcoming hackathons and workshops
• How to join or register
• Contact and Instagram (@technicalclubrbu)

Feel free to pick one of the suggestions below or ask in different words!`,
    actions: [
      { label: 'EXPLORE EVENTS', path: '/events', isInternal: true },
      { label: 'CLUB DOMAINS', path: '/domains', isInternal: true }
    ],
    followUps: [
      'Who are we?',
      'What are our technical domains?',
      'What is Robo Drive?',
      'How can I join the club?'
    ]
  }
};
