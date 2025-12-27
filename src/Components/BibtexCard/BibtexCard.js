import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './BibtexCard.css';

export const BibtexCard = forwardRef(({ text, className = '' }, ref) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const resetRef = useRef(null);

  useEffect(() => () => {
    if (resetRef.current) {
      clearTimeout(resetRef.current);
    }
  }, []);

  const resolveIconName = () => {
    if (copied) {
      return isDark ? 'copy_check_dark' : 'copy_check';
    }
    if (isDark) {
      return isHovered ? 'copy_dark_hover' : 'copy_dark';
    }
    return isHovered ? 'copy_hover' : 'copy';
  };

  const iconSrc = `${process.env.PUBLIC_URL}/icons/${resolveIconName()}.svg`;

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (resetRef.current) {
        clearTimeout(resetRef.current);
      }
      resetRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Best effort copy; ignore failures.
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyToClipboard();
    }
  };

  const combinedClassName = ['bibtex-card', className].filter(Boolean).join(' ');

  const lines = text.split('\n');

  return (
    <div
      className={combinedClassName}
      data-hovered={isHovered ? 'true' : undefined}
      data-copied={copied ? 'true' : undefined}
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={copyToClipboard}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Copy BibTeX entry"
    >
      <div className="bibtex-card__copy" aria-hidden="true">
        <img src={iconSrc} alt="" />
        <span className="bibtex-card__sr-only">Copy BibTeX entry</span>
      </div>
      <pre className="bibtex-card__block">
        {lines.map((line, index) => {
          const isAbstractLine = line.trimStart().toLowerCase().startsWith('abstract =');
          return (
            <span
              key={`bibtex-line-${index}`}
              className={`bibtex-card__line${isAbstractLine ? ' bibtex-card__line--abstract' : ''}`}
            >
              {line}
            </span>
          );
        })}
      </pre>
    </div>
  );
});

BibtexCard.displayName = 'BibtexCard';
