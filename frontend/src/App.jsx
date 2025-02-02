import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from "./components/Web3Provider";
import { Landing } from './components/Landing';
import { Navbar } from './components/Navbar';
import { GamingDashboard } from './components/GamingDashboard';
import { GamePerformanceDashboard } from './components/GamePerformanceDashboard';
import { NFTMarketplace } from './components/NFTMarketplace';

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/gaming" element={<GamingDashboard />} />
            <Route path="/performance" element={<GamePerformanceDashboard />} />
            <Route path="/marketplace" element={<NFTMarketplace />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;