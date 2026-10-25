// Members + rings. Edit people here. 30 members total across 3 rings.
// To use a real photo: put the image in /public/members/ and set  photo: 'members/name.jpg'
// Without a photo, a pixel avatar is generated from the name.

// dir: 'cw' = clockwise, 'ccw' = counter-clockwise. radius is a fraction of the stage size.
export const RINGS = [
  { label: 'RING 1', dir: 'cw', count: 12, radius: 0.46, seconds: 90 },
  { label: 'RING 2', dir: 'ccw', count: 10, radius: 0.38, seconds: 70 },
  { label: 'RING 3', dir: 'cw', count: 8, radius: 0.3, seconds: 55 }
];

const ROLES = ['Web Developer', 'AI Enthusiast', 'Robotics Builder', 'UI Designer', 'Video Editor', 'Embedded Dev', 'Content Creator', 'App Developer'];
// use this to add all the clubmember info 
//once done replace the below array.from with array.map and make all the related changes
export const MEMBERS = Array.from({ length: 30 }, (_, i) => {
  if (i === 0) {
    return {
      name: 'Siddhant Deshmukh',
      role: 'Technical Club Coordinator (TCC)',
      bio: 'Technical Club Coordinator leading technical initiatives, project collaborations, and student activities.',
      photo: '',
      links: { github: '', linkedin: '', email: '', site: '' }
    };
  }
  if (i === 1) {
    return {
      name: 'Devansh Tiwari',
      role: 'Web Developer | AI Enthusiast | Student',
      bio: 'Passionate about building clean and interactive web experiences.',
      photo: '',
      links: { github: '', linkedin: '', email: '', site: '' } // fill in: full URLs, email as plain address
    };
  }
  return {
    name: `Member ${String(i + 1).padStart(2, '0')}`,
    role: ROLES[(i - 1) % ROLES.length],
    bio: 'Add a short line about this member in src/data/members.js.',
    photo: '',
    links: { github: '', linkedin: '', email: '', site: '' }
  };
});

// Split members across the rings in order; id = position in MEMBERS
let n = 0;
export const ORBITS = RINGS.map((r) => {
  const start = n;
  n += r.count;
  return { ...r, members: MEMBERS.slice(start, n).map((m, j) => ({ ...m, id: start + j })) };
});
