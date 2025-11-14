/**
 * Serverless Function: Earnings Transcript API
 *
 * This function fetches earnings call transcripts from API Ninjas
 * Earnings Transcript endpoint and returns formatted data for the dashboard.
 *
 * Environment Variables Required:
 * - API_KEY: API Ninjas API key for authentication
 *
 * Query Parameters:
 * - ticker: Stock ticker symbol (e.g., MSFT)
 * - year: Year of the earnings call (e.g., 2024)
 * - quarter: Quarter number (1-4)
 *
 * Returns: JSON object with transcript data including date, participants, and full transcript
 */

/**
 * Fetches earnings transcript from API Ninjas
 * @param {string} ticker - Stock ticker symbol
 * @param {string} year - Year of the earnings call
 * @param {string} quarter - Quarter number (1-4)
 * @param {string} apiKey - API authentication key
 * @returns {Promise<Object>} Transcript data object
 */
async function fetchEarningsTranscript(ticker, year, quarter, apiKey) {
  const url = `https://api.api-ninjas.com/v1/earningstranscript?ticker=${ticker}&year=${year}&quarter=${quarter}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No transcript found for ${ticker} ${year} Q${quarter}. The earnings call may not be available yet or the parameters may be incorrect.`);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that we received transcript data
    if (!data || !data.transcript) {
      throw new Error(`No transcript data available for ${ticker} ${year} Q${quarter}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching transcript for ${ticker}:`, error.message);
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

    // Extract and validate query parameters
    const { ticker, year, quarter } = req.query;

    // Validate required parameters
    if (!ticker) {
      return res.status(400).json({
        error: 'Missing parameter',
        message: 'Ticker symbol is required'
      });
    }

    if (!year) {
      return res.status(400).json({
        error: 'Missing parameter',
        message: 'Year is required'
      });
    }

    if (!quarter) {
      return res.status(400).json({
        error: 'Missing parameter',
        message: 'Quarter is required'
      });
    }

    // Validate parameter formats
    const tickerUpper = ticker.toUpperCase().trim();
    const yearNum = parseInt(year);
    const quarterNum = parseInt(quarter);

    if (!/^[A-Z]{1,5}$/.test(tickerUpper)) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'Ticker must be 1-5 letters'
      });
    }

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2030) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'Year must be between 2000 and 2030'
      });
    }

    if (isNaN(quarterNum) || quarterNum < 1 || quarterNum > 4) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'Quarter must be between 1 and 4'
      });
    }

    // Fetch transcript data
    console.log(`Fetching transcript for ${tickerUpper} ${yearNum} Q${quarterNum}...`);
    const transcriptData = await fetchEarningsTranscript(
      tickerUpper,
      yearNum.toString(),
      quarterNum.toString(),
      apiKey
    );

    // Prepare response
    const response = {
      ...transcriptData,
      fetchedAt: new Date().toISOString()
    };

    console.log(`Successfully fetched transcript for ${tickerUpper} ${yearNum} Q${quarterNum}`);

    // Return successful response
    return res.status(200).json(response);

  } catch (error) {
    // Handle errors
    console.error('Error in transcript API:', error);

    // Return appropriate error response
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({
      error: statusCode === 404 ? 'Not found' : 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
