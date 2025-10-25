import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of our data
export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface Transaction {
  symbol:string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
}
type TradeResult = {
  success: boolean;
  message: string;
}

interface PortfolioState {
  cash: number;
  holdings: Holding[];
  transactions: Transaction[];
  initialize: (initialCash: number) => void;
  buyStock: (symbol: string, quantity: number, price: number) => TradeResult;
  sellStock: (symbol: string, quantity: number, price: number) => TradeResult;
}

// Create the store
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cash: 0,
      holdings: [],
      transactions: [],

      // Action to initialize or reset the portfolio
      initialize: (initialCash) => {
        if (get().cash === 0) { // Only initialize if not already set
            set({ cash: initialCash, holdings: [], transactions: [] });
        }
      },

      // Action to buy a stock
      buyStock: (symbol, quantity, price) => {
        const totalCost = quantity * price;
        if (get().cash < totalCost) {
          return { success: false, message: "Not enough cash to complete purchase." };
        }

        set((state) => {
          const newHoldings = [...state.holdings];
          const holdingIndex = newHoldings.findIndex(h => h.symbol === symbol);

          if (holdingIndex > -1) {
            // Stock already in portfolio, update it
            const existingHolding = newHoldings[holdingIndex];
            const newTotalQuantity = existingHolding.quantity + quantity;
            const newAvgPrice = ((existingHolding.avgPrice * existingHolding.quantity) + totalCost) / newTotalQuantity;
            newHoldings[holdingIndex] = { ...existingHolding, quantity: newTotalQuantity, avgPrice: newAvgPrice };
          } else {
            // New stock, add it
            newHoldings.push({ symbol, quantity, avgPrice: price });
          }

          return {
            cash: state.cash - totalCost,
            holdings: newHoldings,
            transactions: [...state.transactions, { symbol, type: 'BUY', quantity, price, timestamp: new Date().toISOString() }],
          };
        });
        return { success: true, message: `Successfully purchased ${quantity} shares of ${symbol}.`};
      },

      // Action to sell a stock (we'll implement this logic later)
      sellStock: (symbol, quantity, price) => {
        const existingHolding = get().holdings.find(h => h.symbol === symbol);

        // Validation: Check if user owns the stock and has enough quantity
        if (!existingHolding) {
          return { success: false, message: "Error: You do not own this stock." };
        }
        if (existingHolding.quantity < quantity) {
          return { success: false, message: `Error: You only own ${existingHolding.quantity} shares of ${symbol}.` };
        }

        const totalProceeds = quantity * price;

        set((state) => {
          let updatedHoldings = [...state.holdings];
          const holdingIndex = updatedHoldings.findIndex(h => h.symbol === symbol);
          const newQuantity = existingHolding.quantity - quantity;

          if (newQuantity === 0) {
            // If selling all shares, remove the holding from the portfolio
            updatedHoldings = updatedHoldings.filter(h => h.symbol !== symbol);
          } else {
            // Otherwise, just update the quantity
            updatedHoldings[holdingIndex] = { ...existingHolding, quantity: newQuantity };
          }

          return {
            cash: state.cash + totalProceeds,
            holdings: updatedHoldings,
            transactions: [...state.transactions, { symbol, type: 'SELL', quantity, price, timestamp: new Date().toISOString() }],
          };
        });
        return { success: true, message: `Successfully sold ${quantity} shares of ${symbol}.` };
      },
    }),
    {
      name: 'tradesim-nse-storage', // name of the item in the storage (must be unique)
    }
  )
);