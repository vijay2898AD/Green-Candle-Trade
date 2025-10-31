import { usePortfolioStore } from '../store/portfolioStore';
import { NavLink , Link} from 'react-router-dom';
import { useState } from 'react'; 
import { CashModal } from './CashModal';

export const Header = () => {
  const { cash } = usePortfolioStore();
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  return (
    <>
      <header className="text-white p-4 flex flex-col md:flex-row md:justify-between items-center gap-4 sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg border-b border-gray-700/80 shadow-md">
        <Link 
          to="/" 
          className="text-3xl font-bold text-green-400 transition-all duration-200 hover:scale-105 inline-block"
        >
          Green Candle Trade
        </Link>
        <nav className="flex gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? "text-blue-400 scale-105" : "text-white hover:text-green-400 transition-all duration-200 hover:scale-105 inline-block"}>Market</NavLink>
          <NavLink to="/portfolio" className={({isActive}) => isActive ? "text-blue-400 scale-105" : "text-white hover:text-green-400 transition-all duration-200 hover:scale-105 inline-block"}>Portfolio</NavLink>
        </nav>
        <button
          onClick={() => setIsCashModalOpen(true)}
          className="text-lg rounded-lg p-2 transition-all duration-150 ease-in-out hover:bg-gray-700 hover:shadow-md"
        >
          Cash: <span className="font-semibold text-green-400">₹{(cash || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        </button>
      </header>
      
      <CashModal 
        isOpen={isCashModalOpen} 
        onClose={() => setIsCashModalOpen(false)} 
      />
    </>
  );
};