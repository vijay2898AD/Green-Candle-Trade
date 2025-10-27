// --- FIX: All necessary imports are here ---
import { useState, useEffect } from 'react';
import { getAllStockQuotes } from '../services/fmpApi';
import { usePortfolioStore } from '../store/portfolioStore';
import { TradeModal } from '../components/TradeModal';
import { StockCardSkeleton } from '../components/StockCardSkeleton';

// --- FIX: The type for our stock object ---
interface Stock {
  symbol: string;
  price: number;
  name: string;
  changesPercentage: number;
}

// --- FIX: The list of stocks to fetch ---
const indian_stock_symbols = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS", "SBIN.NS", "WIPRO.NS",
  "BHARTIARTL.NS", "ITC.NS", "LTIM.NS", "BAJFINANCE.NS", "KOTAKBANK.NS", "HCLTECH.NS", "AXISBANK.NS",
  "TATAMOTORS.NS", "MARUTI.NS", "SUNPHARMA.NS", "ASIANPAINT.NS", "LT.NS", "TATASTEEL.NS", "NTPC.NS",
  "ULTRACEMCO.NS", "BAJAJFINSV.NS", "TITAN.NS", "NESTLEIND.NS", "M&M.NS", "JSWSTEEL.NS", "POWERGRID.NS",
  "ADANIPORTS.NS", "CIPLA.NS", "ONGC.NS", "INDUSINDBK.NS", "DRREDDY.NS", "BPCL.NS", "GRASIM.NS",
  "TATACONSUM.NS", "HDFCLIFE.NS", "SBILIFE.NS", "HEROMOTOCO.NS"
];

export const Market = () => {
  // --- FIX: All state variables are declared here ---
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  
  const buyStock = usePortfolioStore((state) => state.buyStock);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all stocks from our local JSON
        const allStockData = await getAllStockQuotes();

        // 2. Filter them based on our symbol list
        const validStockData = allStockData.filter(stock => 
          indian_stock_symbols.includes(stock.symbol)
        );

        if (validStockData.length === 0 && indian_stock_symbols.length > 0) {
            throw new Error("Failed to load any stock data from mock source. Is stockData.json in /public?");
        }
        setStocks(validStockData);

      } catch (err: any) {
        console.error("Error in fetchStocks:", err);
        setError(err.message || "Could not load market data. Check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);
  
  const handleOpenModal = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const handleConfirmBuy = (symbol: string, quantity: number, price: number) => {
    const result = buyStock(symbol, quantity, price);
    // Show an alert based on the result from the store
    alert(result.message);
  };

  const renderContent = () => {
     if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indian_stock_symbols.map(symbol => <StockCardSkeleton key={symbol} />)}
        </div>
      );
     }
    if (error) {
      return (
        <div className="bg-red-900 border border-red-400 text-red-100 px-4 py-3 rounded-lg text-center">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.map(stock => {
          // Calculate all the values we need
          const isPositive = stock.changesPercentage >= 0;
          const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
          const absoluteChange = (stock.price * stock.changesPercentage) / 100;
          const symbolLetter = stock.symbol.charAt(0);

          return (
            <div 
              key={stock.symbol} 
              // New styling for the card
              className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 flex flex-col transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1"
            >
              {/* This div holds all content *except* the button */}
              <div className="flex-grow">
                
                {/* 1. Placeholder Logo */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-xl font-bold text-indigo-700">{symbolLetter}</span>
                  </div>
                </div>

                {/* 2. Company Name */}
                <h2 className="text-base font-medium text-gray-700 truncate mb-1">{stock.name}</h2>
                
                {/* 3. Price */}
                <p className="text-xl font-bold text-gray-900 mb-1">
                  ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
                
                {/* 4. Change (Absolute and Percentage) */}
                <div className={`text-sm font-medium ${changeColor}`}>
                  <span>{isPositive ? '+' : ''}{absoluteChange.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  <span className="ml-1">({isPositive ? '+' : ''}{stock.changesPercentage.toFixed(2)}%)</span>
                </div>
              </div>

              {/* 5. Buy Button (Kept for functionality) */}
              <button
                onClick={() => handleOpenModal(stock)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-150 hover:shadow-md hover:-translate-y-px"
              >
                Buy
              </button>
            </div>
          );
        })}

      </div>
    );
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-white transition-all duration-200 hover:scale-105 inline-block ">Market (NSE Stocks)</h1>
        {renderContent()}
      </div>
      
      <TradeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stock={selectedStock}
        onConfirm={handleConfirmBuy}
      />
    </>
  );
};