import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';

import { MainPage } from './Pages/MainPage';
import { ResearchPage } from './Pages/ResearchPage';
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<MainPage/>} />
            <Route path='/research' element={<ResearchPage/>} />
            <Route path='/projects' element={<ProjectsPage/>} />
            <Route path='/projects/datopia' element={<DatopiaProject/>} />
            <Route path='/projects/feed-o-meter' element={<FeedOMeterProject/>} />
            <Route path='/projects/crafteam' element={<CrafteamProject/>} />
            <Route path='/projects/stereohunter' element={<StereoHunterProject/>} />
            <Route path='/projects/elevate' element={<ElevateProject/>} />
            <Route path='/projects/aqua' element={<AquaProject/>} />
            <Route path='/projects/aqua-design' element={<AquaDesignProject/>} />
            <Route path='/projects/brownie' element={<BrownieProject/>} />
            <Route path='/publications' element={<Publications/>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
