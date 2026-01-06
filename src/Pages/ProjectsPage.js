import React from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import { Projects } from './projects';
import { PageLoadGuard } from '../Components/PageLoader/PageLoadGuard';
import { PROJECTS } from '../Data/projectsMeta';

const PROJECT_TILE_ASSETS = Object.values(PROJECTS).flatMap((project) =>
  ['icon', 'hoverIcon', 'iconDark', 'hoverIconDark']
    .map((key) => project[key])
    .filter(Boolean)
    .map((path) => `${process.env.PUBLIC_URL}${path}`)
);

export const ProjectsPage = () => {
  return (
    <PageLoadGuard assets={PROJECT_TILE_ASSETS}>
      <>
        <Topbar />
        <Projects />
        <Footer />
      </>
    </PageLoadGuard>
  );
};
