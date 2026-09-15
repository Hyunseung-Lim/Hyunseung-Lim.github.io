import { useTheme } from '../../contexts/ThemeContext';
import { assetUrl } from './assetUrl';

/**
 * Venue / award badge shown inside the project meta row.
 * badge: { src, srcDark?, alt, href?, linkLabel?, size?: 'default' | 'compact' }
 * Accepts a single badge object or an array of them.
 */
export const ProjectBadge = ({ badge, fadeRef = null }) => {
  const { isDark } = useTheme();
  const badges = (Array.isArray(badge) ? badge : [badge]).filter(Boolean);

  if (badges.length === 0) return null;

  return (
    <div
      className={['project-awards-section', fadeRef ? 'project-fade-block' : ''].filter(Boolean).join(' ')}
      aria-label="Project awards"
      ref={fadeRef}
    >
      {badges.map((item, index) => {
        const src = assetUrl(isDark && item.srcDark ? item.srcDark : item.src);
        const imageClass = ['project-award-badge', item.size === 'compact' ? 'project-award-badge--compact' : '']
          .filter(Boolean)
          .join(' ');
        const image = <img src={src} alt={item.alt ?? ''} className={imageClass} loading="lazy" />;

        if (item.href) {
          return (
            <a
              key={item.src ?? index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-award-link"
              aria-label={item.linkLabel ?? item.alt}
            >
              {image}
            </a>
          );
        }

        return (
          <span key={item.src ?? index} className="project-award-link">
            {image}
          </span>
        );
      })}
    </div>
  );
};
