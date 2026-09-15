import { assetUrl } from './assetUrl';

/** Viewports at or below this width get `bannerMobile`; collectProjectAssets preloads the same choice. */
export const BANNER_MOBILE_BREAKPOINT = 640;
const DEFAULT_MOBILE_BREAKPOINT = BANNER_MOBILE_BREAKPOINT;

/**
 * Full-width hero banner rendered above the project container.
 * Reads `banner`, `bannerMobile`, `bannerPosition` from the project meta by default;
 * explicit props override the meta values.
 */
export const ProjectBanner = ({
  project,
  src = project?.banner,
  mobileSrc = project?.bannerMobile,
  imagePosition = project?.bannerPosition,
  alt = project?.title ? `${project.title} banner` : 'Project banner',
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  className = ''
}) => {
  if (!src) return null;

  const image = (
    <img
      src={assetUrl(src)}
      alt={alt}
      className="banner-image"
      style={imagePosition ? { objectPosition: imagePosition } : undefined}
    />
  );

  return (
    <div className={['banner-section', className].filter(Boolean).join(' ')}>
      {mobileSrc ? (
        <picture>
          <source media={`(max-width: ${mobileBreakpoint}px)`} srcSet={assetUrl(mobileSrc)} />
          {image}
        </picture>
      ) : (
        image
      )}
    </div>
  );
};
