// src/services/fmpApi.ts

import axios from 'axios';

const API_KEY = import.meta.env.VITE_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export const getStockQuote = async (symbol: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote/${symbol}`, {
        params: {
            apikey: API_KEY
        }
    });

    // FMP returns an array, even for a single quote
    const data = response.data?.[0];

    if (!data || !data.price) {
      console.warn(`No valid data for ${symbol} from FMP.`);
      return null;
    }

    // Map the FMP response to the format our app expects
    const formattedQuote = {
      symbol: data.symbol,
      price: data.price,
      changesPercentage: data.changesPercentage,
      name: data.name,
    };

    return formattedQuote;

  } catch (error: any) {
    console.error(`Error fetching quote for ${symbol} from FMP:`, error.message);
    return null;
  }
};