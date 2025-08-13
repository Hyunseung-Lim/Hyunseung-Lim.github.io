import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';

import { MainPage } from './Pages/MainPage';
import { ResearchPage } from './Pages/ResearchPage';
import { Publications } from './Pages/publications';
import { ProjectsPage } from './Pages/ProjectsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<MainPage/>} />
            <Route path='/research' element={<ResearchPage/>} />
            <Route path='/projects' element={<ProjectsPage/>} />
            <Route path='/publications' element={<Publications/>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
