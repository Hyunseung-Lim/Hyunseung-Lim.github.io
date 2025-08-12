import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

import { MainPage } from './Pages/MainPage';
import { ResearchPage } from './Pages/ResearchPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<MainPage/>} />
          <Route path='/research' element={<ResearchPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
