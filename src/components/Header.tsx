import { usePortfolioStore } from '../store/portfolioStore';
import { NavLink , Link} from 'react-router-dom';
import { useState } from 'react'; // <-- 1. Import useState
import { CashModal } from './CashModal';

export const Header = () => {
  const { cash } = usePortfolioStore();
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
        <Link 
          to="/" 
          className="text-xl font-bold text-white hover:text-gray-300 transition-colors duration-150"
        >
          Green Candle Trade
        </Link>
        <nav className="flex gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? "text-blue-400" : "transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1"}>Market</NavLink>
          <NavLink to="/portfolio" className={({isActive}) => isActive ? "text-blue-400" : "text-white hover:text-blue-300 transition-colors duration-150"}>Portfolio</NavLink>
        </nav>
        <button
          onClick={() => setIsCashModalOpen(true)}
          className="text-lg rounded-lg p-2 transition-all duration-150 ease-in-out hover:bg-gray-700 hover:shadow-md"
        >
          Cash: <span className="font-semibold text-green-400">₹{(cash || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        </button>
      </header>
      
      {/* --- 6. ADD THE MODAL COMPONENT --- */}
      <CashModal 
        isOpen={isCashModalOpen} 
        onClose={() => setIsCashModalOpen(false)} 
      />
    </>
  );
};