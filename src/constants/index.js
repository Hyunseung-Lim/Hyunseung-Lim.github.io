export const CAROUSEL_CONFIG = {
  AUTO_SLIDE_INTERVAL: 5000,
  TRANSITION_DURATION: 1000
};

export const BANNER_EVENTS = [
  {
    id: 'dis2024',
    title: 'DIS 2024',
    location: 'Denmark, Copenhagen',
    slides: Array.from({ length: 7 }, (_, index) => `${process.env.PUBLIC_URL}/images/banner/dis2024/img${index + 1}.jpg`)
  },
  {
    id: 'facct2025',
    title: 'FAccT 2025',
    location: 'Greece, Athens',
    slides: Array.from({ length: 6 }, (_, index) => `${process.env.PUBLIC_URL}/images/banner/facct2025/img${index + 1}.png`)
  }
];

export const BANNER_IMAGES = BANNER_EVENTS.flatMap(event => event.slides);

export const NAVIGATION_LINKS = [
  { href: '#about', text: 'About Me' },
  { href: '#projects', text: 'Projects' },
  { href: '#publications', text: 'Publications' }
];
