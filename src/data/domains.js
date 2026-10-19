// The club's domains. Used by the nav dropdown and the Domains section.
// slug = route: /domains/<slug>. icon = a name from components/graphics/Px.jsx.
export const DOMAINS = [
  { slug: 'web-dev', name: 'Web Dev', icon: 'ui', text: 'Build websites and apps with HTML, CSS, JavaScript and React.' },
  { slug: 'graphics', name: 'Graphics', icon: 'image', text: 'Posters, UI design, illustrations and motion graphics.' },
  { slug: 'electronics', name: 'Electronics', icon: 'chip', text: 'Arduino, sensors, IoT and robotics.' },
  { slug: 'video-editing', name: 'Video Editing', icon: 'play', text: 'Cut, color grade and add motion titles to tell stories in video.' },
  { slug: 'publicity', name: 'Publicity', icon: 'megaphone', text: 'Social media, event promotion, outreach, branding and spreading awareness about club activities.' }
];
export const domainPath = (d) => `/domains/${d.slug}`;
