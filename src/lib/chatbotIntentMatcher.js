import { KNOWLEDGE_BASE } from './chatbotKnowledgeBase';

/**
 * Text Normalization Helper:
 * Lowercases, strips punctuation, and collapses whitespace.
 */
export function normalizeQuery(query) {
  if (typeof query !== 'string') return '';
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Keyword rules with weights for intent classification.
 */
const INTENT_RULES = [
  // 1. Robo Drive (high-priority event query)
  {
    intent: 'roboDrive',
    patterns: [
      /\brobo\s*drive\b/i,
      /\brc\s*car\b/i,
      /\bcar\s*rac(e|ing)\b/i,
      /\bspiderman\b/i,
      /\b22\s*october\b/i,
      /\bobstacle\s*arena\b/i,
      /\bdrive\s*event\b/i
    ],
    keywords: ['robodrive', 'robo', 'drive', 'speed', 'precision', 'lift 4', 'digital tower']
  },

  // 2. Who Are We / About
  {
    intent: 'whoWeAre',
    patterns: [
      /\bwho\s*(are|r)\s*(we|you|u)\b/i,
      /\babout\s*(the\s*)?(club|technical\s*club|tc|rbu)\b/i,
      /\bwhat\s*is\s*(the\s*)?(technical\s*club|tc)\b/i,
      /\btell\s*me\s*about\b/i,
      /\bclub\s*mission\b/i
    ],
    keywords: ['about', 'mission', 'innovate', 'community', 'student']
  },

  // 3. Technical Domains
  {
    intent: 'domains',
    patterns: [
      /\b(what\s*are\s*our|what\s*are\s*the|list|all)\s*(technical\s*)?domains\b/i,
      /\btechnical\s*domains\b/i,
      /\bwhich\s*domains\b/i,
      /\bweb\s*dev(elopment)?\b/i,
      /\bgraphics\s*(\&|and)?\s*design\b/i,
      /\belectronics\s*(\&|and)?\s*robotics\b/i,
      /\bvideo\s*editing\b/i,
      /\btracks\b/i
    ],
    keywords: ['domain', 'domains', 'web', 'graphics', 'electronics', 'hardware', 'davinci', 'arduino']
  },

  // 4. Registrations
  {
    intent: 'registrations',
    patterns: [
      /\bwhere\s*(can|do)\s*i\s*(find\s*)?(event\s*)?regist(er|ration)s?\b/i,
      /\bhow\s*(to|can\s*i)\s*register\b/i,
      /\bgoogle\s*form\b/i,
      /\bregist(er|ration)\s*(link|form|url|open)\b/i,
      /\bsign\s*up\s*for\b/i
    ],
    keywords: ['register', 'registration', 'registrations', 'signup', 'form', 'entry', 'participate']
  },

  // 5. Events in general
  {
    intent: 'events',
    patterns: [
      /\bwhat\s*events\b/i,
      /\bevents\s*(do\s*we|we\s*organize|organized|coming\s*up)\b/i,
      /\bupcoming\s*events\b/i,
      /\bpast\s*events\b/i,
      /\bcompetitions\b/i,
      /\bhack\s*night\b/i,
      /\bjeopardy\b/i,
      /\bworkshops?\b/i
    ],
    keywords: ['event', 'events', 'hackathon', 'hack', 'contest', 'quiz', 'seminar', 'demo']
  },

  // 6. Projects & Build Nights
  {
    intent: 'projects',
    patterns: [
      /\bwhat\s*projects\b/i,
      /\bprojects\s*(do\s*we|we\s*work\s*on)\b/i,
      /\bwhat\s*do\s*you\s*(build|make|create)\b/i,
      /\bbuild\s*nights?\b/i
    ],
    keywords: ['project', 'projects', 'build', 'portfolio', 'prototype', 'showcase']
  },

  // 7. Joining / Recruitment
  {
    intent: 'joinClub',
    patterns: [
      /\bhow\s*(can|do)\s*i\s*join\b/i,
      /\bjoin\s*(the\s*)?(club|team|community)\b/i,
      /\brecruitment\b/i,
      /\bhow\s*to\s*become\s*(a\s*)?member\b/i,
      /\bmembership\b/i,
      /\bapply\b/i
    ],
    keywords: ['join', 'joining', 'member', 'members', 'recruitment', 'recruit', 'induction']
  },

  // 8. Instagram & Social Media
  {
    intent: 'instagram',
    patterns: [
      /\binstagram\b/i,
      /\binsta\b/i,
      /\big\b/i,
      /\b(social\s*media|social\s*handles?)\b/i
    ],
    keywords: ['instagram', 'insta', 'ig', 'handle', 'social']
  },

  // 9. Contact & Email
  {
    intent: 'contact',
    patterns: [
      /\bhow\s*(can|do)\s*i\s*contact\b/i,
      /\bcontact\s*(the\s*)?(club|us|team)\b/i,
      /\bemail\s*(address|id)?\b/i,
      /\bwhere\s*(are\s*you|is\s*the\s*club|located)\b/i
    ],
    keywords: ['contact', 'email', 'phone', 'location', 'reach', 'address']
  },

  // 9. Faculty Coordinators
  {
    intent: 'faculty',
    patterns: [
      /\bfaculty(\s*coordinators?|\s*advisors?|\s*mentors?)?\b/i,
      /\bprofessors?\b/i,
      /\bteachers?\b/i,
      /\bmentors?\b/i,
      /\bcoordinator(s)?\b/i
    ],
    keywords: ['faculty', 'professor', 'coordinator', 'coordinators', 'advisor', 'advisors', 'mentor', 'mentors']
  },

  // 9. Greetings
  {
    intent: 'greetings',
    patterns: [
      /^(hi|hello|hey|yo|hola|greetings|good\s*(morning|afternoon|evening))\b/i,
      /^tc\s*bot\b/i
    ],
    keywords: ['hi', 'hello', 'hey', 'greetings', 'yo']
  }
];

/**
 * Match user query against intent rules.
 * Returns the best-matching knowledge base node.
 */
export function matchUserIntent(rawQuery) {
  const query = normalizeQuery(rawQuery);
  if (!query) {
    return KNOWLEDGE_BASE.greetings;
  }

  let bestIntent = null;
  let highestScore = 0;

  for (const rule of INTENT_RULES) {
    let score = 0;

    // Check regex patterns (heavy weight: +10)
    for (const pattern of rule.patterns) {
      if (pattern.test(rawQuery) || pattern.test(query)) {
        score += 10;
        break; // Match once per pattern set
      }
    }

    // Check keyword tokens (weight: +2 per keyword match)
    for (const kw of rule.keywords) {
      const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
      if (kwRegex.test(query)) {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestIntent = rule.intent;
    }
  }

  // Threshold: if score >= 2, we found a confident match
  if (bestIntent && highestScore >= 2 && KNOWLEDGE_BASE[bestIntent]) {
    return KNOWLEDGE_BASE[bestIntent];
  }

  // Fallback if no intent matched
  return KNOWLEDGE_BASE.fallback;
}

/**
 * Generate bot response object ready for conversation list.
 */
export function generateBotResponse(userQuery) {
  const matchedNode = matchUserIntent(userQuery);

  return {
    id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sender: 'bot',
    title: matchedNode.title,
    text: matchedNode.summary,
    actions: matchedNode.actions || [],
    followUps: matchedNode.followUps || [],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
