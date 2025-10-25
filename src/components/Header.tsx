import { usePortfolioStore } from '../store/portfolioStore';
import { NavLink } from 'react-router-dom';

export const Header = () => {
  const { cash } = usePortfolioStore();

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
      <div className="text-xl font-bold">Green Candle Trade</div>
      <nav className="flex gap-4">
        <NavLink to="/" className={({isActive}) => isActive ? "text-blue-400" : "transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1"}>Market</NavLink>
        <NavLink to="/portfolio" className={({isActive}) => isActive ? "text-blue-400" : "text-white hover:text-blue-300 transition-colors duration-150"}>Portfolio</NavLink>
      </nav>
      <div className="text-lg">
        {/* --- THE FIX IS ON THIS LINE --- */}
        Cash: <span className="font-semibold text-green-400">₹{(cash || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
      </div>
    </header>
  );
};