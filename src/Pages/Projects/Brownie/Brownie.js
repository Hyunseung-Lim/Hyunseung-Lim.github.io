import { useState } from 'react';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Brownie.css';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';
import {
  ProjectHeader,
  ProjectBanner,
  ProjectDivider,
  ProjectVideoFrame,
  collectProjectAssets
} from '../../../Components/ProjectPage';

const BROWNIE_SCREEN_IMAGES = Array.from(
  { length: 7 },
  (_, index) => `${process.env.PUBLIC_URL}/projects/brownie/screen/${index + 1}.png`
);
const BROWNIE_ASSETS = collectProjectAssets(PROJECTS.brownie, BROWNIE_SCREEN_IMAGES);
const BROWNIE_CONCEPT_VIDEO_URL = 'https://www.youtube.com/embed/3SPt_vbqIFs?rel=0';

export const BrownieProject = () => {
  const projectData = PROJECTS.brownie;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(projectData.banner, themeMode);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={BROWNIE_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--brownie`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />
        <ProjectBanner project={projectData} />

        <div className="project-container" ref={setScrollRoot}>
        <ProjectHeader project={projectData} fadeRef={fadeInRef} />

        <main className="project-content">
          <section className="project-section project-section--intro brownie-intro">
            <p className="section-text project-fade-block" ref={fadeInRef}>
                Most cooking recipes we encounter are polished, completed versions. Although they
                are shaped by many trials and errors, it&apos;s hard to know what those errors were
                or how they were overcome. As a result, when you follow a finished recipe from the
                start, you may not know how to handle an unintended outcome. One answer lies in
                learning from failed cooking, but it&apos;s difficult to keep failing alone until you
                succeed.
            </p>
            <p className="section-text project-fade-block" ref={fadeInRef}>
                Brownie, a community for sharing failed dishes, helps users share their failures,
                identify the causes, and overcome them together. By seeing others&apos; failed
                recipes, users can have fun, feel a sense of kinship, reduce their fear of failure, and
                become more willing to try new dishes.
            </p>
          </section>

          <section className="project-section">
            <ProjectVideoFrame
              src={BROWNIE_CONCEPT_VIDEO_URL}
              title="Brownie concept walkthrough"
              fadeRef={fadeInRef}
            />
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <section className="project-section brownie-design-overview">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>Why Brownie?</h2>
            <p className="section-text project-fade-block" ref={fadeInRef}>
              Brownies are said to have been created by accident. In the United States, a woman reportedly forgot to add
              baking powder while trying to make a chocolate cake. As a result, the cake didn’t rise. Thinking it would be
              wasteful to throw it away, she shared it with her neighbors, and many people enjoyed its chewy texture. This
              shows how a &quot;failed&quot; attempt can sometimes lead to a new recipe. Brownie, a community for sharing cooking
              failures, enables people to share unsuccessful dishes with others and overcome them together.
            </p>
          </section>

          <section className="project-section brownie-design-overview">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>Design of Brownie</h2>
            <p className="section-text project-fade-block" ref={fadeInRef}>
              Brownie is designed to feel like social media. You browse other people’s recipes in a feed, and multiple attempts at the same dish are linked so you can see how each person has progressed. It also helps users archive and manage their own recipes: by recording each cooking session, they can improve their skills and track their growth through the app’s graphs.
            </p>
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <MobileScreenRail
            className="project-fade-block brownie-mobile-rail"
            sectionRef={fadeInRef}
            heading="Mobile Screens"
            screens={BROWNIE_SCREEN_IMAGES.map((image, index) => ({
              image,
              alt: `Brownie mobile screen ${index + 1}`
            }))}
            cardWidth="clamp(240px, 28vw, 340px)"
            gap={28}
            showMetadata={false}
            clampToContainer
          />

          <ProjectDivider fadeRef={fadeInRef} />

          <section className="project-section brownie-user-study">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>User Study</h2>
            <p className="section-text project-fade-block" ref={fadeInRef}>
              A user test was conducted to evaluate usability and to verify whether Brownie helps improve users&apos;
              cooking skills. Six participants took part (mean age: 23), and they reported cooking an average of twice per
              week. Each participant completed 2–3 sessions in total. During the test, participants made Spanish omelets
              and posted their recipes in the app. They also spent time reviewing other users' recipes and communicating via
              the feed before and after cooking.
            </p>
            <ProjectVideoFrame
              src="https://www.youtube.com/embed/VTdQv7znX3w?si=cWltKdm89KN8mvDN"
              title="Brownie user study highlights"
              fadeRef={fadeInRef}
            />
          </section>
        </main>
        </div>
        <Footer />
      </div>
    </PageLoadGuard>
  );
};
