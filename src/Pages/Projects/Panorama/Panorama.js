import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { useTheme } from '../../../contexts/ThemeContext';
import { PanoramaDiagram } from './diagram';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import './Panorama.css';

export const PanoramaProject = () => {
  const projectData = PROJECTS.panorama;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const resourceLinks = [
    { type: 'paper', href: 'https://arxiv.org/abs/2510.24774' },
    { type: 'github', href: 'https://github.com/LGAI-Research/PANORAMA' },
    { type: 'dataset', href: 'https://huggingface.co/datasets/LG-AI-Research/PANORAMA' }
  ];

  return (
    <div className={`${pageClassName} project-page--panorama`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      {bannerImage && (
        <div className="banner-section">
          <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
        </div>
      )}

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
            <div
              className="project-awards-section project-header__fade-block project-fade-block"
              aria-label="Conference badge"
              ref={fadeInRef}
            >
              <img
                src={
                  isDark
                    ? `${process.env.PUBLIC_URL}/projects/panorama/neurips_dark.png`
                    : `${process.env.PUBLIC_URL}/projects/panorama/neurips.png`
                }
                alt="NeurIPS 2025"
                className="project-award-badge"
                loading="lazy"
              />
            </div>
          </div>
          <ProjectLinks links={resourceLinks} className="project-fade-block" fadeRef={fadeInRef} />
        </header>

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <p className="section-text panorama-body project-fade-block" ref={fadeInRef}>
              We construct{' '}
              <strong>PANORAMA</strong>, a dataset of 8,143 U.S. patent examination records that preserves the full decision trails,
              including original applications, all cited references, Non-Final Rejections, and Notices of Allowance. Also,{' '}
              <strong>PANORAMA</strong> decomposes the trails into sequential benchmarks that emulate patent professionals' patent review
              processes and allow researchers to examine large language models' capabilities at each step of them.
            </p>
          </section>

          <section className="project-section project-section__fade panorama-diagram-section" ref={fadeInRef}>
            <PanoramaDiagram fadeRef={fadeInRef} isDark={isDark} />
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
            <BibtexCard
              ref={fadeInRef}
              className="project-fade-block"
              text={`@misc{lim2025panoramadatasetbenchmarkscapturing,
title={PANORAMA: A Dataset and Benchmarks Capturing Decision Trails and Rationales in Patent Examination},
author={Hyunseung Lim and Sooyohn Nam and Sungmin Na and Ji Yong Cho and June Yong Yang and Hyungyu Shin and Yoonjoo Lee and Juho Kim and Moontae Lee and Hwajung Hong},
year={2025},
eprint={2510.24774},
archivePrefix={arXiv},
primaryClass={cs.CY},
url={https://arxiv.org/abs/2510.24774},
}`}
            />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
