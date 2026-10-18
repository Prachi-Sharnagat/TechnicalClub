/**
 * Faculty Coordinators Data — Technical Club RBU
 *
 * MAINTENANCE GUIDE FOR SENIOR MEMBERS / CLUB LEADS:
 * To populate with official faculty details:
 * 1. Place authentic portrait photographs in `public/faculty/` (e.g. `public/faculty/coordinator-1.jpg`)
 *    or provide an external HTTPS image URL.
 * 2. Update the coordinator entries below:
 *    - name: Faculty member's verified real name
 *    - designation: Official academic title / role (e.g., "Faculty Coordinator", "Faculty Advisor")
 *    - department: Verified department (e.g., "Department of Computer Science & Engineering")
 *    - photo: Path to image relative to public root (e.g., 'faculty/coordinator-1.jpg') or HTTPS URL
 *    - profileUrl: Optional verified institutional profile or LinkedIn URL (set to '' if none)
 *    - bio: Short line on mentorship domains or research interests
 *    - isVerified: Set to true once real details have been confirmed
 *
 * Note: Do NOT invent fictional profiles as real people.
 */

export const FACULTY_COORDINATORS = [
  {
    id: 'faculty-coord-1',
    slot: '01',
    name: 'Faculty Coordinator 1',
    designation: 'Faculty Coordinator',
    department: 'Department details pending',
    bio: 'Guiding student technology initiatives, institutional mentorship, and club governance.',
    photo: '',
    profileUrl: '',
    isVerified: false
  },
  {
    id: 'faculty-coord-2',
    slot: '02',
    name: 'Faculty Coordinator 2',
    designation: 'Faculty Coordinator',
    department: 'Department details pending',
    bio: 'Overseeing technical workshops, hackathon strategy, and cross-domain project execution.',
    photo: '',
    profileUrl: '',
    isVerified: false
  },
  {
    id: 'faculty-coord-3',
    slot: '03',
    name: 'Faculty Coordinator 3',
    designation: 'Faculty Coordinator',
    department: 'Department details pending',
    bio: 'Mentoring inter-disciplinary research, industry connections, and student innovations.',
    photo: '',
    profileUrl: '',
    isVerified: false
  }
];
