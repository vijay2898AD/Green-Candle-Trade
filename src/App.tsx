import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Market } from './pages/Market';
import { Portfolio } from './pages/Portfolio';
import { usePortfolioStore } from './store/portfolioStore';
import { useEffect, useState } from 'react';

function App() {
  const initialize = usePortfolioStore((state) => state.initialize);

  const [hasHydrated, setHasHydrated] = useState(false);
  // Initialize the user with starting cash when the app loads
  useEffect(() => {
    // This tells Zustand to set hasHydrated=true *after* it finishes loading
    usePortfolioStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Also set it true in case it's already done
    if (usePortfolioStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
  }, []);

  // --- CHANGED: This useEffect now depends on hasHydrated ---
  // This ensures initialize() is only called AFTER state is loaded
  useEffect(() => {
    if (hasHydrated) {
      initialize(1000000); // Start with ₹10,00,000
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