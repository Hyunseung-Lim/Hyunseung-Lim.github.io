import React from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import { About } from './about';
import { Projects } from './projects';
import { Publications } from './publications';

export const ResearchPage = () => {
  return(
      <>
        <Topbar/>
          <section id="/"><About/></section>
          <section id="projects"><Projects/></section>
          <section id="publications"><Publications/></section>
        <Footer/>
      </>
  )
}