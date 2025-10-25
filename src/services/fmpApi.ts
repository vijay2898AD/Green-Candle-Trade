// src/services/fmpApi.ts

// --- Mock Stock Data Type ---
interface MockStock {
  symbol: string;
  price: number;
  changesPercentage: number;
  name: string;
}

// --- Cached Data ---
// We cache the data so we don't fetch the file on every single quote request.
let allStocksCache: MockStock[] | null = null;

/**
 * Fetches all stock quotes from the local JSON file.
 * In a real app, you'd add error handling here.
 */
export const getAllStockQuotes = async (): Promise<MockStock[]> => {
  if (allStocksCache) {
    return allStocksCache;
  }
  
  try {
    // This path is relative to the 'public' folder
    const response = await fetch('/stockData.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: MockStock[] = await response.json();
    allStocksCache = data; // Cache the result
    return data;
  } catch (error) {
    console.error("Error fetching mock stock data:", error);
    return [];
  }
};

/**
 * Gets a single stock quote from the already-fetched data.
 */
export const getStockQuote = async (symbol: string) => {
  try {
    const allStocks = await getAllStockQuotes();
    const quote = allStocks.find(stock => stock.symbol === symbol);

    if (!quote) {
      console.warn(`No mock data for ${symbol}.`);
      return null;
    }
    // Simulate a small delay as if it were a real API
    await new Promise(resolve => setTimeout(resolve, 50));
    return quote;
  } catch (error: any) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return null;
  }
};