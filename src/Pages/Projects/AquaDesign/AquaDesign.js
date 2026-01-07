import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import './AquaDesign.css';

const AQUA_DESIGN_ASSETS = Array.from(
  new Set([
    `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/img1.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/design_award.svg`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/trigger_by_date.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/trigger_by_category.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/trigger_by_external_app.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/trigger_by_flow.png`,
    `${process.env.PUBLIC_URL}/projects/aqua-design/trigger_by_transfer.png`,
    ...Array.from({ length: 10 }, (_, index) => `${process.env.PUBLIC_URL}/projects/aqua-design/screen/${index + 1}.png`)
  ])
);

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
  const themeMode = 'light';
  const bannerImage = `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail.png`;
  const overviewImage = `${process.env.PUBLIC_URL}/projects/aqua-design/img1.png`;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={AQUA_DESIGN_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--aqua-design`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />

        {bannerImage && (
          <div className="banner-section">
            <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
          </div>
        )}

        <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-title-row aqua-design-fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title project-title--sr-only">{projectData.title}</h1>
            <img
              src={`${process.env.PUBLIC_URL}/projects/aqua-design/logo.png`}
              alt={`${projectData.title} logo`}
              className="project-title-logo"
              loading="lazy"
            />
          </div>
          {projectData.subtitle && (
            <p className="project-subtitle aqua-design-fade-block project-fade-block" ref={fadeInRef}>
              {projectData.subtitle}
            </p>
          )}
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section aqua-design-fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section aqua-design-fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
            <div className="project-awards-section aqua-design-fade-block project-fade-block" aria-label="Project awards" ref={fadeInRef}>
              <a
                href="https://ifdesign.com/en/winner-ranking/project/aqua/312577"
                target="_blank"
                rel="noopener noreferrer"
                className="project-award-link"
                aria-label="iF Design Award 2021"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/projects/aqua-design/design_award.svg`}
                  alt="iF Design Award 2021"
                  className="project-award-badge"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <div
          className="project-divider project-divider--header project-fade-block"
          role="presentation"
          aria-hidden="true"
          ref={fadeInRef}
        />

        <main className="project-content">
          <section className="project-section aqua-design-overview">
            <div className="aqua-design-overview__media aqua-design-fade-block" ref={fadeInRef}>
              <img
                src={overviewImage}
                alt="Concept art of AQUA"
                loading="lazy"
              />
            </div>
            <div className="aqua-design-overview__text aqua-design-fade-block" ref={fadeInRef}>
              <p className="aqua-design-overview__subtitle">People Tend to Associate Money with Purpose</p>
              <p className="aqua-design-overview__content">
                According to behavioural economics, people place different values on money on subjective criteria.
                This called <strong>Mental Accounting</strong>. However, this difference of values is not clearly expressed in traditional
                asset management systems. <strong>AQUA</strong> is asset management system that expresses the different purposes money is associated with.
              </p>
            </div>
          </section>

          <section className="project-section aqua-design-video aqua-design-fade-block" ref={fadeInRef}>
            <div className="aqua-design-video__frame">
              <iframe
                src="https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-"
                title="AQUA Design walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div
              className="project-divider project-fade-block"
              role="presentation"
              aria-hidden="true"
              ref={fadeInRef}
            />
          </section>

          <section className="project-section aqua-design-key-features">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Key Features
            </h2>
            <div className="aqua-design-key-features__items">
              <div className="aqua-design-key-feature">
                <h3 className="aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Bubble: A New Unit of Asset
                </h3>
                <p className="project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  A bubble replaces a bank account. Multiple bubbles exist in a single account, but each bubble can act like one, able to send and receive money to other accounts.
                </p>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4>Creating new Bubbles</h4>
                  <p>
                    Creating new bubbles requires little to no process at all, since it is not creating an actual bank
                    account, but one that acts like one.
                  </p>
                  <img
                    src={`${process.env.PUBLIC_URL}/projects/aqua-design/creating_bubble.png`}
                    alt="Creating bubble interface showing how new bubbles are set up"
                    className="aqua-design-key-feature__image"
                    loading="lazy"
                  />
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4>Movement of money between Bubbles</h4>
                  <p>
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
                  <h4>Similarities with a Traditional Bank Account</h4>
                  <p>
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
                <h3 className="aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Feed: Widgets That Reflect the User's Intent
                </h3>
                <p className="project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  A single Bubble can be used in different ways, depending on what intent the user has on how they plan to utilize them.
                </p>
                <div className="aqua-design-key-feature__subsection">
                  <div className="project-fade-block" ref={fadeInRef}>
                    <h4>Personalized Widget</h4>
                    <p>
                      A feed of personalized widgets provide insightful information and suggestions to the users based on the expenditure trend of the Bubble.
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
                    Some users might be more interested in at what places they spent the most, and others in how much they spent in the last week in their Coffee &amp; Drinks Bubble.
                  </p>
                </div>
                <div className="aqua-design-key-feature__subsection project-fade-block" ref={fadeInRef}>
                  <h4>Recommendations</h4>
                  <p>
                    Not only can users find and use appropriate widgets themselves, but also AQUA can recommend users widgets accordingly by analyzing and learning user behaviour.
                  </p>
                </div>
                <div className="aqua-design-key-feature__subsection aqua-design-key-feature__subsection--recommendation project-fade-block" ref={fadeInRef}>
                  <div className="aqua-design-key-feature__recommendation">
                    <div className="aqua-design-key-feature__recommendation-text">
                      <p>
                        AQUA analyzes and learns each Bubble's usage patterns. Using that information, it suggests widgets that better help the user's intentions.
                      </p>
                      <p>
                        For example, a Travel Widget that becomes a piggy bank bubble before a trip, and becomes the main expenditure bubble during.
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
                      <p>
                        AQUA proactively suggests widgets that help asset management.
                      </p>
                      <p>
                        For example, if AQUA notices a cash surplus, it recommends various savings or investment options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aqua-design-key-feature">
                <h3 className="aqua-design-key-feature__title project-fade-block" ref={fadeInRef}>
                  Flow: A Full Control Over How Your Money Moves
                </h3>
                <p className="project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  AQUA lets users create Flows to and from Bubbles. Flow is a feature that controls the cash flow in the user's account.
                </p>
                <p className="project-fade-block aqua-design-key-feature__intro" ref={fadeInRef}>
                  Users can connect a Bubble to a certain kind of expenditure, controlling their income and evolving the concept of automatic payments and direct debits. They create transfers through a variety of triggers.
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
                  <h4>Triggers</h4>
                  <p>
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

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

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
