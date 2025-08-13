import React from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import { Projects } from './projects';

export const ProjectsPage = () => {
  return (
    <>
      <Topbar />
      <Projects />
      <Footer />
    </>
  );
};