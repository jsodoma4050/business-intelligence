/**
 * Serverless Function: Stock Price API
 *
 * This function fetches real-time stock prices for major technology competitors
 * from API Ninjas Stock Price endpoint and returns formatted data for the dashboard.
 *
 * Environment Variables Required:
 * - API_KEY: API Ninjas API key for authentication
 *
 * Returns: JSON array with stock data including ticker, company name, price, and timestamp
 */

// Stock ticker symbols and company names to track
const COMPETITORS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' }
];

/**
 * Fetches stock price for a single ticker from API Ninjas
 * @param {string} ticker - Stock ticker symbol
 * @param {string} apiKey - API authentication key
 * @returns {Promise<Object>} Stock data object
 */
async function fetchStockPrice(ticker, apiKey) {
  const url = `https://api.api-ninjas.com/v1/stockprice?ticker=${ticker}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed for ${ticker}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that we received price data
    if (!data || typeof data.price === 'undefined') {
      throw new Error(`Invalid data received for ${ticker}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error.message);
    throw error;
  }
}

/**
 * Main handler function for the serverless endpoint
 * Vercel serverless function signature
 */
export default async function handler(req, res) {
  // Set CORS headers to allow frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests'
    });
  }

  try {
    // Validate API key is configured
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable is not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'API authentication is not properly configured'
      });
    }

    // Fetch stock prices for all competitors in parallel for better performance
    console.log('Fetching stock prices for competitors...');
    const stockPromises = COMPETITORS.map(async (company) => {
      try {
        const stockData = await fetchStockPrice(company.ticker, apiKey);

        return {
          ticker: company.ticker,
          companyName: company.name,
          price: stockData.price,
          // Include additional data if available from API
          ...(stockData.exchange && { exchange: stockData.exchange }),
          success: true
        };
      } catch (error) {
        // Return error state for this specific stock but don't fail entire request
        console.error(`Failed to fetch ${company.ticker}:`, error.message);
        return {
          ticker: company.ticker,
          companyName: company.name,
          price: null,
          error: error.message,
          success: false
        };
      }
    });

    // Wait for all stock price requests to complete
    const stockResults = await Promise.all(stockPromises);

    // Check if at least some stocks were fetched successfully
    const successfulFetches = stockResults.filter(stock => stock.success);

    if (successfulFetches.length === 0) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to fetch any stock data at this time. Please try again later.',
        details: stockResults
      });
    }

    // Prepare response with timestamp
    const response = {
      timestamp: new Date().toISOString(),
      dataPoints: stockResults.length,
      successfulFetches: successfulFetches.length,
      stocks: stockResults
    };

    console.log(`Successfully fetched ${successfulFetches.length}/${stockResults.length} stock prices`);

    // Return successful response
    return res.status(200).json(response);

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in stocks API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching stock data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
