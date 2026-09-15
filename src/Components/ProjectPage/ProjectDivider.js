/**
 * Horizontal rule used between project sections.
 * variant: undefined (between sections) | 'header' (directly under the project header)
 */
export const ProjectDivider = ({ variant, fadeRef = null, className = '' }) => {
  const classes = [
    'project-divider',
    variant ? `project-divider--${variant}` : '',
    fadeRef ? 'project-fade-block' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} role="presentation" aria-hidden="true" ref={fadeRef} />;
};
