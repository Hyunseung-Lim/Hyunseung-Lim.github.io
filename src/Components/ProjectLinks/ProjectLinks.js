import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ProjectLinks.css';

const DEFAULT_LINK_PRESETS = {
  paper: {
    label: 'Paper'
  },
  github: {
    label: 'Github',
    icon: `${process.env.PUBLIC_URL}/icons/github.svg`,
    iconDark: `${process.env.PUBLIC_URL}/icons/github_dark.svg`,
    iconAlt: 'GitHub'
  },
  dataset: {
    label: 'Dataset',
    icon: `${process.env.PUBLIC_URL}/icons/huggingface-color.svg`,
    iconDark: `${process.env.PUBLIC_URL}/icons/huggingface-color.svg`,
    iconAlt: 'Hugging Face'
  }
};

const normalizeLabel = (type, explicitLabel) => {
  if (explicitLabel) return explicitLabel;
  if (!type) return 'Link';
  const preset = DEFAULT_LINK_PRESETS[type];
  return preset?.label ?? type;
};

const resolveIconConfig = ({ type, icon, iconDark, iconAlt }) => {
  const preset = type ? DEFAULT_LINK_PRESETS[type] : null;
  return {
    icon: icon ?? preset?.icon ?? null,
    iconDark: iconDark ?? preset?.iconDark ?? null,
    iconAlt: iconAlt ?? preset?.iconAlt ?? ''
  };
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
          icon,
          iconDark,
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
