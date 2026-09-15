import { resolveLinkIconPaths } from '../ProjectLinks/ProjectLinks';
import { assetUrl } from './assetUrl';
import { BANNER_MOBILE_BREAKPOINT } from './ProjectBanner';

/** The banner variant <ProjectBanner>'s <picture> will pick for the current viewport. */
const pickBanner = (project) => {
  if (!project?.banner) return null;
  const isMobileViewport =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(`(max-width: ${BANNER_MOBILE_BREAKPOINT}px)`).matches;
  return isMobileViewport && project.bannerMobile ? project.bannerMobile : project.banner;
};

/**
 * Collects every image the shared header/banner needs (the banner variant for this viewport, title logo, badges, link icons)
 * plus any page-specific extras, deduplicated and resolved against PUBLIC_URL.
 * Feed the result to <PageLoadGuard assets={...}>.
 */
export const collectProjectAssets = (project, extras = []) => {
  const badges = Array.isArray(project?.badge) ? project.badge : [project?.badge];
  const paths = [
    pickBanner(project),
    project?.titleLogo,
    ...badges.flatMap((item) => [item?.src, item?.srcDark]),
    ...resolveLinkIconPaths(project?.links),
    ...extras
  ];

  return Array.from(new Set(paths.filter(Boolean).map(assetUrl)));
};
