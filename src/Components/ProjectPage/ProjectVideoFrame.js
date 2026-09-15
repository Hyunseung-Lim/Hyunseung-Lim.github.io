const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

/**
 * 16:9 embedded video (YouTube etc.) with the shared rounded frame.
 */
export const ProjectVideoFrame = ({ src, title, fadeRef = null, className = '' }) => (
  <div
    className={['project-video-frame', fadeRef ? 'project-fade-block' : '', className].filter(Boolean).join(' ')}
    ref={fadeRef}
  >
    <iframe src={src} title={title} allow={IFRAME_ALLOW} allowFullScreen />
  </div>
);
