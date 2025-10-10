// src/pages/Portfolio.tsx

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { getStockQuote } from '../services/fmpApi';
import { PortfolioChart } from '../components/PortfolioChart'; // 1. IMPORT THE CHART

interface Quote {
  symbol: string;
  price: number;
}
const INITIAL_CASH = 1000000; // Define initial cash as a constant

export const Portfolio = () => {
    const { holdings, sellStock, cash, transactions } = usePortfolioStore(); // Get transactions from store
    const [quotes, setQuotes] = useState<Record<string, Quote>>({});
    const [loading, setLoading] = useState(true);
    const [sellingSymbol, setSellingSymbol] = useState<string | null>(null);

    // ... (keep the useEffect and handleSell functions exactly as they are)
    useEffect(() => {
        const fetchAllQuotes = async () => {
            if (holdings.length === 0) { setLoading(false); return; }
            try {
                setLoading(true);
                const holdingSymbols = holdings.map(h => h.symbol);
                const quotePromises = holdingSymbols.map(symbol => getStockQuote(symbol));
                const resolvedQuotes = await Promise.all(quotePromises);
                const quotesMap = resolvedQuotes.reduce((acc, quote) => {
                    if (quote) acc[quote.symbol] = quote;
                    return acc;
                }, {} as Record<string, Quote>);
                setQuotes(quotesMap);
            } catch (error) { console.error("Failed to fetch quotes for portfolio:", error); }
            finally { setLoading(false); }
        };
        fetchAllQuotes();
    }, [holdings]);

    const handleSell = async (symbol: string) => {
        const quantityStr = prompt(`How many shares of ${symbol} do you wish to sell?`);
        if (!quantityStr) return;
        const quantity = parseInt(quantityStr, 10);
        if (isNaN(quantity) || quantity <= 0) { alert("Please enter a valid quantity."); return; }
        try {
            setSellingSymbol(symbol);
            const quote = await getStockQuote(symbol);
            sellStock(symbol, quantity, quote.price);
            alert(`Transaction successful: Sold ${quantity} shares of ${symbol}.`);
        } catch (error) { alert("Could not complete the sale. Please try again."); }
        finally { setSellingSymbol(null); }
    };


    const totalHoldingsValue = holdings.reduce((total, holding) => { /* ... (keep this calculation as is) */
        const currentPrice = quotes[holding.symbol]?.price || 0;
        return total + (currentPrice * holding.quantity);
    }, 0);

    const totalPandL = holdings.reduce((total, holding) => { /* ... (keep this calculation as is) */
        const currentPrice = quotes[holding.symbol]?.price || 0;
        if (currentPrice === 0) return total;
        const pnl = (currentPrice - holding.avgPrice) * holding.quantity;
        return total + pnl;
    }, 0);

    // ... (keep the loading and empty portfolio returns as they are)
    if (loading) { return <div className="p-4 text-center">Loading portfolio data...</div>; }
    if (holdings.length === 0 && transactions.length === 0) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold">Your Portfolio is empty.</h1>
                <p className="text-gray-400">Visit the Market page to begin trading!</p>
            </div>
        );
    }


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
            
            {/* --- SUMMARY SECTION (No changes here) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* ... (keep all 4 summary divs as they are) */}
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total Value</h3>
                    <p className="text-2xl font-bold">₹{(totalHoldingsValue + cash).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Holdings Value</h3>
                    <p className="text-2xl font-bold">₹{totalHoldingsValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Cash</h3>
                    <p className="text-2xl font-bold text-green-400">₹{cash.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total P&L</h3>
                    <p className={`text-2xl font-bold ${totalPandL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalPandL >= 0 ? '+' : ''}₹{totalPandL.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </p>
                </div>
            </div>

            {/* 2. RENDER THE CHART */}
            <PortfolioChart transactions={transactions} initialCash={INITIAL_CASH} />

            {/* --- HOLDINGS TABLE (No changes here) --- */}
            <div className="bg-gray-800 rounded-lg overflow-x-auto mt-6">
                 {holdings.length > 0 && (
                    <table className="min-w-full text-left">
                        <thead className="text-gray-400 border-b border-gray-700">
                            {/* ... (keep the table head as is) */}
                             <tr>
                                <th className="p-3">Symbol</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Avg. Price</th>
                                <th className="p-3">Current Price</th>
                                <th className="p-3">Market Value</th>
                                <th className="p-3">Total P&L</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding) => {
                                // ... (keep the table row mapping as is)
                                const currentPrice = quotes[holding.symbol]?.price || 0;
                                const marketValue = currentPrice * holding.quantity;
                                const pnl = (currentPrice - holding.avgPrice) * holding.quantity;
                                const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400';

                                return (
                                    <tr key={holding.symbol} className="border-t border-gray-700">
                                        <td className="p-3 font-bold">{holding.symbol}</td>
                                        <td className="p-3">{holding.quantity}</td>
                                        <td className="p-3">₹{holding.avgPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                        <td className="p-3 font-semibold">₹{currentPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                        <td className="p-3">₹{marketValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                        <td className={`p-3 font-bold ${pnlColor}`}>
                                            {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleSell(holding.symbol)}
                                                disabled={sellingSymbol === holding.symbol}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors disabled:bg-gray-500"
                                            >
                                                {sellingSymbol === holding.symbol ? '...' : 'Sell'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 )}
            </div>
        </div>
    );
};