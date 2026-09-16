/**
 * Single source of truth for every project page and the Projects grid.
 *
 * Fields consumed by the shared <ProjectHeader> / <ProjectBanner> components
 * (src/Components/ProjectPage):
 *   title, subtitle | subtitleLines, titleLogo, period, projectType
 *   summary  (optional) one-line overview for the Projects list view; falls back to subtitle
 *   venue    (optional) publication venue shown after the type label in the list view, e.g. 'CHI 2026'
 *   badge:  { src, srcDark?, alt, href?, linkLabel?, size?: 'compact' }   (or an array)
 *   links:  [{ type: 'paper', publisher?: 'acm' | 'elsevier', href }, { type: 'github' | 'dataset', href }]
 *   banner, bannerMobile?, bannerPosition?   (root-relative paths under public/)
 *   thumbnail, thumbnailDark?  800×480 list-view image (public/projects/<slug>/thumbnail.webp)
 *   themeMode: 'auto' | 'light' | 'dark'
 *
 * Fields consumed by the Projects grid (src/Pages/projects.js):
 *   icon, hoverIcon, iconDark, hoverIconDark, href, external
 *
 * Asset naming (public/projects/<slug>/) — one file name per role, shared by every project:
 *   icon.png / icon_dark.png / icon_hover.gif / icon_hover_dark.gif   grid tile
 *   thumbnail.webp / thumbnail_dark.webp                               list view (800×480, 5:3)
 *   banner.webp / banner_mobile.webp                                   page header banner (≤2560 / ≤1440 px wide)
 *   badge.png|svg / badge_dark.png                                     venue or award badge
 *   logo.png / logo_dark.png                                           project logo (title row, in-page UI)
 *   ui.png                                                             interface screenshot
 *   overview.png / overview_dark.png                                   overview figure
 *   Style: snake_case, no slug prefix, suffix order <name>[_hover][_mobile][_dark];
 *   numbered sequences live in a folder with bare numbers (screen/1.png, students/11.png).
 */
export const PROJECTS = {
  datopia: {
    id: 'datopia',
    venue: 'DDP Exhibition',
    thumbnail: '/projects/datopia/thumbnail.webp',
    title: 'Datopia',
    summary: 'A speculative design exhibition imagining a data-driven dating service',
    period: '2022.09-2022.12',
    projectType: 'Exhibition',
    icon: '/projects/datopia/icon.png',
    hoverIcon: '/projects/datopia/icon_hover.gif',
    iconDark: null,
    hoverIconDark: null,
    href: '/projects/datopia',
    external: false,
    themeMode: 'dark',
    banner: '/projects/datopia/banner.webp',
    badge: {
      src: '/projects/datopia/badge.png',
      alt: 'Datopia featured at DDP',
      href: 'https://www.youtube.com/watch?v=Fe4sXzLPVj0',
      linkLabel: 'Watch DDP exhibition highlight'
    }
  },
  'feed-o-meter': {
    id: 'feed-o-meter',
    venue: 'IJHCS',
    thumbnail: '/projects/feed-o-meter/thumbnail.webp',
    title: 'Feed-O-Meter',
    subtitle: 'Investigating AI-generated mentee personas as interactive agents for scaffolding design feedback practice',
    period: '2023.09-2026.01',
    projectType: 'Research',
    icon: '/projects/feed-o-meter/icon.png',
    hoverIcon: '/projects/feed-o-meter/icon_hover.gif',
    iconDark: '/projects/feed-o-meter/icon_dark.png',
    hoverIconDark: '/projects/feed-o-meter/icon_hover_dark.gif',
    href: '/projects/feed-o-meter',
    external: false,
    links: [
      { type: 'paper', label: 'Paper (Full)', publisher: 'elsevier', href: 'https://doi.org/10.1016/j.ijhcs.2025.103687' },
      // CSCW 2024 poster: "Identify Design Problems Through Questioning: Exploring Role-playing Interactions with LLMs to Foster Design Questioning Skills"
      { type: 'paper', label: 'Paper (Poster)', publisher: 'acm', href: 'https://doi.org/10.1145/3678884.3681912' },
      { type: 'github', href: 'https://github.com/Hyunseung-Lim/Feed-O-Meter' }
    ]
  },
  elevate: {
    id: 'elevate',
    venue: 'CHI 2021',
    thumbnail: '/projects/elevate/thumbnail.webp',
    title: 'Elevate',
    subtitle: 'A large-scale walkable pin-array display',
    period: '2019.12-2021.05',
    projectType: 'Research',
    icon: '/projects/elevate/icon.png',
    hoverIcon: '/projects/elevate/icon_hover.gif',
    iconDark: '/projects/elevate/icon_dark.png',
    hoverIconDark: '/projects/elevate/icon_hover_dark.gif',
    href: '/projects/elevate',
    external: false,
    banner: '/projects/elevate/banner.webp',
    bannerMobile: '/projects/elevate/banner_mobile.webp',
    bannerPosition: 'center 95%',
    badge: {
      src: '/projects/elevate/badge.png',
      srcDark: '/projects/elevate/badge_dark.png',
      alt: 'CHI 2021',
      size: 'compact'
    },
    links: [{ type: 'paper', publisher: 'acm', href: 'https://doi.org/10.1145/3411764.3445454' }]
  },
  stereohunter: {
    id: 'stereohunter',
    venue: 'FAccT 2025',
    thumbnail: '/projects/stereohunter/thumbnail.webp',
    title: 'StereoHunter',
    subtitle: 'Understanding user perspectives on stereotypical biases in large language models',
    period: '2022.10-2025.06',
    projectType: 'Research',
    icon: '/projects/stereohunter/icon.png',
    hoverIcon: '/projects/stereohunter/icon_hover.gif',
    iconDark: '/projects/stereohunter/icon_dark.png',
    hoverIconDark: '/projects/stereohunter/icon_hover_dark.gif',
    href: '/projects/stereohunter',
    external: false,
    badge: {
      src: '/projects/stereohunter/badge.png',
      srcDark: '/projects/stereohunter/badge_dark.png',
      alt: 'ACM FAccT 2025',
      size: 'compact'
    },
    links: [
      { type: 'paper', publisher: 'acm', href: 'https://doi.org/10.1145/3715275.3732207' },
      { type: 'github', href: 'https://github.com/Hyunseung-Lim/stereoHunter' }
    ]
  },
  crafteam: {
    id: 'crafteam',
    venue: 'CHI 2026',
    thumbnail: '/projects/crafteam/thumbnail.webp',
    title: 'CrafTeam',
    subtitle: 'Understanding human–multi-agent team formation for creative work',
    period: '2025.01-2026.04',
    projectType: 'Research',
    icon: '/projects/crafteam/icon.png',
    hoverIcon: '/projects/crafteam/icon_hover.gif',
    iconDark: '/projects/crafteam/icon_dark.png',
    hoverIconDark: '/projects/crafteam/icon_hover_dark.gif',
    href: '/projects/crafteam',
    external: false,
    badge: {
      src: '/projects/crafteam/badge.png',
      alt: 'CHI 2026'
    },
    links: [{ type: 'paper', publisher: 'acm', href: 'https://dl.acm.org/doi/full/10.1145/3772318.3791166' }]
  },
  aqua: {
    id: 'aqua',
    venue: 'DIS 2024',
    thumbnail: '/projects/aqua/thumbnail.webp',
    title: 'AQUA',
    subtitle: 'Co-creating question-and-answer style articles with large language models for research promotion',
    subtitleLines: [
      'Co-creating question-and-answer style articles with large language models',
      'for research promotion'
    ],
    period: '2023.03-2024.07',
    projectType: 'Research',
    icon: '/projects/aqua/icon.png',
    hoverIcon: '/projects/aqua/icon_hover.gif',
    iconDark: '/projects/aqua/icon_dark.png',
    hoverIconDark: '/projects/aqua/icon_hover_dark.gif',
    href: '/projects/aqua',
    external: false,
    badge: {
      src: '/projects/aqua/badge.png',
      srcDark: '/projects/aqua/badge_dark.png',
      alt: 'DIS 2024'
    },
    links: [{ type: 'paper', publisher: 'acm', href: 'https://doi.org/10.1145/3643834.3660705' }]
  },
  'aqua-design': {
    id: 'aqua-design',
    venue: 'iF Design Award 2021',
    thumbnail: '/projects/aqua-design/thumbnail.webp',
    title: 'aqua',
    subtitle: 'A new paradigm of personal asset management',
    titleLogo: '/projects/aqua-design/logo.png',
    period: '2020.04-2020.06',
    projectType: 'Design Project',
    icon: '/projects/aqua-design/icon.png',
    hoverIcon: '/projects/aqua-design/icon_hover.gif',
    iconDark: null,
    hoverIconDark: null,
    href: '/projects/aqua-design',
    external: false,
    themeMode: 'light',
    banner: '/projects/aqua-design/banner.webp',
    badge: {
      src: '/projects/aqua-design/badge.svg',
      alt: 'iF Design Award 2021',
      href: 'https://ifdesign.com/en/winner-ranking/project/aqua/312577'
    }
  },
  brownie: {
    id: 'brownie',
    venue: 'Seoul Design Festival 2021',
    thumbnail: '/projects/brownie/thumbnail.webp',
    title: 'Brownie',
    subtitle: 'A social community for sharing cooking fails',
    period: '2021.03-2021.12',
    projectType: 'Graduation Exhibition',
    icon: '/projects/brownie/icon.png',
    hoverIcon: '/projects/brownie/icon_hover.gif',
    iconDark: '/projects/brownie/icon_dark.png',
    hoverIconDark: '/projects/brownie/icon_hover_dark.gif',
    href: '/projects/brownie',
    external: false,
    banner: '/projects/brownie/banner.webp',
    bannerMobile: '/projects/brownie/banner_mobile.webp',
    bannerPosition: 'center 96%'
  },
  panorama: {
    id: 'panorama',
    venue: 'NeurIPS 2025',
    thumbnail: '/projects/panorama/thumbnail.webp',
    title: 'PANORAMA',
    subtitle: 'A dataset and benchmarks capturing decision trails and rationales in patent examination',
    period: '2024.06-2025.12',
    projectType: 'Research',
    icon: '/projects/panorama/icon.png',
    hoverIcon: '/projects/panorama/icon_hover.gif',
    iconDark: '/projects/panorama/icon_dark.png',
    hoverIconDark: '/projects/panorama/icon_hover_dark.gif',
    href: '/projects/panorama',
    external: false,
    badge: {
      src: '/projects/panorama/badge.png',
      srcDark: '/projects/panorama/badge_dark.png',
      alt: 'NeurIPS 2025'
    },
    links: [
      {
        type: 'paper',
        href: 'https://proceedings.neurips.cc/paper_files/paper/2025/hash/4aab82c8d6b77c0b6b010145c1bfcdd3-Abstract-Datasets_and_Benchmarks_Track.html'
      },
      { type: 'github', href: 'https://github.com/LGAI-Research/PANORAMA' },
      { type: 'dataset', href: 'https://huggingface.co/datasets/LG-AI-Research/PANORAMA' }
    ]
  }
};

// Grid / List order: newest start date first (parsed from `period`, "YYYY.MM-YYYY.MM"), regardless of project type.
const periodStart = (project) => {
  const match = /^(\d{4})\.(\d{2})/.exec(project.period ?? '');
  return match ? Number(match[1]) * 100 + Number(match[2]) : 0;
};

export const PROJECT_ORDER = Object.keys(PROJECTS).sort(
  (a, b) => periodStart(PROJECTS[b]) - periodStart(PROJECTS[a])
);
