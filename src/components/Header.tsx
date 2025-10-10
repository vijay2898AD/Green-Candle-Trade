// src/components/Header.tsx

import { usePortfolioStore } from '../store/portfolioStore';
import { NavLink } from 'react-router-dom';

export const Header = () => {
  const { cash } = usePortfolioStore();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Green Candle Trade</div>
      <nav className="flex gap-4">
        <NavLink to="/" className={({isActive}) => isActive ? "text-blue-400" : ""}>Market</NavLink>
        <NavLink to="/portfolio" className={({isActive}) => isActive ? "text-blue-400" : ""}>Portfolio</NavLink>
      </nav>
      <div className="text-lg">
        {/* --- THE FIX IS ON THIS LINE --- */}
        Cash: <span className="font-semibold text-green-400">₹{(cash || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
      </div>
    </header>
  );
};