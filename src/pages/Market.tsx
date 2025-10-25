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
const indian_stock_symbols = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS", "SBIN.NS", "WIPRO.NS"];

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
        {stocks.map(stock => (
          <div key={stock.symbol} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{stock.symbol}</h2>
                <p className={`text-lg font-semibold ${stock.changesPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{stock.price.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-400 truncate">{stock.name}</p>
            </div>
            <button
              onClick={() => handleOpenModal(stock)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Market (NSE Stocks)</h1>
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