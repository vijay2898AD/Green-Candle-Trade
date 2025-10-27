import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Market } from './pages/Market';
import { Portfolio } from './pages/Portfolio';
import { usePortfolioStore } from './store/portfolioStore';
import { useEffect, useState } from 'react';

function App() {
  const initialize = usePortfolioStore((state) => state.initialize);

  const [hasHydrated, setHasHydrated] = useState(false);
  
  useEffect(() => {
    
    usePortfolioStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });


    if (usePortfolioStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
  }, []);

  
  useEffect(() => {
    if (hasHydrated) {
      initialize(10000000); 
    }
  }, [initialize, hasHydrated]);

  if (!hasHydrated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold animate-pulse">Loading Your Portfolio...</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App