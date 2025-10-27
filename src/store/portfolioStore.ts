import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  cash: number | null;
  holdings: Holding[];
  transactions: Transaction[];
  initialize: (initialCash: number) => void;
  buyStock: (symbol: string, quantity: number, price: number) => TradeResult;
  sellStock: (symbol: string, quantity: number, price: number) => TradeResult;
  addCash: (amount: number) => TradeResult;
  withdrawCash: (amount: number) => TradeResult;
}


export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cash: null,
      holdings: [],
      transactions: [],

      
      initialize: (initialCash) => {
        if (get().cash === null) { 
            set({ cash: initialCash, holdings: [], transactions: [] });
        }
      },

  
      buyStock: (symbol, quantity, price) => {
        const totalCost = quantity * price;
        if ((get().cash || 0) < totalCost) {
          return { success: false, message: "Not enough cash to complete purchase." };
        }

        set((state) => {
          const newHoldings = [...state.holdings];
          const holdingIndex = newHoldings.findIndex(h => h.symbol === symbol);

          if (holdingIndex > -1) {
            const existingHolding = newHoldings[holdingIndex];
            const newTotalQuantity = existingHolding.quantity + quantity;
            const newAvgPrice = ((existingHolding.avgPrice * existingHolding.quantity) + totalCost) / newTotalQuantity;
            newHoldings[holdingIndex] = { ...existingHolding, quantity: newTotalQuantity, avgPrice: newAvgPrice };
          } else {
            newHoldings.push({ symbol, quantity, avgPrice: price });
          }

          return {
            cash: (state.cash || 0) - totalCost,
            holdings: newHoldings,
            transactions: [...state.transactions, { symbol, type: 'BUY', quantity, price, timestamp: new Date().toISOString() }],
          };
        });
        return { success: true, message: `Successfully purchased ${quantity} shares of ${symbol}.`};
      },

      
      sellStock: (symbol, quantity, price) => {
        const existingHolding = get().holdings.find(h => h.symbol === symbol);

      
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
            updatedHoldings = updatedHoldings.filter(h => h.symbol !== symbol);
          } else {
            updatedHoldings[holdingIndex] = { ...existingHolding, quantity: newQuantity };
          }

          return {
            cash: (state.cash || 0) + totalProceeds,
            holdings: updatedHoldings,
            transactions: [...state.transactions, { symbol, type: 'SELL', quantity, price, timestamp: new Date().toISOString() }],
          };
        });
        return { success: true, message: `Successfully sold ${quantity} shares of ${symbol}.` };
      },

      addCash: (amount) => {
        if (amount <= 0) {
          return { success: false, message: "Please enter a positive amount." };
        }
        set((state) => ({
          cash: (state.cash || 0) + amount
        }));
        return { success: true, message: `Successfully added ₹${amount.toLocaleString('en-IN')} to your account.` };
      },


      withdrawCash: (amount) => {
        if (amount <= 0) {
          return { success: false, message: "Please enter a positive amount." };
        }
        if ((get().cash || 0) < amount) {
          return { success: false, message: "Withdrawal failed. Not enough cash." };
        }
        set((state) => ({
          cash: (state.cash || 0) - amount
        }));
        return { success: true, message: `Successfully withdrew ₹${amount.toLocaleString('en-IN')}.` };
      },
    }),
    {
      name: 'tradesim-nse-storage', 
    }
  )
);