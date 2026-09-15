import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { assetUrl } from '../ProjectPage/assetUrl';
import './ProjectLinks.css';

const DEFAULT_LINK_PRESETS = {
  paper: {
    label: 'Paper'
  },
  github: {
    label: 'Github',
    icon: '/icons/github.svg',
    iconDark: '/icons/github_dark.svg',
    iconAlt: 'GitHub'
  },
  dataset: {
    label: 'Dataset',
    icon: '/icons/huggingface-color.svg',
    iconDark: '/icons/huggingface-color.svg',
    iconAlt: 'Hugging Face'
  }
};

// Icons for `type: 'paper'` links, selected via `publisher`. Venues without a
// library icon (e.g. NeurIPS proceedings) simply omit `publisher` and render text only.
const PUBLISHER_ICONS = {
  acm: {
    icon: '/icons/dl.png',
    iconDark: '/icons/dl.png',
    iconAlt: 'ACM DL'
  },
  elsevier: {
    icon: '/icons/elsevier.png',
    iconDark: '/icons/elsevier_dark.png',
    iconAlt: 'Elsevier'
  }
};

const normalizeLabel = (type, explicitLabel) => {
  if (explicitLabel) return explicitLabel;
  if (!type) return 'Link';
  const preset = DEFAULT_LINK_PRESETS[type];
  return preset?.label ?? type;
};

const resolveIconConfig = ({ type, publisher, icon, iconDark, iconAlt }) => {
  const preset = type ? DEFAULT_LINK_PRESETS[type] : null;
  const publisherPreset = type === 'paper' && publisher ? PUBLISHER_ICONS[publisher] : null;
  return {
    icon: icon ?? publisherPreset?.icon ?? preset?.icon ?? null,
    iconDark: iconDark ?? publisherPreset?.iconDark ?? preset?.iconDark ?? null,
    iconAlt: iconAlt ?? publisherPreset?.iconAlt ?? preset?.iconAlt ?? ''
  };
};

/** Root-relative icon paths used by a link list (for asset preloading). */
export const resolveLinkIconPaths = (links = []) => {
  if (!Array.isArray(links)) return [];
  return links
    .filter((link) => link && !link.hidden && link.href)
    .flatMap((link) => {
      const { icon, iconDark } = resolveIconConfig(link);
      return [icon, iconDark];
    })
    .filter(Boolean);
};

export const ProjectLinks = ({
  links = [],
  className = '',
  fadeRef = null
}) => {
  const { isDark } = useTheme();

  const preparedLinks = useMemo(() => {
    if (!Array.isArray(links)) {
      return [];
    }
    return links
      .map(link => {
        if (!link || link.hidden) return null;
        const { type, href } = link;
        if (!href) return null;
        const label = normalizeLabel(type, link.label);
        const { icon, iconDark, iconAlt } = resolveIconConfig(link);
        return {
          key: link.key ?? `${label}-${href}`,
          label,
          href,
          icon: assetUrl(icon),
          iconDark: assetUrl(iconDark),
          iconAlt
        };
      })
      .filter(Boolean);
  }, [links]);

  if (preparedLinks.length === 0) {
    return null;
  }

  const wrapperClassName = ['project-links', className].filter(Boolean).join(' ');

  return (
    <div
      className={wrapperClassName}
      role="navigation"
      aria-label="Project resource links"
      ref={fadeRef}
    >
      {preparedLinks.map(({ key, label, href, icon, iconDark, iconAlt }) => {
        const iconSrc = isDark ? iconDark ?? icon : icon ?? iconDark;
        return (
          <a
            key={key}
            className="project-link-button"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {iconSrc && (
              <img
                src={iconSrc}
                alt={iconAlt}
                className="project-link-button__icon"
                loading="lazy"
                aria-hidden={iconAlt ? undefined : true}
              />
            )}
            {label}
          </a>
        );
      })}
    </div>
  );
};
