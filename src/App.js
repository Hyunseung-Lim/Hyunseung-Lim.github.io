import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ScrollToTop } from './Components/ScrollToTop';

import { MainPage } from './Pages/MainPage';
import { ResearchPage } from './Pages/ResearchPage';
import { About } from './Pages/about';
import { Publications } from './Pages/publications';
import { ProjectsPage } from './Pages/ProjectsPage';
import { DatopiaProject } from './Pages/Projects/Datopia/Datopia';
import { FeedOMeterProject } from './Pages/Projects/FeedOMeter/FeedOMeter';
import { CrafteamProject } from './Pages/Projects/Crafteam/Crafteam';
import { AquaProject } from './Pages/Projects/Aqua/Aqua';
import { AquaDesignProject } from './Pages/Projects/AquaDesign/AquaDesign';
import { BrownieProject } from './Pages/Projects/Brownie/Brownie';
import { ElevateProject } from './Pages/Projects/Elevate/Elevate';
import { StereoHunterProject } from './Pages/Projects/StereoHunter/StereoHunter';
import { PanoramaProject } from './Pages/Projects/Panorama/Panorama';
import { MovieOffRecord } from './Pages/OffRecords/Movie/movie';
import { WritingOffRecord } from './Pages/OffRecords/Writing/writing';
import { FashionOffRecord } from './Pages/OffRecords/Fashion/fashion';
import { CookOffRecord } from './Pages/OffRecords/Cook/cook';
import { HipHopOffRecord } from './Pages/OffRecords/HipHop/hiphop';
import { PenguinOffRecord } from './Pages/OffRecords/Penguin/penguin';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path='/' element={<MainPage/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/research' element={<ResearchPage/>} />
            <Route path='/projects' element={<ProjectsPage/>} />
            <Route path='/projects/datopia' element={<DatopiaProject/>} />
            <Route path='/projects/feed-o-meter' element={<FeedOMeterProject/>} />
            <Route path='/projects/crafteam' element={<CrafteamProject/>} />
            <Route path='/projects/stereohunter' element={<StereoHunterProject/>} />
            <Route path='/projects/elevate' element={<ElevateProject/>} />
            <Route path='/projects/aqua' element={<AquaProject/>} />
            <Route path='/projects/aqua-design' element={<AquaDesignProject/>} />
            <Route path='/projects/panorama' element={<PanoramaProject/>} />
            <Route path='/projects/brownie' element={<BrownieProject/>} />
            <Route path='/publications' element={<Publications/>} />
            <Route path='/off-records/movie' element={<MovieOffRecord />} />
            <Route path='/off-records/writing' element={<WritingOffRecord />} />
            <Route path='/off-records/fashion' element={<FashionOffRecord />} />
            <Route path='/off-records/cook' element={<CookOffRecord />} />
            <Route path='/off-records/hip-hop' element={<HipHopOffRecord />} />
            <Route path='/off-records/penguin' element={<PenguinOffRecord />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
