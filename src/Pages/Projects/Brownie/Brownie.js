import { useEffect, useRef, useState } from 'react';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Brownie.css';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';

export const BrownieProject = () => {
  const projectData = PROJECTS.brownie;
  const [scrollRoot, setScrollRoot] = useState(null);
  const [volume, setVolume] = useState(80);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const heroVideoBase = 'https://www.youtube.com/embed/3SPt_vbqIFs';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(heroVideoBase, themeMode);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player || !playerContainerRef.current || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: '3SPt_vbqIFs',
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          autohide: 1
        },
        events: {
          onReady: event => {
            setIsPlayerReady(true);
            event.target.unMute();
            event.target.setVolume(volume);
            event.target.playVideo();
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) {
      return;
    }
    playerRef.current.setVolume(volume);
    if (volume === 0) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [volume, isPlayerReady]);

  const handleVolumeChange = event => {
    setVolume(Number(event.target.value));
  };

  return (
    <div className={pageClassName}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      <section className="banner-section brownie-hero" aria-label="Brownie concept walkthrough video">
        <div className="brownie-hero__video" ref={playerContainerRef} />
        {isPlayerReady && (
          <div className="brownie-hero__controls" aria-label="Video volume control">
            <label htmlFor="brownie-volume-slider">Volume</label>
            <input
              id="brownie-volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        )}
      </section>
      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{projectData.title}</h1>
            {projectData.subtitle && <p className="project-subtitle">{projectData.subtitle}</p>}
          </div>
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section project-header__fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section project-header__fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
          </div>
        </header>

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Overview</h2>
            <p className="section-text">
              Brownie explores how AI can help small bakery teams co-design inclusive dessert offerings by blending customer flavor preferences with nutrition constraints and playfulness.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Role</h2>
            <p className="section-text">
              Leading interaction design and prototyping of the AI assistant, as well as co-creation workshops with local bakers.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list">
              <li>Developing a conversational recipe ideation workflow that balances creativity with dietary needs.</li>
              <li>Running pilot tasting sessions to iterate on sensory feedback loops.</li>
              <li>Preparing user study protocols for a late-2024 evaluation.</li>
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};
