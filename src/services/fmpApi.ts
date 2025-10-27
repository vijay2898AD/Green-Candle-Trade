interface MockStock {
  symbol: string;
  price: number;
  changesPercentage: number;
  name: string;
}


let allStocksCache: MockStock[] | null = null;


export const getAllStockQuotes = async (): Promise<MockStock[]> => {
  if (allStocksCache) {
    return allStocksCache;
  }
  
  try {
    const response = await fetch('/stockData.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: MockStock[] = await response.json();
    allStocksCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching mock stock data:", error);
    return [];
  }
};


export const getStockQuote = async (symbol: string) => {
  try {
    const allStocks = await getAllStockQuotes();
    const quote = allStocks.find(stock => stock.symbol === symbol);

    if (!quote) {
      console.warn(`No mock data for ${symbol}.`);
      return null;
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    return quote;
  } catch (error: any) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return null;
  }
};