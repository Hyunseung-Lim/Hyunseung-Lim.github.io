import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import {
  ProjectHeader,
  ProjectBanner,
  ProjectDivider,
  ProjectVideoFrame,
  collectProjectAssets
} from '../../../Components/ProjectPage';
import './AquaDesign.css';

const AQUA_DESIGN_ASSETS = collectProjectAssets(PROJECTS['aqua-design'], [
  '/projects/aqua-design/overview.png',
  '/projects/aqua-design/trigger_by_date.png',
  '/projects/aqua-design/trigger_by_category.png',
  '/projects/aqua-design/trigger_by_external_app.png',
  '/projects/aqua-design/trigger_by_flow.png',
  '/projects/aqua-design/trigger_by_transfer.png',
  ...Array.from({ length: 10 }, (_, index) => `/projects/aqua-design/screen/${index + 1}.png`)
]);

const FLOW_TRIGGERS = [
  { key: 'date', title: 'Trigger by Date', image: 'trigger_by_date.png' },
  { key: 'category', title: 'Trigger by Category', image: 'trigger_by_category.png' },
  { key: 'external-app', title: 'Trigger by External App', image: 'trigger_by_external_app.png' },
  { key: 'flow', title: 'Trigger by Flow', image: 'trigger_by_flow.png' },
  { key: 'transfer', title: 'Trigger by Transfer', image: 'trigger_by_transfer.png' }
];

export const AquaDesignProject = () => {
  const projectData = PROJECTS['aqua-design'];
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const overviewImage = `${process.env.PUBLIC_URL}/projects/aqua-design/overview.png`;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(projectData.banner, themeMode);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={AQUA_DESIGN_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--aqua-design`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />
        <ProjectBanner project={projectData} />

        <div className="project-container" ref={setScrollRoot}>
        <ProjectHeader project={projectData} fadeRef={fadeInRef} />

        <main className="project-content">
          <section className="project-section project-section--intro aqua-design-overview">
            <div className="aqua-design-overview__media project-fade-block" ref={fadeInRef}>
              <img
                src={overviewImage}
                alt="Concept art of AQUA"
                loading="lazy"
              />
            </div>
            <div className="aqua-design-overview__text project-fade-block" ref={fadeInRef}>
              <h3 className="section-subtitle section-subtitle--small aqua-design-overview__subtitle">People Tend to Associate Money with Purpose</h3>
              <p className="section-text aqua-design-overview__content">
                According to behavioral economics, people place different values on money based on subjective criteria. This is called <strong>Mental Accounting</strong>. However, this difference of values is not clearly expressed in traditional
                asset management systems. <strong>AQUA</strong> is an asset management system that expresses the different purposes money is associated with.
              </p>
            </div>
          </section>

          <section className="project-section aqua-design-video">
            <ProjectVideoFrame
              src="https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-"
              title="AQUA Design walkthrough"
              fadeRef={fadeInRef}
              className="aqua-design-video__frame"
            />
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <section className="project-section aqua-design-key-features">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Key Features
            </h2>
            <div className="aqua-design-key-features__items">
              <div className="aqua-design-key-feature">
                <h3 className="section-subtitle aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Bubble: A New Unit of Asset
                </h3>
                <p className="section-text project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  A bubble replaces a bank account. Multiple bubbles exist in a single account, but each bubble can act like one, able to send and receive money to other accounts.
                </p>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4 className="section-subtitle section-subtitle--small">Creating new Bubbles</h4>
                  <p className="section-text section-text--small">
                    Creating a new Bubble takes almost no steps, since it is not an actual bank account but something that acts like one.
                  </p>
                  <img
                    src={`${process.env.PUBLIC_URL}/projects/aqua-design/creating_bubble.png`}
                    alt="Creating bubble interface showing how new bubbles are set up"
                    className="aqua-design-key-feature__image"
                    loading="lazy"
                  />
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4 className="section-subtitle section-subtitle--small">Movement of money between Bubbles</h4>
                  <p className="section-text section-text--small">
                    Transferring to and from Bubbles is also easier than a traditional bank wire.
                  </p>
                  <img
                    src={`${process.env.PUBLIC_URL}/projects/aqua-design/movement_bubble.png`}
                    alt="Movement of money between bubbles interface"
                    className="aqua-design-key-feature__image"
                    loading="lazy"
                  />
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4 className="section-subtitle section-subtitle--small">Similarities with a Traditional Bank Account</h4>
                  <p className="section-text section-text--small">
                    A Bubble is clearly different from a traditional bank account. However, we assign a virtual account
                    number to a Bubble, so in interaction with traditional bank accounts, Bubbles can be treated as such,
                    maintaining backwards compatibility.
                  </p>
                  <img
                    src={`${process.env.PUBLIC_URL}/projects/aqua-design/similar_bubble.png`}
                    alt="Bubble feature illustrating similarities with traditional accounts"
                    className="aqua-design-key-feature__image aqua-design-key-feature__image--narrow"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="aqua-design-key-feature">
                <h3 className="section-subtitle aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Feed: Widgets That Reflect the User's Intent
                </h3>
                <p className="section-text project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  A single Bubble can be used in different ways, depending on how the user intends to use it.
                </p>
                <div className="aqua-design-key-feature__subsection">
                  <div className="project-fade-block" ref={fadeInRef}>
                    <h4 className="section-subtitle section-subtitle--small">Personalized Widget</h4>
                    <p className="section-text section-text--small">
                      A feed of personalized widgets provides useful information and suggestions to users based on the expenditure trend of the Bubble.
                    </p>
                  </div>
                  <div className="project-fade-block" ref={fadeInRef}>
                    <img
                      src={`${process.env.PUBLIC_URL}/projects/aqua-design/personal_feed.png`}
                      alt="Personalized feed widgets providing Bubble insights"
                      className="aqua-design-key-feature__image"
                      loading="lazy"
                    />
                  </div>
                  <p className="project-fade-block" ref={fadeInRef}>
                    Some users might be more interested in where they spent the most, and others in how much they spent in the last week in their Coffee &amp; Drinks Bubble.
                  </p>
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4 className="section-subtitle section-subtitle--small">Recommendations</h4>
                  <p className="section-text section-text--small">
                    Users can find and use appropriate widgets themselves, and AQUA can also recommend widgets by analyzing and learning user behavior.
                  </p>
                </div>
                <div className="aqua-design-key-feature__subsection aqua-design-key-feature__subsection--recommendation project-fade-block" ref={fadeInRef}>
                  <div className="aqua-design-key-feature__recommendation">
                    <div className="aqua-design-key-feature__recommendation-text">
                      <p className="section-text section-text--small">
                        AQUA analyzes and learns each Bubble's usage patterns. Using that information, it suggests widgets that better help the user's intentions.
                      </p>
                      <p className="section-text section-text--small">
                        For example, a Travel Widget that becomes a piggy bank bubble before a trip, and the main spending bubble during the trip.
                      </p>
                    </div>
                    <div className="aqua-design-key-feature__recommendation-media">
                      <img
                        src={`${process.env.PUBLIC_URL}/projects/aqua-design/recommendation.png`}
                        alt="Widget recommendation interface highlighting Bubble insights"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="aqua-design-key-feature__subsection aqua-design-key-feature__subsection--management project-fade-block" ref={fadeInRef}>
                  <div className="aqua-design-key-feature__management">
                    <div className="aqua-design-key-feature__management-media">
                      <img
                        src={`${process.env.PUBLIC_URL}/projects/aqua-design/management.png`}
                        alt="Proactive widget suggestions for asset management"
                        loading="lazy"
                      />
                    </div>
                    <div className="aqua-design-key-feature__management-text">
                      <p className="section-text section-text--small">
                        AQUA also suggests widgets that help with asset management.
                      </p>
                      <p className="section-text section-text--small">
                        For example, if AQUA notices a cash surplus, it recommends various savings or investment options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aqua-design-key-feature">
                <h3 className="section-subtitle aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Flow: Full Control Over How Your Money Moves
                </h3>
                <p className="section-text project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  AQUA lets users create Flows to and from Bubbles. Flow is a feature that controls the cash flow in the user's account.
                </p>
                <p className="section-text project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  Users can connect a Bubble to a certain kind of expenditure, controlling their income and extending automatic payments and direct debits. They create transfers through a variety of triggers.
                </p>
                <div className="project-fade-block" ref={fadeInRef}>
                  <img
                    src={`${process.env.PUBLIC_URL}/projects/aqua-design/flow_example.png`}
                    alt="Flow examples illustrating automated transfers"
                    className="aqua-design-key-feature__image"
                    loading="lazy"
                  />
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4 className="section-subtitle section-subtitle--small">Triggers</h4>
                  <p className="section-text section-text--small">
                    Flow consists of a trigger and its associated actions. In users' minds, money doesn't move only on certain dates. Flows let users control their money with various triggers.
                  </p>
                </div>
                <div className="aqua-design-flow-triggers">
                  {FLOW_TRIGGERS.map((trigger) => (
                    <div className="aqua-design-flow-trigger project-fade-block" ref={fadeInRef} key={trigger.key}>
                      <div className="aqua-design-flow-trigger__media">
                        <img
                          src={`${process.env.PUBLIC_URL}/projects/aqua-design/${trigger.image}`}
                          alt={trigger.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="aqua-design-flow-trigger__text">
                        <p>{trigger.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <MobileScreenRail
            className="project-fade-block aqua-design-mobile-rail"
            sectionRef={fadeInRef}
            heading="Mobile Screens"
            screens={Array.from({ length: 10 }).map((_, index) => ({
              image: `${process.env.PUBLIC_URL}/projects/aqua-design/screen/${index + 1}.png`,
              alt: `AQUA design mobile screen ${index + 1}`
            }))}
            cardWidth="clamp(260px, 24vw, 360px)"
            gap={32}
            showMetadata={false}
            clampToContainer
          />
        </main>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
