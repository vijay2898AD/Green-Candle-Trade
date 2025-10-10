import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Market } from './pages/Market';
import { Portfolio } from './pages/Portfolio';
import { usePortfolioStore } from './store/portfolioStore';
import { useEffect } from 'react';

function App() {
  const initialize = usePortfolioStore((state) => state.initialize);

  // Initialize the user with starting cash when the app loads
  useEffect(() => {
    initialize(1000000); // Start with ₹10,00,000
  }, [initialize]);


  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
    </div>
  )
}

export default App